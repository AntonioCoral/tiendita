// corte-caja.component.ts

import { Component, OnInit } from '@angular/core';
import { CorteCajaService } from 'src/app/services/corte.service';
import { CorteCaja, PedidosTransitos } from 'src/app/interfaces/corte'; // Asegúrate de importar el tipo correcto

@Component({
  selector: 'app-corte-caja',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.css']
})
export class CorteCajaComponent implements OnInit {
  selectedDate: string = '';
  cortes: CorteCaja[] = [];

  constructor( private corteService: CorteCajaService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.selectedDate) {
      this.corteService.getCortesByDate(this.selectedDate).subscribe((data: CorteCaja[]) => {
        this.cortes = data;
      });
    }
  }

  calcularDiferencia(corte: CorteCaja): number {
    const totalIngresos =
      corte.totalEfectivo +
      corte.totalTransferencias +
      corte.totalPagosTarjeta +
      corte.totalPedidoTransito + // Asegúrate de incluir totalPedidoTransito si existe en tu interfaz
      corte.totalRetiros;
    const totalEgresos = corte.ventaTotal + corte.recargas;
    return totalEgresos - totalIngresos;
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
