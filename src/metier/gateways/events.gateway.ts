import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Initialise events');
  }

  handleConnection(client: any) {
    console.log('Connection events');
  }

  handleDisconnect(client: any) {
    console.log('Disconnect events');
  }
}
