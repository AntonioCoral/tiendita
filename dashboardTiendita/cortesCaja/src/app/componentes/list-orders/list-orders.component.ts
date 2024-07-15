import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
  selectedDate: string = '';
  showModal: boolean = false;
  authCredentials = { username: '', password: '' };
  selectedOrderId: number | undefined;

  constructor(
    private _orderService: OrderService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.getListOrdenes();
    this.listenForNewOrders();
    this.listenForUpdatedOrders();
    this.listenForDeletedOrders();
  }

  ngOnDestroy(): void {}

  getListOrdenes() {
    this.loading = true;
    this._orderService.getOrdersByDate(this.selectedDate).subscribe((data: Order[]) => {
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

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  updateRepartidor(id: number | undefined, repartidor: string) {
    if (id === undefined) {
      console.error('ID is undefined');
      return;
    }
    const scrollPosition = window.scrollY;
    this._orderService.getOrder(id).subscribe((order: Order) => {
      order.nameDelivery = repartidor;
      this._orderService.updateOrden(id, order).subscribe(() => {
        console.log(`Repartidor actualizado para la orden ${id}`);
        const index = this.listOrder.findIndex(o => o.id === id);
        if (index !== -1) {
          this.listOrder[index].nameDelivery = repartidor;
        }
        window.scrollTo(0, scrollPosition);
      });
    });
  }

  updateEstadoPedido(id: number | undefined, status: string) {
    if (id === undefined) {
      console.error('ID is undefined');
      return;
    }
    const scrollPosition = window.scrollY;
    this._orderService.getOrder(id).subscribe((order: Order) => {
      order.status = status;
      this._orderService.updateOrden(id, order).subscribe(() => {
        console.log('Estatus actualizado');
        const index = this.listOrder.findIndex(o => o.id === id);
        if (index !== -1) {
          this.listOrder[index].status = status;
        }
        window.scrollTo(0, scrollPosition);
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

  openAuthModal(orderId: number | undefined) {
    if (orderId === undefined) {
      console.error('Order ID is undefined');
      return;
    }
    this.selectedOrderId = orderId;
    this.showModal = true;
  }

  closeAuthModal() {
    this.showModal = false;
    this.authCredentials = { username: '', password: '' };
  }

  authenticate() {
    const { username, password } = this.authCredentials;
    if (username === 'admin' && password === 'aljaC0ir') {
      this.showModal = false;
      if (this.selectedOrderId !== undefined) {
        this.router.navigate(['/edit', this.selectedOrderId]);
      }
    } else {
      this.toastr.error('Usuario o contraseña incorrectos');
    }
  }
}
