import { Get, Controller, Param, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async root(@Param() params) {
    // console.log(params.id);
    return await this.appService.root();
  }
  @Get('/user')
  async user() {
    return 11;
    // res.status(200).json('haha');
  }
}
