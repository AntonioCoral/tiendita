import { Cliente } from './../interfaces/cliente';
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
    this.socket = io('https://codeconnectivity.com/', {
      path: '/socket.io',
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
      transports: ['websocket'],  // Solo WebSocket
      secure: true
      
     
        
      
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  onOrderAdded(): Observable<Order> {
    return new Observable<Order>(observer => {
      this.socket.on('orderAdded', (order: Order) => {
        observer.next(order);
      });
    });
  }

  onOrderUpdated(): Observable<Order> {  // Eliminado el argumento innecesario
    return new Observable<Order>(observer => {
      this.socket.on('orderUpdated', (order: Order) => {
        observer.next(order);
      });
    });
  }

  onOrderDeleted(): Observable<number> {
    return new Observable<number>(observer => {
      this.socket.on('orderDeleted', (id: number) => {
        observer.next(id);
      });
    });
  }

  emitOrderAdded(order: Order) {
    this.socket.emit('orderAdded', order);
  }
}
