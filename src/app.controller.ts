import { Get, Controller, Param, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import {User} from './table/index';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Param() params): string {
    // console.log(params.id);
    return this.appService.root();
  }
  @Get('/user')
  async haha() {
    const users =  await User.findAll();
    return users;
    // res.status(200).json('haha');
  }
}
