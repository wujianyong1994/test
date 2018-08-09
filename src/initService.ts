import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'

export async function init(){
    // const httpsOptions = {
    //     key: fs.readFileSync('./secrets/private-key.pem'),
    //     cert: fs.readFileSync('./secrets/public-certificate.pem')
    // };
    const server = express();
    const app = await NestFactory.create(AppModule, server);
    app.enableCors();
    await app.init();
    // server.listen(3008, () => {
    //     console.log('server running');
    // })
    http.createServer(server).listen(3001);
    // await app.listen(3001);
}

export async function initHttps(){
    const httpsOptions = {
        key: fs.readFileSync('../Nginx/2_thebestguy.club.key'),
        cert: fs.readFileSync('../Nginx/1_thebestguy.club_bundle.crt')
    };
    const server = express();
    const app = await NestFactory.create(AppModule, server);
    app.enableCors();
    await app.init();
    https.createServer(httpsOptions, server).listen(3001);
}
