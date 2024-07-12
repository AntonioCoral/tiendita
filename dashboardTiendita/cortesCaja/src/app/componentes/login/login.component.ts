import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      isDelivery: ['false', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password, isDelivery } = this.loginForm.value;

      // Aquí se maneja la lógica de autenticación
      if (username === 'admin' && password === 'adminTienda') {
        this.toastr.success('Login successful as Admin');
        this.router.navigate(['/list-orders']);
      } else if (password === 'repartidor' && isDelivery === 'true') {
        this.toastr.success('Login successful as Delivery');
        this.router.navigate(['/delivery-orders', username]); // Asume que el nombre del usuario es el nombre del repartidor
      } else {
        this.toastr.error('Invalid credentials');
      }
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
