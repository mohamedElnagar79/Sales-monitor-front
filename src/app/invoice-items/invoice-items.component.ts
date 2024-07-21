import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
@Component({
  selector: 'app-invoice-items',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './invoice-items.component.html',
  styleUrl: './invoice-items.component.scss',
})
export class InvoiceItemsComponent {
  invoiceItems: any = [];
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  faChevronLeft = faChevronLeft;
  constructor(
    private InvoiceItemsService: InvoiceItemsService,
    private route: ActivatedRoute,
    private router: Router
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
}
