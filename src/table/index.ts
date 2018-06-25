import { User  as user } from './User';
import { Component } from '@nestjs/common';
import * as Db from '../db';
let User;
export  function init(){
    const db = Db.db;
    User =  db.import<any, any>('./models/user');
}

export {User}
