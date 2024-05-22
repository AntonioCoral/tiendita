import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-orders-by-date',
  templateUrl: './orders-by-date.component.html',
  styleUrls: ['./orders-by-date.component.css']
})
export class OrdersByDateComponent implements OnInit {
  selectedDate: string = '';
  orders: Order[] = [];

  constructor(private _orderService: OrderService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.selectedDate) {
      this._orderService.getOrdersByDate(this.selectedDate).subscribe((data: Order[]) => {
        this.orders = data;
      });
    }
  }
}
