import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
  productName?: string;
  filteredProducts?: any;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],

  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  @ViewChild('productSelection', { static: false })
  productSelection!: ElementRef;
  faPlus = faPlus;
  p: number = 1;
  count: number = 1;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  invoiceItems: invoiceItem[] = [
    {
      piecePrice: '0.00 EGP',
      quantity: 1,
      productId: 0,
      productName: '',
      filteredProducts: [],
    },
  ];
  ProductItems: invoiceItem[] = [];
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
  }
  ngAfterViewInit(): void {
    if (this.productSelection) {
      console.log('this.productSelection ', this.productSelection);
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
  filterProducts(event: any, index: number): void {
    console.log('eveent ', event.target.value, index);
    console.log('this   ', this.invoiceItems[index]);
    this.invoiceItems[index].filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    if (this.invoiceItems[index].filteredProducts.length > 0) {
      // Add 'active' class to the corresponding product selection element
      this.productSelection?.nativeElement?.children[index]?.classList?.add(
        'active'
      );
    } else {
      this.productSelection?.nativeElement?.children[index]?.classList?.remove(
        'active'
      );
    }
  }

  selectProduct(product: Product, i: number): void {
    console.log('array ', this.invoiceItems);
    console.log('i', i);

    this.filteredProducts = [];
    this.invoiceItems[i].productName = product.name;
    this.invoiceItems[i].productId = product.id;
    this.invoiceItems[i].piecePrice = product.price;
    console.log('clicked', product, 'index', i);
    this.invoiceItems[i].filteredProducts = [];
    this.calcTotal();
    // this.calcTotal(this.invoiceItems[i]);
  }
  calcTotal(): void {
    this.sale.total = 0;
    let itemTotalPrice: number;
    for (const item of this.invoiceItems) {
      console.log('itemmmmm ', item);
      if (
        item.piecePrice == 0 ||
        item.piecePrice == '0.00 EGP' ||
        item.quantity != 0
      ) {
        console.log('22');
        itemTotalPrice = item.piecePrice * item.quantity;
        this.sale.total += itemTotalPrice;
      }
    }
  }
  calcRemaider(product: any): void {
    console.log(' calc Remaider ');
    this.sale.remainingBalance = product.total - product.amountPaid;
  }
  addnewItem() {
    const lastItem = this.invoiceItems[this.invoiceItems.length - 1];

    // Check if the array has only the default object and remove it
    if (
      // this.invoiceItems.length === 1 &&
      // lastItem.productId == 0 &&
      lastItem.piecePrice === '0.00 EGP' ||
      lastItem.quantity === 0
    ) {
      this.invoiceItems.pop();
    }

    if (lastItem.productId && lastItem.piecePrice && lastItem.quantity) {
      this.ProductItems.push({ ...lastItem });
      this.invoiceItems.push({
        piecePrice: '0.00 EGP',
        quantity: 1,
        productName: '',
      });
    } else if (this.invoiceItems.length > 0) {
      console.error(
        'Please complete the current item before adding a new one.'
      );
    }
    console.log('ProductItems:', this.ProductItems);
    console.log('InvoiceItems:', this.invoiceItems);
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
