import { Component } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  sales: any = [];
  dailyExpense: any = [];
  salesCount: number = 1;
  expenseCount: number = 1;
  p: number = 1;
  startIndex: number = 1;
  searchDate: string = '2024-07-02';
  totalAmountPaid: number = 0;
  totalDailyExpense: number = 0;
  totalExistMoney: number = 0;

  constructor(private transactionsService: TransactionsService) {}
  ngOnInit(): void {
    this.calcDailySales(this.p, this.searchDate);
  }
  calcDailySales(p: number, searchDate: string, searchTerm?: any): void {
    this.transactionsService
      .calcDailySales(p, searchDate, searchTerm)
      .subscribe(
        (data: any) => {
          // console.log('data ===>', data.data.sales.rows);
          this.sales = data.data.sales.rows;
          this.salesCount = data.data.sales.count;
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
