import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// @WebSocketGateway({path : '/room', origins: 'http://www.thebestguy.club'})
@WebSocketGateway(3005, {path : '/room'})
export class EventsGateway {
  @WebSocketServer() server;

//   @SubscribeMessage('chat')
//   chat(client: any, payload: any): Observable<WsResponse<any>> | any {
//     const { name } = payload;
//     console.log(client);
//     console.log(payload);
//     return of({
//         event: 'chat',
//         data: payload
//     });
//     // return of(payload);
//   }
  @SubscribeMessage('chat')
  chat(client: any, data: any) {
    this.server.emit('chat', data);
    console.log(222, this.server);
    console.log(111,  this.server.io.opts.transports);
    // console.log(JSON.stringify(this.server.transports));
  }

}