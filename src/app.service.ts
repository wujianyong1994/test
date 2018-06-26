import { Injectable } from '@nestjs/common';
import {User} from './table/index';

@Injectable()
export class AppService {
  async root() {
    const users =  await User.findAll();
    // console.log(users);
    return users;
  }
}
