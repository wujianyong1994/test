import { Get, Controller, Param, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

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
}
