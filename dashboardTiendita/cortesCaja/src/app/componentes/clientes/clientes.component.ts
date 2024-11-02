import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  searchForm: FormGroup;
  foundClient: any;
  isNewClient = false;
  newClientForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private clientsService: ClienteService,
    private router: Router
  ) {
    this.searchForm = this.formBuilder.group({
      query: ''
    });
    this.newClientForm = this.formBuilder.group({
      nombre: '',
      apellido: '',
      direction: '',
    
    });
  }

  searchClient() {
    const query = this.searchForm.value.query.trim();
    if (query === '') {
      this.foundClient = null;
      this.isNewClient = false;
      return;
    }

    this.clientsService.searchClient(query).subscribe(
      (response) => {
        console.log('Response:', response);  // Para depuración
        if (response && response) {
          this.foundClient = response; // Suponiendo que la respuesta es un arreglo de clientes
          this.isNewClient = false;
        } else {
          this.foundClient = null;
          this.isNewClient = true;
        }
      },
      (error) => {
        console.error('Error al buscar cliente:', error);
        this.foundClient = null;
        this.isNewClient = true;
      }
    );
  }

  addNewClient() {
    const newClientData = this.newClientForm.value;
    this.clientsService.addClient(newClientData).subscribe(
      (response) => {
        this.foundClient = response;
        this.isNewClient = false;
        
      },
      (error) => {
        console.error('Error al agregar cliente:', error);
      }
    );
  }

  goToAddOrder() {
    this.router.navigate(['/add'], {
      queryParams: {
        id: this.foundClient.id,
        nombre: this.foundClient.nombre,
        direction: this.foundClient.direction,
        
      }
    
    });
  }
}
