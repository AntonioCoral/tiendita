import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CorteCaja, PedidosTransitos } from '../interfaces/corte';

@Injectable({
  providedIn: 'root'
})
export class CorteCajaService {
  private apiUrl = 'https://codeconnectivity.com/api/api/caja/';

  constructor(private http: HttpClient) {}

  // Método para crear un nuevo corte de caja
  crearCorte(corte: CorteCaja): Observable<CorteCaja> {
    return this.http.post<CorteCaja>(this.apiUrl, corte)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para obtener todos los cortes de caja
  obtenerCortes(): Observable<CorteCaja[]> {
    return this.http.get<CorteCaja[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCortesByDate(date: string): Observable<CorteCaja[]> {
  return this.http.get<CorteCaja[]>(`${this.apiUrl}date/${date}`)
    .pipe(
      map(cortes => cortes.map(corte => ({
        ...corte,
        denominaciones: corte.denominaciones.map(denom => ({
          id: denom.id, // Asegúrate de que el id se mantenga
          denominacion: denom.denominacion,
          cantidad: denom.cantidad
        }))
      })))
    );
}


  getUltimoCorteByCaja(numeroCaja: number): Observable<CorteCaja> {
    return this.http.get<CorteCaja>(`${this.apiUrl}/ultimo-corte/${numeroCaja}`);
  }

  actualizarCorte(corte: CorteCaja): Observable<any> {
    return this.http.put(`${this.apiUrl}${corte.id}`, corte);
  }
  

  actualizarEstadoPedido(corteId: number, pedido: PedidosTransitos): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${corteId}/pedidos/${pedido.id}`, pedido);
  }

  // Método para manejar errores de la petición HTTP
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    throw error;
  }
}
