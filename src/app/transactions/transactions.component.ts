import { Component } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, FontAwesomeModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  faPhone = faPhone;
  sales: any = [];
  dailyExpense: any = [];
  invoicePayments: any = [];
  formattedDate: any = '';
  today: any = new Date();
  searchDate: any = this.today.toISOString().split('T')[0];
  totalAmountPaid: number = 0;
  totalDailyExpense: number = 0;
  totalExistMoney: number = 0;
  search: string = ' ';

  constructor(
    private transactionsService: TransactionsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.calcDailySales(this.getFormattedDate());
  }
  getFormattedDate(): any {
    return (this.formattedDate = this.datePipe.transform(
      this.searchDate,
      'MM-dd-yyyy'
    ));
  }
  calcDailySales(searchDate: string, searchTerm?: any): void {
    this.transactionsService.calcDailySales(searchDate, searchTerm).subscribe(
      (data: any) => {
        this.sales = data.data.invoices;
        this.dailyExpense = data.data.dailyExpense;
        console.log('sales ', this.sales);
        this.totalAmountPaid = data.data.totalAmountPaid;
        this.totalDailyExpense = data.data.totalDailyExpense;
        this.totalExistMoney = data.data.totalExistMoney;
        this.invoicePayments = data.data.oldPayments;
        console.log('done    done  done', data.data.oldPayments);
      },
      (error) => {
        console.error('Error fetching daily sales total :', error);
      }
    );
  }
}
