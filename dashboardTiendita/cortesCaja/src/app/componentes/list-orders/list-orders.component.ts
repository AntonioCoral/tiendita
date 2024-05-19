import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/interfaces/order';
import { OrderService } from 'src/app/services/order.service';
import { SocketService } from 'src/app/services/conexion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit, OnDestroy {

  listOrder: Order[] = [];
  loading: boolean = false;

  constructor(
    private _orderService: OrderService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.getListOrdenes();
    this.listenForNewOrders();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  getListOrdenes() {
    this.loading = true;
    this._orderService.getListOrdenes().subscribe((data: Order[]) => {
      this.listOrder = data;
      this.loading = false;
    });
  }

  deleteOrden(id: number) {
    this.loading = true;
    this._orderService.deleteOrden(id).subscribe(() => {
      this.toastr.warning('La orden fue eliminada', 'Orden eliminada');
      this.getListOrdenes();
    });
  }

  updateRepartidor(id: number, repartidor: string) {
    this._orderService.getOrder(id).subscribe((order: Order) => {
      order.nameDelivery = repartidor;
      this._orderService.updateOrden(id, order).subscribe(() => {
        console.log(`Repartidor actualizado para la orden ${id}`);
      });
    });
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  updateEstadoPedido(id: number, status: string) {
    this._orderService.getOrder(id).subscribe((order: Order) => {
      order.status = status;
      this._orderService.updateOrden(id, order).subscribe(() => {
        console.log('Estatus actualizado')
      });
    });
  }

  getInputValuee(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  listenForNewOrders() {
    this.socketService.onOrderAdded().subscribe((order: Order) => {
      this.listOrder.push(order);
      this.toastr.success('Nueva orden agregada', 'Orden añadida');
    });
  }
}
