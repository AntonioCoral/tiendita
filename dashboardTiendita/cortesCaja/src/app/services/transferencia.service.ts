import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/ordenes/transferencias/';
  }

  getTransferencias(numeroCaja: number, date: string, startTime: string, endTime: string): Observable<{ transferenciaPay: number }[]> {
    return this.http.get<{ transferenciaPay: number }[]>(`${this.myAppUrl}${this.myApiUrl}${numeroCaja}/${date}/${startTime}/${endTime}`);
  }
}
