import { Order } from 'src/app/interfaces/order';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private myAppUrl: string;
  private myApiUrl: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/ordenes/';
    this.headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
  }

  getListOrdenes(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.myAppUrl}${this.myApiUrl}`, { headers: this.headers });
  }
  getOrdersByDate(date: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.myAppUrl}${this.myApiUrl}date/${date}`);
  }

  getLastOrderNumber(date: string): Observable<{ lastOrderNumber: number }> {
    return this.http.get<{ lastOrderNumber: number }>(`${this.myAppUrl}${this.myApiUrl}lastOrderNumber/${date}`);
  }

  deleteOrden(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, { headers: this.headers });
  }

  saveOrder(order: Order): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, order, { headers: this.headers });
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.myAppUrl}${this.myApiUrl}${id}`, { headers: this.headers });
  }

  updateOrden(id: number, order: Order): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, order, { headers: this.headers });
  }

  checkOrderNumberExists(orderNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.myAppUrl}${this.myApiUrl}checkOrderNumber/${orderNumber}`);
  }

  getPedidosTransito(numeroCaja: number,date: string, startTime: string, endTime: string): Observable<{ efectivo: number, nameClient: string}[]> {
    return this.http.get<Order[]>(`${this.myAppUrl}${this.myApiUrl}/transito/${numeroCaja}/${date}/${startTime}/${endTime}`);
  }
}
