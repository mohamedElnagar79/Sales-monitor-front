import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router } from '@angular/router';

import {
  faPen,
  faTrash,
  faPlus,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { InvoiceItemsService } from './invoice-items.service';
import { ToastrService } from '../shared/toastr.service';
import { LoaderComponent } from '../loader/loader.component';
@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, LoaderComponent],
  templateUrl: './invoice-items.component.html',
  styleUrl: './invoice-items.component.scss',
})
export class InvoiceItemsComponent {
  @ViewChild('deleteModal') deleteModalRef!: ElementRef;
  invoiceItems: any = [];
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  faChevronLeft = faChevronLeft;
  activeId: number = 0;
  isLoading: boolean = true;

  constructor(
    private InvoiceItemsService: InvoiceItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.getInvoiceItems(id);
  }
  getInvoiceItems(id: number): void {
    this.InvoiceItemsService.getInvoiceItems(id).subscribe(
      (data: any) => {
        this.invoiceItems = data.data;
        console.log('data  ', data);
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
          localStorage.clear();
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
            'An error occurred while fetching invoice items. Please try again later.'
          );
        }
      }
    );
  }
  backToOrders(): void {
    const path: any = `orders/`;
    this.router.navigate([path]);
  }
  navigateTo(id: any): void {
    const path: any = `sales/${id}`;
    this.router.navigate([path]);
  }
  ActivateInvoiceItemToDelete(id: number): void {
    this.activeId = id;
  }
  deleteInvoiceItem(): void {
    this.isLoading = true;
    this.InvoiceItemsService.deleteOneInvoiceItem(this.activeId).subscribe(
      (data: any) => {
        setTimeout(() => {
          this.toastr.info(`returned money Is ${data.data} EGP`),
            '',
            {
              timeOut: 10000,
              positionClass: 'toast-top-center',
            };
        }, 0);
        this.isLoading = false;
        this.deleteModalRef.nativeElement.click();
        this.router.navigate(['orders']);
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
          localStorage.clear();
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
            'An error occurred while delete invoice item. Please try again later.'
          );
        }
      }
    );
  }
}
