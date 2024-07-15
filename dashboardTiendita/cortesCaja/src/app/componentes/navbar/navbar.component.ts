import { Component, OnInit, Renderer2 } from '@angular/core';
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

  constructor(private router: Router, private toastr: ToastrService, private renderer: Renderer2) {}

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

  authenticate() {
    const { username, password } = this.authCredentials;

    // Aquí deberías realizar la lógica de autenticación real.
    if (username === 'admin' && password === 'aljaC0ir') {
      const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
      authModal.hide();
      this.router.navigate(['/corte-caja']);
    } else {
      this.toastr.error('Credenciales incorrectas');
    }
  }
}
