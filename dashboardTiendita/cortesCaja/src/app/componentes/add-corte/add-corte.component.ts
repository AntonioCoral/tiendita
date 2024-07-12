import { CorteCaja, Denominacion, Transferencia, Retiro, PagoTarjeta, PedidosTransitos } from './../../interfaces/corte';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CorteCajaService } from 'src/app/services/corte.service';

@Component({
  selector: 'app-add-corte',
  templateUrl: './add-corte.component.html',
  styleUrls: ['./add-corte.component.css']
})
export class AddCorteComponent {
  nombre: string = '';
  numeroCaja: number = 0;
  totalEfectivo: number = 0;
  totalTransferencias: number = 0;
  totalRetiros: number = 0;
  totalPagosTarjeta: number = 0;
  totalPedidoTransito: number = 0;
  ventaTotal: number = 0;
  recargas: number = 0;
  denominaciones: Denominacion[] = [
    { denominacion: 1000, cantidad: 0 },
    { denominacion: 500, cantidad: 0 },
    { denominacion: 200, cantidad: 0 },
    { denominacion: 100, cantidad: 0 },
    { denominacion: 50, cantidad: 0 },
    { denominacion: 20, cantidad: 0 },
    { denominacion: 10, cantidad: 0 },
    { denominacion: 5, cantidad: 0 },
    { denominacion: 2, cantidad: 0 },
    { denominacion: 1, cantidad: 0 },
    { denominacion: 0.50, cantidad: 0 }
  ];
  transferencias: Transferencia[] = [{ monto: 0 }];
  retiros: Retiro[] = [{ monto: 0, descripcion: '' }];
  pagosTarjeta: PagoTarjeta[] = [{ monto: 0 }];
  pedidosTransitos: PedidosTransitos[] = [{ monto: 0, descripcion: '', estatus: '' }];
  totalCalculado: number = 0;
  resultado: string = '';

  constructor(private corteService: CorteCajaService, private router: Router) {}

  agregarTransferencia() {
    this.transferencias.push({ monto: 0 });
  }

  agregarRetiro() {
    this.retiros.push({ monto: 0 });
  }

  agregarPagoTarjeta() {
    this.pagosTarjeta.push({ monto: 0 });
  }

  agregarPedidoTransito() {
    this.pedidosTransitos.push({ monto: 0 });
  }

  calcularTotal() {
    // Calcula el total de denominaciones
    const totalDenominaciones = this.denominaciones.reduce((acc, denom) => acc + (denom.denominacion * denom.cantidad), 0);
    this.totalEfectivo = totalDenominaciones; // Asigna el total de denominaciones a totalEfectivo
  
    // Calcula los totales de otros campos
    const totalTransferencias = this.transferencias.reduce((acc, trans) => acc + trans.monto, 0);
    const totalRetiros = this.retiros.reduce((acc, retiro) => acc + retiro.monto, 0);
    const totalPagosTarjeta = this.pagosTarjeta.reduce((acc, pago) => acc + pago.monto, 0);
    const totalPedidoTransitos = this.pedidosTransitos.reduce((acc, pedido) => acc + pedido.monto, 0);
  
    // Calcula el total calculado y la diferencia
    this.totalCalculado = totalDenominaciones + totalTransferencias + totalRetiros + totalPagosTarjeta + totalPedidoTransitos - this.recargas;
  
    if (this.totalCalculado > this.ventaTotal) {
      this.resultado = `Sobra $${this.totalCalculado - this.ventaTotal}`;
    } else if (this.totalCalculado < this.ventaTotal) {
      this.resultado = `Falta $${this.ventaTotal - this.totalCalculado}`;
    } else {
      this.resultado = 'Todo cuadra';
    }
  }
  

  onSubmit() {
    const denominacionesCorte: Denominacion[] = this.denominaciones.filter(denom => denom && denom.denominacion != null && denom.cantidad != null);
    const transferenciasCorte: Transferencia[] = this.transferencias.filter(trans => trans && trans.monto != null);
    const retirosCorte: Retiro[] = this.retiros.filter(retiro => retiro && retiro.monto != null);
    const pagosTarjetaCorte: PagoTarjeta[] = this.pagosTarjeta.filter(pago => pago && pago.monto != null);
    const pedidoTransitoCorte: PedidosTransitos[] = this.pedidosTransitos.filter(transito => transito && transito.monto != null);

    const cajaData: CorteCaja = {
      nombre: this.nombre,
      numeroCaja: this.numeroCaja,
      totalEfectivo: this.totalEfectivo,
      totalTransferencias: transferenciasCorte.reduce((acc, trans) => acc + trans.monto, 0),
      totalRetiros: retirosCorte.reduce((acc, retiro) => acc + retiro.monto, 0),
      totalPagosTarjeta: pagosTarjetaCorte.reduce((acc, pago) => acc + pago.monto, 0),
      totalPedidoTransito: pedidoTransitoCorte.reduce((acc, transito) => acc + transito.monto, 0),
      ventaTotal: this.ventaTotal,
      recargas: this.recargas,
      denominaciones: denominacionesCorte,
      transferencias: transferenciasCorte,
      retiros: retirosCorte,
      pagosTarjeta: pagosTarjetaCorte,
      pedidosTransitos: pedidoTransitoCorte,
      fecha: new Date()
    };

    this.corteService.crearCorte(cajaData).subscribe(
      response => {
        console.log('Corte creado:', response);
        this.router.navigate(['/corte-caja']);
      },
      error => {
        console.error('Error creando el corte:', error);
      }
    );
  }
}
