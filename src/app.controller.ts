import { Get, Controller, Param, Res, HttpStatus, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as https from 'https';
import request from 'sync-request';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import {redis} from 'redis';
const appid= 'wxdd06f38bac305c95';
const secret = 'a202a88ea4b5ea8dbcc519af2997890e';

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
        redis.set('baseToken',r.access_token,'EX',7000);
        return r.access_token;
      });

      }).on('error', (e) => {
        console.error(e);
        return '';
      });
    
    }
    return token;
  }

  // @Get()
  // async root(@Res() res) {
  //   return res.status(HttpStatus.OK).redirect('http://thebestguy.club:5000');
  // }
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
      const code = params.code;
      //const access_token =await this.getBaseToken();
      //获取用户openid
      const r = JSON.parse(request('GET', `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`).getBody().toString());
      if (r && r.openid) {
        //获取用户信息
        const res = JSON.parse(request('GET', `https://api.weixin.qq.com/sns/userinfo?access_token=${r.access_token}&openid=${r.openid}`).getBody().toString());
        return R.status(200).json(res)
      }
      return R.status(200).json({success:false,msg:'用户查询失败'});
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
