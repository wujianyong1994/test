import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
const apps =  require('express')();
const server = require('http').Server(apps);
const io = require('socket.io')(server, {path: '/room'});

export async function init(){
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3001);
}

export async function initHttps(){
    const httpsOptions = {
        key: fs.readFileSync('../Nginx/2_thebestguy.club.key'),
        cert: fs.readFileSync('../Nginx/1_thebestguy.club_bundle.crt')
    };
    const server = express();
    const app = await NestFactory.create(AppModule, server);
    app.enableCors({origin: 'http://localhost:3000'});
    await app.init();
    https.createServer(httpsOptions, server).listen(3001);
}

export async function socket(){
    // io.on('connection', function(client){
    //     client.on('event', function(data){});
    //     client.on('disconnect', function(){});
    // });

    console.log('3005 ing...')
    server.listen(3005); // 注意这个不是程序的端口号：是socket的端口号
    io.on('connection', (socket) => {
        // console.log('a user connected');
        socket.on('chat', (msg) => {
            io.emit('chat', msg);
        });
    });

}