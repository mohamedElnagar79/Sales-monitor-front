import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from './orders.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPen,
  faTrash,
  faPlus,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  @ViewChild('closeModal') closeModalRef!: ElementRef;
  today: any = new Date();

  searchDate: any = this.today.toISOString().split('T')[0];
  formattedDate: any = '';
  invoices: any = [];
  searchPhone: any;
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  faChevronRight = faChevronRight;
  maxQuantity: number = 1;
  showReturnedCost: boolean = false;
  returnedCost: number = 0;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log('search date 0 ', this.searchDate);
    // this.searchDate = this.datePipe.transform(this.searchDate, 'MM-dd-yyyy');
    // console.log('this ', this.searchDate);
    this.getInvoices(this.getFormattedDate());
  }
  getFormattedDate(): any {
    return (this.formattedDate = this.datePipe.transform(
      this.searchDate,
      'MM-dd-yyyy'
    ));
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

  getInvoices(date?: any, phone?: any): void {
    console.log('start ===> ', date);
    this.ordersService.getInvoices(date, phone).subscribe(
      (data: any) => {
        this.invoices = data.data;
      },
      (error) => {
        console.error('Error fetching invoices:', error);
      }
    );
  }
  navigateTo(id: any): void {
    const path: any = `invoice/${id}`;
    this.router.navigate([path]);
  }
}
