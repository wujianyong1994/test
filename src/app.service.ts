import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import * as moment from 'moment';
import {redis} from 'redis';

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
    const groupIds = _.map(r, 'groupId');
    const g = await Group.findAll({
      where: {
        id: groupIds
      }
    })
    const groups = JSON.parse(JSON.stringify(g));
    const p = [];
    groupIds.forEach( item => {
      p.push(Connect.findAll({
        where: {
          groupId: item
        }
      }))
    });
    const pe = await Promise.all(p);
    let index = 0;
    for (const item of groupIds){
      const userList = [];
      for (const c of pe[index]){
        let u = await redis.get('user:' + c.userId);
        console.log('u:', u);
        if (u) {
          userList.push(JSON.parse(u));
        } else {
          u = await User.findOne({where: {ID: c.userId}})
          userList.push(u);
          redis.set('user:' + c.userId, JSON.stringify(u));
        }
      }
      console.log(userList);
      groups[index].users = userList;
      index++;
    }
    return groups;
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
        headimgurl: wxUserInfo.headimgurl,
        name: wxUserInfo.nickname
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
  async getGroup(groupId){
    return await Group.findOne({
      where: {id: groupId}
    })
  }
  async getUserById(id: number) {
    const user = await User.findById(id);
    return user;
  }
  async updateUserInfo(user, userId){
    return await User.update(user, {where: {ID: userId}})
  }
}
