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
    this.listenForUpdatedOrders();
    this.listenForDeletedOrders();
  }

  ngOnDestroy(): void {
    
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
        this.getListOrdenes(); // Actualizar la lista de órdenes
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
        console.log('Estatus actualizado');
        this.getListOrdenes(); // Actualizar la lista de órdenes
      });
    });
  }

  listenForNewOrders() {
    this.socketService.onOrderAdded().subscribe((order: Order) => {
      console.log('Nueva orden recibida:', order);
      this.listOrder.push(order);
      this.toastr.success('Nueva orden agregada', 'Orden añadida');
    });
  }
  
  listenForUpdatedOrders() {
    this.socketService.onOrderUpdated().subscribe((order: Order) => {
      console.log('Orden actualizada recibida:', order);
      const index = this.listOrder.findIndex(o => o.id === order.id);
      if (index !== -1) {
        this.listOrder[index] = order;
      } else {
        this.listOrder.push(order);
      }
      this.toastr.info('Orden actualizada', 'Órdenes actualizadas');
    });
  }
  
  listenForDeletedOrders() {
    this.socketService.onOrderDeleted().subscribe((id: number) => {
      console.log('Orden eliminada recibida:', id);
      this.listOrder = this.listOrder.filter(order => order.id !== id);
      this.toastr.warning('Orden eliminada', 'Órdenes actualizadas');
    });
  }
  
}
