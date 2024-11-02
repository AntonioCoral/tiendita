import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EfectivoService {
  private apiUrl = 'https://codeconnectivity.com/api/api/';  // Reemplaza con tu URL de API

  constructor(private http: HttpClient) {}

  // Función para obtener el total de efectivo en un rango de órdenes
  obtenerTotalEfectivoPorRango(ordenInicial: number, ordenFinal: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total-efectivo?rangoInicio=${ordenInicial}&rangoFin=${ordenFinal}`);
  }
}
