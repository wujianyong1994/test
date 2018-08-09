import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import {User} from './table/index';
import {redis} from 'redis';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
    async intercept( context: ExecutionContext, stream$: Observable<any>) {
    // console.log('Before...');
    const now = Date.now();
    const url = context.getArgs()[0].url;
    if (url.indexOf('/login') < 0 && url.indexOf('getAccess_token') < 0 && url.indexOf('testGet') < 0  && url.indexOf('getSign') < 0  && url.indexOf('weAppLogin') < 0 ) {
    // 获取res
    try{
        const res = context.getArgs()[0].res;
        const sessionid = context.getArgs()[0].headers.sessionid;
        console.log(sessionid)
        const userId = await redis.get(sessionid);
        console.log('userid' , userId);
        if (!userId) {
            res.status(401).json({status: 401})
            // res.status(302).location('http://192.168.2.115:3002/login').end();
            // res.redirect(301, 'http://192.168.2.115:3002/login');
            return;
            // return;
            // return stream$.pipe();
            // return stream$.subscribe(v => {console.log('1')});
            // return (Observable.create(observer => {
            //     observer.next(1);
            // })).subscribe();
        } else {
            const user = await User.findById(userId);
            if (!user) {
                res.status(401).json({status: 401});
                // res.location('http://192.168.2.115:3002/login');
                return;
            }
            // 更新过期时间
            redis.expire(sessionid, 1800);
        }
    }catch (err) {
        console.log(err); // 捕获错误
    }
    }

    return stream$.pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
    );
  }
}