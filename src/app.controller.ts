import { Get, Post, Controller, Param, Res, Req, HttpStatus, Body, Query, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import * as https from 'https';
import request from 'sync-request';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import {redis} from 'redis';
const config = require('../config.json')
const appid = config.wx.appid;
const secret = config.wx.secret;
import {Dto} from './dto'
import {AuthInterceptor} from './authInterceptor'

@UseInterceptors(AuthInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  async getBaseToken(){
    const token = await redis.get('baseToken');
    if (token === null) {
      let r;
      // tslint:disable-next-line:max-line-length
      await https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      const buffers = [];
      res.on('data', (d) => {
        // process.stdout.write(d);
        buffers.push(d);
      });
      res.on('end', (chunk) => {
        const wholeData = Buffer.concat(buffers);
        r = JSON.parse(wholeData.toString());
        if (!r || !r.access_token) return '';
        redis.set('baseToken', r.access_token, 'EX', 7000);
        return r.access_token;
      });

      }).on('error', (e) => {
        console.error(e);
        return '';
      });

    }
    return token;
  }

  @Post('/login')
  async login( @Req() req, @Res() res, @Body() body) {
    const user = await this.appService.login(body);
    const date = (new Date()).getTime();
    const key = 'Session:' + date + ':' + user.loginName;
    redis.set('Session:' + date + ':' + user.loginName, user.ID, 'EX', 1800);
    return res.status(200).json({sid: key});
  }
  @Post('/addGroup')
  async addGroup( @Req() req, @Res() res, @Body() body) {
    const sid = req.headers.sessionid;
    const userId = await redis.get(sid);
    const r = await this.appService.addGroup(body, userId);
    if (r) {
      return res.status(200).json({success: true});
    } else {
      return res.status(200).json({success: false, msg: '新增失败'});
    }
  }
  @Get('/listGroup')
  async listGroup(@Req() req, @Query() params) {
    const sid = req.headers.sessionid;
    const userId = await redis.get(sid);
    const pageIndex = 1;
    const pageSize = 10;
    const r = await this.appService.listGroup(userId, pageIndex, pageSize);
    // return res.status(200).json({success: true, data: r});
    return {success: true, data: r};
  }
  @Get('/testGet')
  async testGet(  @Query() params) {
    console.log('params', params);
    // res.status(200).json({success: true});
    return [122, 22];
  }
  @Get('/user')
  async getuser() {
    redis.set('key', 100, 'EX', 2);
    console.log(await redis.get('key'));
    setTimeout(async () => {
      console.log(await redis.get('key'))
    }, 3000)
    return await this.appService.root()
  }
  @Get('/getAccess_token')
  async getAccess_token(@Res() R, @Query() params) {
      console.log(222222);
      const code = params.code;
      // const access_token =await this.getBaseToken();
      // 获取用户openid
      // tslint:disable-next-line:max-line-length
      const r = JSON.parse(request('GET', `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`).getBody().toString());
      console.log(r);
      if (r && r.openid) {
        // 获取用户信息
        // tslint:disable-next-line:max-line-length
        const res = JSON.parse(request('GET', `https://api.weixin.qq.com/sns/userinfo?access_token=${r.access_token}&openid=${r.openid}&lang=zh_CN`).getBody().toString());
        console.log(res);
        return R.status(200).json(res)
      }
      return R.status(200).json({success: false, msg: '用户查询失败'});
  }
  @Get('/getToken')
  async getToken(@Res() R, @Query() params) {
      try{
      const signature = params.signature;
      const timestamp = params.timestamp;
      const nonce = params.nonce;
      const echostr = params.echostr;
      console.log(signature, timestamp, nonce, echostr);
      const TOKEN = 'hahaha'
      const array = [TOKEN, timestamp, nonce];
      const a = _.sortBy(array);
      const clearText = a.join('');
      console.log(clearText);
      const sha1 = crypto.createHash('sha1');
      sha1.update(clearText);
      const sign = sha1.digest('hex');
      console.log(sign);
      if (sign === signature) {
        return R.status(HttpStatus.OK).send(echostr);
      }
      return R.status(HttpStatus.OK).send(false);
      }catch (err) {
        console.log(err); // 捕获错误
      }

  }

}
