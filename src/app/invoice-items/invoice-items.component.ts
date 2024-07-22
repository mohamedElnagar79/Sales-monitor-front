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
@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
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

  constructor(
    private InvoiceItemsService: InvoiceItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.getInvoiceItems(id);
  }
  getInvoiceItems(id: number): void {
    this.InvoiceItemsService.getInvoiceItems(id).subscribe(
      (data: any) => {
        this.invoiceItems = data.data;
        console.log('data  ', data);
      },
      (error) => {
        console.error('Error fetching invoices:', error);
      }
    );
  }
  navigateTo(id: any): void {
    const path: any = `sales/${id}`;
    this.router.navigate([path]);
  }
  ActivateInvoiceItemToDelete(id: number): void {
    this.activeId = id;
    console.log('active ===> ', this.activeId);
  }
  deleteInvoiceItem(): void {
    console.log('this.activeId ', this.activeId);
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
        this.deleteModalRef.nativeElement.click();
        this.router.navigate(['orders']);
      },
      (error) => {
        alert(error.error.message);
      }
    );
  }
}
