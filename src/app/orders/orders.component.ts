import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from './orders.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Sale } from '../models/sale';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  sales: Sale[] = [];
  search: any = '';
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  p: number = 1;
  count: number = 1;
  startIndex: number = 1;

  updatedSalesObj: Sale = {
    id: 0,
    piecePrice: 0,
    quantity: 0,
    total: 1,
    amountPaid: 0,
    remainingBalance: 0,
    clientName: '',
    createdAt: new Date(),
    comments: '',
  };
  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getListOfSales(this.p);
  }

  getListOfSales(p: number, searchTerm?: any): void {
    // Replace with your API endpoint
    this.ordersService.getListOfSales(p, searchTerm).subscribe(
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
