import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/ordenRepartidor.service';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-delivery-orders',
  templateUrl: './delivery-orders.component.html',
  styleUrls: ['./delivery-orders.component.css']
})
export class DeliveryOrdersComponent implements OnInit {
  orders: Order[] = [];
  nameDelivery: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.nameDelivery = this.route.snapshot.paramMap.get('nameDelivery') || '';
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrdersByDelivery(this.nameDelivery).subscribe(
      (data: Order[]) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }
}
