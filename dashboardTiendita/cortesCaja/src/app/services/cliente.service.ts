import { Cliente } from 'src/app/interfaces/cliente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/clientes/';
  }

  searchClient(query: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.myAppUrl}${this.myApiUrl}search/${query}`);
  }

  addClient(newClientData: any): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, newClientData);
  }

  getListClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  saveCliente(cliente: Cliente): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, cliente);
  }

  getCliente(telefono: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.myAppUrl}${this.myApiUrl}${telefono}`);
  }

  updateCliente(id: number, order: Cliente): Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, id);
  }
}
