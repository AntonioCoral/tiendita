import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:443/api/ordenes';  // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) {}

  getOrdersByDelivery(nameDelivery: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/delivery/${nameDelivery}`);
  }
}
