import { Component } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { LoaderComponent } from '../loader/loader.component';
import { ToastrService } from '../shared/toastr.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    FontAwesomeModule,
    LoaderComponent,
  ],
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
  isLoading: boolean = true;

  constructor(
    private transactionsService: TransactionsService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService
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
        this.totalAmountPaid = data.data.totalAmountPaid;
        this.totalDailyExpense = data.data.totalDailyExpense;
        this.totalExistMoney = data.data.totalExistMoney;
        this.invoicePayments = data.data.oldPayments;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.router.navigate(['error']);
        } else if (error.status === 401) {
          setTimeout(() => {
            this.toastr.error(`Unauthorized access. Please log in again.`),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
          this.router.navigate(['login']);
          this.cookieService.deleteAll();
        } else if (error.status === 500) {
          setTimeout(() => {
            this.toastr.error(
              `Internal server error. Please contact the administrator.`
            ),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
        } else {
          this.toastr.error(
            'An error occurred while fetching daily sales . Please try again later.'
          );
        }
      }
    );
  }
}
