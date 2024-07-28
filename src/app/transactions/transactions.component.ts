import { Component } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  sales: any = [];
  dailyExpense: any = [];
  formattedDate: any = '';

  salesCount: number = 1;
  expenseCount: number = 1;
  p: number = 1;
  startIndex: number = 1;
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
    this.calcDailySales(this.p, this.getFormattedDate());
  }
  getFormattedDate(): any {
    return (this.formattedDate = this.datePipe.transform(
      this.searchDate,
      'MM-dd-yyyy'
    ));
  }
  calcDailySales(p: number, searchDate: string, searchTerm?: any): void {
    this.transactionsService
      .calcDailySales(p, searchDate, searchTerm)
      .subscribe(
        (data: any) => {
          // console.log('data ===>', data.data.sales.rows);
          this.sales = data.data.invoices.rows;
          console.log("sales ",this.sales)
          this.salesCount = data.data.invoices.count;
          console.log('heooo');
          this.dailyExpense = data.data.dailyExpense.rows;
          this.expenseCount = data.data.dailyExpense.count;
          this.totalAmountPaid = data.data.totalAmountPaid;
          this.totalDailyExpense = data.data.totalDailyExpense;
          this.totalExistMoney = data.data.totalExistMoney;
          this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
        },
        (error) => {
          console.error('Error fetching daily sales total :', error);
        }
      );
  }
}
