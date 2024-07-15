import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from './orders.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Sale } from '../models/sale';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPen,
  faTrash,
  faPlus,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  @ViewChild('closeModal') closeModalRef!: ElementRef;
  date: any = '15-07-2024';
  invoices: any = [];
  search: any = '';
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  faChevronRight = faChevronRight;
  maxQuantity: number = 1;
  showReturnedCost: boolean = false;
  returnedCost: number = 0;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getInvoices();
  }
  // returnSale(): void {
  //   this.ordersService.returnASale(this.updatedSalesObj).subscribe(
  //     (data: any) => {
  //       console.log('dataaaaaaaaaa ', data.data.returnedCost);
  //       // this.count = data.data.count;
  //       this.returnedCost = data.data.returnedCost;
  //       this.showReturnedCost = true;
  //       this.getListOfSales(this.p);
  //       // this.closeModalRef.nativeElement.click();
  //     },
  //     (error) => {
  //       console.error('Error while return a sale :', error);
  //     }
  //   );
  // }

  // openUpdateForm(saleItem: any): void {
  //   this.updatedSalesObj.SaleId = saleItem.id;
  //   this.updatedSalesObj.quantity = saleItem.quantity;
  //   this.maxQuantity = saleItem.quantity;
  //   this.showReturnedCost = false;
  //   console.log('this.up  ', this.updatedSalesObj);
  // }
  // validateQuantity(event: any) {
  //   const target = event.target;
  //   const value = target.value;
  //   if (value > this.maxQuantity) {
  //     console.log('value  ', value);
  //     target.value = this.maxQuantity;
  //   }
  // }

  getInvoices(date?: any): void {
    // Replace with your API endpoint
    this.ordersService.getInvoices(date).subscribe(
      (data: any) => {
        // this.count = data.data.count;
        this.invoices = data.data;
        console.log('data  ', data);
        // this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching invoices:', error);
      }
    );
  }
}
