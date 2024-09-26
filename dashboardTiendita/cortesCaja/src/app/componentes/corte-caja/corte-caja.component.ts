
import { Component, OnInit } from '@angular/core';
import { CorteCajaService } from 'src/app/services/corte.service';
import { CorteCaja, Denominacion, PagoTarjeta, PedidosTransitos, Retiro, Transferencia } from 'src/app/interfaces/corte'; // Asegúrate de importar el tipo correcto
import { DatePipe } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';
import { TransferenciaService } from 'src/app/services/transferencia.service';

@Component({
  selector: 'app-corte-caja',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.css']
})
export class CorteCajaComponent implements OnInit {
  selectedDate: string = '';
  cortes: CorteCaja[] = [];
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
    private orderService: OrderService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.cargarTransferencias();
    this.cargarPedidosTransito();
  }

  onSubmit(): void {
    
    if (this.selectedDate) {
      this.corteService.getCortesByDate(this.selectedDate).subscribe((data: CorteCaja[]) => {
        this.cortes = data;
      });
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

  calcularDiferencia(corte: CorteCaja): void {
    // Calcula el total de denominaciones
    const totalDenominaciones = corte.denominaciones.reduce((acc, denom) => acc + (denom.denominacion * denom.cantidad), 0);
    corte.totalEfectivo = totalDenominaciones; // Asigna el total de denominaciones a totalEfectivo

    // Calcula los totales de otros campos
    const totalTransferencias = corte.transferencias.reduce((acc, trans) => acc + trans.monto, 0);
    const totalRetiros = corte.retiros.reduce((acc, retiro) => acc + retiro.monto, 0);
    const totalPagosTarjeta = corte.pagosTarjeta.reduce((acc, pago) => acc + pago.monto, 0);
    const totalPedidoTransitos = corte.pedidosTransitos.reduce((acc, pedido) => acc + pedido.monto, 0);

    // Calcula el total calculado y la diferencia
    corte.totalCalculado = totalDenominaciones + totalTransferencias + totalRetiros + totalPagosTarjeta + totalPedidoTransitos - corte.recargas;

    if (corte.totalCalculado > corte.ventaTotal) {
      this.resultado = `Sobra $${corte.totalCalculado - corte.ventaTotal}`;
    } else if (corte.totalCalculado < corte.ventaTotal) {
      this.resultado = `Falta $${corte.ventaTotal - corte.totalCalculado}`;
    } else {
      this.resultado = 'Todo cuadra';
    }
  }



  

  actualizarCorte(corte: CorteCaja): void {
    // Ensure that denominaciones are being sent correctly with their IDs
    const corteActualizado: CorteCaja = {
      ...corte,
      denominaciones: corte.denominaciones.map(denom => ({
        id: denom.id,  // Include the id of each denominacion
        denominacion: denom.denominacion,
        cantidad: denom.cantidad,
        cajaId: denom.cajaId // If cajaId is needed, include it here
      })),
      transferencias: corte.transferencias.map(transferencia => ({
        id: transferencia.id, // Incluir el id de cada transferencia
        monto: transferencia.monto,
      })),
      retiros: corte.retiros.map(retiro => ({
        id: retiro.id, // Incluir el id de cada retiro
        monto: retiro.monto,
        descripcion: retiro.descripcion // Incluir la descripción si es relevante
      })),

    };
  
    this.corteService.actualizarCorte(corteActualizado).subscribe(
      () => {
        console.log('Corte actualizado exitosamente');
      },
      (error) => {
        console.error('Error al actualizar el corte:', error);
      }
    );
  }

  calcularTotal() {
    const totalDenominaciones = this.denominaciones.reduce((acc, denom) => acc + (denom.denominacion * denom.cantidad), 0);
    const totalTransferencias = this.transferencias.reduce((acc, trans) => acc + trans.monto, 0);
    const totalRetiros = this.retiros.reduce((acc, retiro) => acc + retiro.monto, 0);
    const totalPagosTarjeta = this.pagosTarjeta.reduce((acc, pago) => acc + pago.monto, 0);
    const totalPedidoTransitos = this.pedidosTransitos.reduce((acc, pedido) => acc + pedido.monto, 0);

    // Calcula el total calculado sumando las entradas y restando las recargas
    this.totalCalculado = totalDenominaciones + totalTransferencias + totalRetiros + totalPagosTarjeta + totalPedidoTransitos - this.recargas;

    // Condiciones para determinar el resultado (falta, sobra o todo cuadra)
    if (this.totalCalculado > this.ventaTotal) {
      this.resultado = `Sobra $${(this.totalCalculado - this.ventaTotal).toFixed(2)}`;
    } else if (this.totalCalculado < this.ventaTotal) {
      this.resultado = `Falta $${(this.ventaTotal - this.totalCalculado).toFixed(2)}`;
    } else {
      this.resultado = 'Todo cuadra';
    }
  }



  
  // Método para actualizar el estado del pedido en tránsito
  actualizarEstadoPedido(corteId: number | undefined, pedido: PedidosTransitos , nuevoEstado: string): void {
    if (corteId !== undefined && pedido.id !== undefined) {
      pedido.estatus = nuevoEstado; // Actualiza el estado en el objeto local
      this.corteService.actualizarEstadoPedido(corteId, pedido).subscribe(
        () => {
          console.log('Estado actualizado exitosamente');
        },
        (error) => {
          console.error('Error al actualizar el estado:', error);
          // Puedes manejar el error como desees
          // Por ejemplo, revertir el cambio si es necesario
          pedido.estatus = pedido.estatus; // Vuelve al estado anterior
        }
      );
    } else {
      console.error('ID de corte o pedido no definido');
    }
  }
}
