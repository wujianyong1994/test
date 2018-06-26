import { Get, Controller, Param, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import * as https from 'https';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async root() {
    // console.log(params.id);
    // res.status(HttpStatus.OK).json(await this.appService.root());
    // console.log(333);
    return await this.appService.root()
  }
  @Get('/user')
  async user() {
    return 11;
    // res.status(200).json('haha');
  }
  @Get('/getToken')
  async getToken(@Res() R) {
     // tslint:disable-next-line:max-line-length
     https.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxdd06f38bac305c95&secret=a202a88ea4b5ea8dbcc519af2997890e`, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      const buffers = [];
      res.on('data', (d) => {
        // process.stdout.write(d);
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

  }
}
