import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from 'src/app/interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.endpoint);
  }

  onOrderAdded(): Observable<Order> {
    return new Observable<Order>(observer => {
      this.socket.on('orderAdded', (order: Order) => {
        observer.next(order);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
