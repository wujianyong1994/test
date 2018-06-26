import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import {User} from './table/index';

@Injectable()
export class AppService {
  async root() {
    const users =  await User.findAll();
    return users;
  }
  async getToken() {

  }
}
