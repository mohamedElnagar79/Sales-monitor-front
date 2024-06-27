import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from './orders.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Sale } from '../models/sale';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  sales: Sale[] = [];
  p: number = 1;
  count: number = 1;
  startIndex: number = 1;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getListOfSales(this.p);
  }

  getListOfSales(p: number): void {
    // Replace with your API endpoint
    this.ordersService.getListOfSales(p).subscribe(
      (data: any) => {
        // this.count = data.data.count;
        this.sales = data.data.rows;
        this.count = data.data.count;
        this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;

        console.log('data  ', data);
        // this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching sales:', error);
      }
    );
  }
}
