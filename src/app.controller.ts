import { Get, Controller, Param, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

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
    return 11;
    // res.status(200).json('haha');
  }
}
