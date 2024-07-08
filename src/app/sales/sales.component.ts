import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalesService } from './sales.service';
import { Sale } from '../models/sale';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface invoiceItem {
  quantity: number;
  piecePrice: any;
  productId?: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],

  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  @ViewChild('productSelection', { static: true })
  productSelection!: ElementRef;
  faPlus = faPlus;
  p: number = 1;
  count: number = 1;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  invoiceItems: invoiceItem[] = [
    {
      piecePrice: '0.00 EGP',
      quantity: 0,
    },
  ];
  productSearch: string = '';
  sale: Sale = {
    id: 0,
    productId: 0,
    productName: '',
    clientName: 'client',
    piecePrice: '0.00 EGP',
    quantity: 1,
    total: 0,
    amountPaid: 0,
    remainingBalance: 0,
    comments: 'No comment ...',
    createdAt: new Date(),
  };

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadProducts('');
    // this.loadSales();
    if (this.productSelection) {
      // You can perform actions on the productSelection element here
    } else {
      console.error('productSelection reference not available');
    }
  }

  loadProducts(search?: string): void {
    this.salesService.getproductsList(search).subscribe((data: any) => {
      this.products = data.data;
      this.filteredProducts = data.data; // Initialize filteredProducts
    });
  }
  trackByFn(index: number, item: invoiceItem) {
    return item; // Or a unique identifier for each item
  }
  filterProducts(event: any): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    if (this.filteredProducts.length > 0) {
      this.productSelection.nativeElement.classList.add('active'); // Add 'active' class
      console.log('hellooo');
    } else {
      this.productSelection.nativeElement.classList.remove('active'); // Remove 'active' class
    }
  }

  selectProduct(product: Product): void {
    // Update sale object with selected product details
    this.sale.productId = product.id;
    this.sale.productName = product.name;
    // Hide product list
    this.filteredProducts = [];
    this.productSelection.nativeElement.classList.remove('active');
    console.log('clicked', product);
    this.sale.piecePrice = product.price;
    this.sale.quantity = 1;
    this.sale.total = this.sale.piecePrice * this.sale.quantity;
    this.sale.amountPaid = this.sale.total;
    this.sale.remainingBalance = 0;
  }
  calcTotal(product: any): void {
    console.log('calc total ', product);
    this.sale.total = product.piecePrice * product.quantity;
    this.sale.amountPaid = this.sale.total;
  }
  calcRemaider(product: any): void {
    console.log(' calc Remaider ');
    this.sale.remainingBalance = product.total - product.amountPaid;
  }
  addnewItem(newItem: Partial<invoiceItem> = {}) {
    const item: any = { ...newItem };
    this.invoiceItems.push(item);
    console.log('now =====>>>>>> ', this.invoiceItems);
  }
  // onSubmit(): void {
  //   console.log('this =====>>>>>>   ', this.invoiceItems);
  //   this.salesService.sellProduct(this.sale).subscribe(
  //     (data: any) => {
  //       // this.count = data.data.count;
  //       console.log('hi');
  //       this.resetForm();
  //       // this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
  //     },
  //     (error) => {
  //       console.error('Error fetching sales:', error);
  //     }
  //   );
  // }

  resetForm(): void {
    this.productSearch = '';
    this.sale = {
      id: 0,
      productId: 0,
      productName: '',
      clientName: 'client',
      piecePrice: 0,
      quantity: 1,
      total: 0,
      amountPaid: 0,
      remainingBalance: 0,
      comments: 'No comment ...',
      createdAt: new Date(),
    };
  }
}
