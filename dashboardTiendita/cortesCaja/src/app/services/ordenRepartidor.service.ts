import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private myAppUrl: string;
  private myApiUrl: string;
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/ordenes/';
    this.socket = io(`${this.myAppUrl}${this.myApiUrl}`);
    
  }

  
  getOrdersByDelivery(nameDelivery: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.myAppUrl}${this.myApiUrl}/delivery/${nameDelivery}`);
  }

  onOrderAdded(): Observable<Order> {
    return new Observable<Order>(observer => {
      this.socket.on('orderAdded', (order: Order) => {
        observer.next(order);
      });
    });
  }

  onOrderUpdated(): Observable<Order> {
    return new Observable<Order>(observer => {
      this.socket.on('orderUpdated', (order: Order) => {
        observer.next(order);
      });
    });
  }

  onOrderDeleted(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('orderDeleted', (orderId: string) => {
        observer.next(orderId);
      });
    });
  }
}