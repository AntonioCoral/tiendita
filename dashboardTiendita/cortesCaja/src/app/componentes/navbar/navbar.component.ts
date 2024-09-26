import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  authCredentials = { username: '', password: '' };
  passwordVisible = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private toastr: ToastrService, 
    private renderer: Renderer2
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  openAuthModal() {
    this.closeOffcanvasMenu();

    const authModal = new bootstrap.Modal(document.getElementById('authModal'), {
      keyboard: false,
      backdrop: 'static'
    });
    authModal.show();
  }

  closeOffcanvasMenu() {
    const offcanvas = document.querySelector('.offcanvas');
    if (offcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas) || new bootstrap.Offcanvas(offcanvas);
      bsOffcanvas.hide();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Validación de credenciales
      if (username === 'admin' && password === 'aljaC0ir') {
        this.toastr.success('Credenciales correctas');
        this.router.navigate(['/corte-caja']);
        // Cerrar el modal después del inicio de sesión exitoso
        const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
        authModal.hide();
      } else {
        this.toastr.error('Credenciales incorrectas');
        this.loginForm.reset();  // Reiniciar el formulario después de un error
      }
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
