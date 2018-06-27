import { Get, Controller, Param, Res, HttpStatus, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as https from 'https';
import * as _ from 'lodash';
import * as crypto from 'crypto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async root(@Res() res) {
    return res.status(HttpStatus.OK).redirect('http://thebestguy.club:5000');
  }
  @Get('/user')
  async getuser() {
    return await this.appService.root()
  }
  @Get('/getAccess_token')
  async getAccess_token(@Res() R, @Query() params) {
      const code = params.code;
      // tslint:disable-next-line:max-line-length
      https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxdd06f38bac305c95&secret=a202a88ea4b5ea8dbcc519af2997890e&code=${code}&grant_type=authorization_code`, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      const buffers = [];
      res.on('data', (d) => {
        process.stdout.write(d);
        buffers.push(d);
      });
      res.on('end', (chunk) => {
        const wholeData = Buffer.concat(buffers);
        R.status(HttpStatus.OK).json(JSON.parse(wholeData.toString()));
      });

      }).on('error', (e) => {
        console.error(e);
        return e;
      });
    // res.status(200).json('haha');
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
      // R.status(HttpStatus.OK).json(false);
      // tslint:disable-next-line:max-line-length
      // https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxdd06f38bac305c95&secret=a202a88ea4b5ea8dbcc519af2997890e`, (res) => {
      // console.log('statusCode:', res.statusCode);
      // console.log('headers:', res.headers);
      // const buffers = [];
      // res.on('data', (d) => {
      //   // process.stdout.write(d);
      //   buffers.push(d);
      // });
      // res.on('end', (chunk) => {
      //   const wholeData = Buffer.concat(buffers);
      //   R.status(HttpStatus.OK).json(JSON.parse(wholeData.toString()));
      // });

      // }).on('error', (e) => {
      //   console.error(e);
      //   return e;
      // });

  }

  
}
