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
    // const p = [];
    // groupIds.forEach( item => {
    //   p.push(Connect.findAll({
    //     where: {
    //       groupId: item
    //     }
    //   }))
    // });
    // const pe = await Promise.all(p);
    // let index = 0;
    // for (const item of groupIds){
    //   const userList = [];
    //   for (const c of pe[index]){
    //     let u = await redis.get('user:' + c.userId);
    //     console.log('u:', u);
    //     if (u) {
    //       userList.push(JSON.parse(u));
    //     } else {
    //       u = await User.findOne({where: {ID: c.userId}})
    //       userList.push(u);
    //       redis.set('user:' + c.userId, JSON.stringify(u));
    //     }
    //   }
    //   console.log(userList);
    //   groups[index].users = userList;
    //   index++;
    // }
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
    let isInGroup = true;
    const userIds = _.map(c, 'userId');
    if (!_.includes(userIds, Number(userId))) {
      isInGroup = false
    }
    const p = _.filter(c, item => (item.userId === Number(userId)));
    let isAdmin = false;
    if (p && p.length > 0 && p[0].isAdmin === 1 ) {
      isAdmin = true;
    }
    const users = await User.findAll({
      attributes: ['mobile', 'name', 'ID'],
      where: {
        ID: userIds
      }
    })
    return {data: users, isInGroup, isAdmin};
  }
  async joinGroup(groupId, userId){
    const c = await Connect.findAll({where: {groupId, userId}});
    if (c.length > 0) {
      return '已经加入该通讯组'
    }
    const r = await Connect.create({
      groupId,
      userId
    })
    return '加入成功';
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
  async delGroup(groupId, userId){
    const group = await Group.findOne({where: {id: groupId} });
    if (!group) {
      return {success: false, msg: '删除失败,该通讯组不存在'}
    }
    const connect = await Connect.findOne({where: {groupId, userId}});
    if (!connect || connect.isAdmin === 0) {
      return {success: false, msg: '删除失败,您不是该组管理员'};
    }
    const r = await Group.destroy({where: {id: groupId}});
    const c = await Connect.destroy({where: {groupId}});
    return {success: true};
  }

  async kickUser(groupId, userId, operId){
    const group = await Group.findOne({where: {id: groupId} });
    if (!group) {
      return {success: false, msg: '该通讯组不存在'}
    }
    const connect = await Connect.findOne({where: {groupId, userId:operId}});
    if (!connect || connect.isAdmin === 0) {
      return {success: false, msg: '踢出失败,您不是该组管理员'};
    }
    if (userId === operId) {
      return {success: false, msg: '不可以删除自己'}
    }
    const c = await Connect.destroy({where: { groupId, userId}})
    return {success: true}
  }
}
