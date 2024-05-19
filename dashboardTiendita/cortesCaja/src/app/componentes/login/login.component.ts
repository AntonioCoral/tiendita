import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string= '';

  constructor() { }

  login() {
    // Aquí deberías implementar la lógica de inicio de sesión
    console.log('Correo electrónico:', this.email);
    console.log('Contraseña:', this.password);
  }
}
