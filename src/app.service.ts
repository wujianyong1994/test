import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import * as moment from 'moment';

import {User, Group, Connect} from './table/index';

@Injectable()
export class AppService {
  async root() {
    const users =  await User.findAll();
    return users;
  }
  async getToken() {

  }

  async login(body) {
    console.log(body);
    const user = await User.findOne({
      where: {loginName: body.userName}
    })
    return user;
  }
  async addGroup(body, userId) {
    console.log(body);
    const r = await Group.create({
      name: body.name,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      createUserId: userId
    })
    const c = await Connect.create({
      groupId: r.id,
      userId,
      isAdmin: true
    })
    return r;
  }
  async listGroup(userId, pageIndex, pageSize){
    const r = await Connect.findAll({
      where: {userId},
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize
    });
    console.log(r);
    const groupIds = _.map(r, 'groupId');
    const g = await Group.findAll({
      where: {
        id: groupIds
      }
    })
    return g;
  }
  async loginOrRegister(wxUserInfo){
    let user = await User.findOne({where: {openid: wxUserInfo.openid}});
    if (!user) {
      user = await User.create({
        nickname: wxUserInfo.nickname,
        openid: wxUserInfo.openid,
        sex: wxUserInfo.sex,
        province: wxUserInfo.province,
        city: wxUserInfo.city,
        country: wxUserInfo.country,
        headimgurl: wxUserInfo.headimgurl
      });
    }
    return user;
  }
  async listGroupDetail(userId, groupId){
    const c = await Connect.findAll({
      where: {
        groupId
      }
    });
    const userIds = _.map(c, 'userId');
    if (!_.includes(userIds, Number(userId))) {
      return 'error1'
    }
    const users = await User.findAll({
      attributes: ['mobile', 'name'],
      where: {
        ID: userIds
      }
    })
    return users;
  }

  async getUserById(id: number) {
    const user = await User.findById(id);
  }
}
