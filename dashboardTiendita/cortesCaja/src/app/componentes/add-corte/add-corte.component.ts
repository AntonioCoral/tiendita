import { EfectivoService } from './../../services/efectivo.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferenciaService } from 'src/app/services/transferencia.service';
import { CorteCajaService } from 'src/app/services/corte.service';
import { OrderService } from 'src/app/services/order.service';
import { Transferencia, CorteCaja, Denominacion, Retiro, PagoTarjeta, PedidosTransitos } from 'src/app/interfaces/corte';
import { Order } from 'src/app/interfaces/order';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-corte',
  templateUrl: './add-corte.component.html',
  styleUrls: ['./add-corte.component.css']
})
export class AddCorteComponent implements OnInit {
  corte: CorteCaja | null = null; // Corte cargado si es actualización
  nombre: string = '';
  numeroCaja: number = 0;
  totalEfectivo: number = 0;
  totalTransferencias: number = 0;
  totalRetiros: number = 0;
  totalPagosTarjeta: number = 0;
  totalPedidoTransito: number = 0;
  ventaTotal: number = 0;
  recargas: number = 0;
  ultimoCorte: CorteCaja | null = null;//Almacena el ultimo corte de la caja
  ordenInicial: number = 0;
  ordenFinal: number = 0;
  totalEfectivoOrdenes: number = 0;

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
  transferencias: Transferencia[] = [];
  retiros: Retiro[] = [{ monto: 0, descripcion: '' }];
  pagosTarjeta: PagoTarjeta[] = [{ monto: 0 }];
  pedidosTransitos: PedidosTransitos[] = [];
  totalCalculado: number = 0;
  resultado: string = '';
  startTime: string = '07:00'; // Hora de inicio predeterminada
  endTime: string = '15:00'; // Hora de fin predeterminada

  constructor(
    private corteService: CorteCajaService,
    private transferenciaService: TransferenciaService,
    private efectivoService: EfectivoService,
    private orderService: OrderService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute, // Para detectar si estamos en modo "editar"
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.cargarTransferencias();
    this.cargarPedidosTransito();
   
  }
  // Cargar el último corte de la caja seleccionada
  obtenerUltimoCorte(): void {
    this.corteService.getUltimoCorteByCaja(this.numeroCaja).subscribe(
      (ultimoCorte: CorteCaja) => {
        this.ultimoCorte = ultimoCorte;
      },
      (error) => {
        console.error('Error al obtener el último corte:', error);
        this.ultimoCorte = null; // Si no hay corte, reseteamos la variable
      }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  cargarTransferencias(): void {
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!; // Formato de fecha 'YYYY-MM-DD'
    this.transferenciaService.getTransferencias(this.numeroCaja, today, this.startTime, this.endTime).subscribe(
      (transferencias) => {
        this.transferencias = transferencias.map(t => ({ monto: t.transferenciaPay }));
        this.calcularTotal();
      },
      (error) => {
        console.error('Error cargando transferencias:', error);
      }
    );
  }

  cargarPedidosTransito(): void {
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!; // Formato de fecha 'YYYY-MM-DD'
    this.orderService.getPedidosTransito(this.numeroCaja, today, this.startTime, this.endTime).subscribe(
      (pedidos) => {
        this.pedidosTransitos = pedidos.map(p => ({
          monto: p.efectivo, 
          descripcion: p.nameClient
        }));
        this.calcularTotal();
      },
      (error) => {
        console.error('Error cargando pedidos en tránsito:', error);
      }
    );
  }
   // Método para calcular el total de efectivo en un rango de órdenes
   calcularEfectivoPorOrdenes(): void {
    if (this.ordenInicial > 0 && this.ordenFinal > 0 && this.ordenFinal >= this.ordenInicial) {
      this.efectivoService.obtenerTotalEfectivoPorRango(this.ordenInicial, this.ordenFinal).subscribe(
        (response: any) => {
          // Accede a la propiedad 'totalEfectivo'
          this.totalEfectivoOrdenes = response.totalEfectivo;
        },
        (error) => {
          console.error('Error al obtener el total de efectivo:', error);
        }
      );
    }
  }
  
  onNumeroCajaChange(): void {
    this.cargarTransferencias();
    this.cargarPedidosTransito();
    this.obtenerUltimoCorte();
    
  }

  agregarTransferencia() {
    this.transferencias.push({ monto: 0 });
  }

  agregarRetiro() {
    this.retiros.push({ monto: 0, descripcion: '' });
  }

  agregarPagoTarjeta() {
    this.pagosTarjeta.push({ monto: 0 });
  }

  agregarPedidoTransito() {
    this.pedidosTransitos.push({ monto: 0, descripcion: '' });
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
      fecha: new Date(),
      totalCalculado: 0
    };

    this.corteService.crearCorte(cajaData).subscribe(
      response => {
        console.log('Corte creado:', response);
        this.toastr.success(`Corte creado con éxito!!`);
        this.router.navigate(['/corte-caja']);
      },
      error => {
        console.error('Error creando el corte:', error);
      }
    );
  }
}
