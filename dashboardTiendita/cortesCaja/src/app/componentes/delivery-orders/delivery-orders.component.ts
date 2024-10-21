import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/ordenRepartidor.service';
import { Order } from 'src/app/interfaces/order';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.css']
})
export class DeliveryOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  nameDelivery: string = '';
  private orderAddedSubscription: Subscription | null = null;
  private orderUpdatedSubscription: Subscription | null = null;
  private orderDeletedSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.nameDelivery = this.route.snapshot.paramMap.get('nameDelivery') ?? '';
    this.loadOrders();
    this.subscribeToOrderUpdates();
  }

  ngOnDestroy(): void {
    if (this.orderAddedSubscription) this.orderAddedSubscription.unsubscribe();
    if (this.orderUpdatedSubscription) this.orderUpdatedSubscription.unsubscribe();
    if (this.orderDeletedSubscription) this.orderDeletedSubscription.unsubscribe();
  }

  loadOrders(): void {
    this.orderService.getOrdersByDelivery(this.nameDelivery).subscribe(
      (data: Order[]) => {
        // Filtrar solo las órdenes liquidadas y asignadas al repartidor
        this.orders = data.filter(order => order.status === 'transito' && order.nameDelivery === this.nameDelivery);
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }

  subscribeToOrderUpdates(): void {
    this.orderAddedSubscription = this.orderService.onOrderAdded().subscribe((newOrder: Order) => {
      if (newOrder.createdAt) {
        const isToday = this.isToday(newOrder.createdAt);
        if (newOrder.nameDelivery === this.nameDelivery && isToday) {
          this.orders.push(newOrder);
        }
      }
    });
  
    this.orderUpdatedSubscription = this.orderService.onOrderUpdated().subscribe((updatedOrder: Order) => {
      if (updatedOrder.createdAt) {
        const isToday = this.isToday(updatedOrder.createdAt);
        const index = this.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1 && isToday) {
          this.orders[index] = updatedOrder;
        }
      }
    });

    this.orderDeletedSubscription = this.orderService.onOrderDeleted().subscribe((orderId: string) => {
      const numericOrderId = Number(orderId);
      this.orders = this.orders.filter(order => order.id !== numericOrderId);
    });
  }

  private isToday(date: string): boolean {
    const today = new Date();
    const orderDate = new Date(date);
    return orderDate.getDate() === today.getDate() &&
           orderDate.getMonth() === today.getMonth() &&
           orderDate.getFullYear() === today.getFullYear();
  }

  openInGoogleMaps(direction: string): void {
    window.open(direction, '_blank');
  }
  
}
