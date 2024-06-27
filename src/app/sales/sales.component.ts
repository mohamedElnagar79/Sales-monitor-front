import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SalesService } from './sales.service';
import { Sale } from '../models/sale';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],

  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  @ViewChild('productSelection', { static: true })
  productSelection!: ElementRef;

  p: number = 1;
  count: number = 1;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  sales: Sale[] = [];
  productSearch: string = '';
  sale: Sale = {
    id: 0,
    productId: 0,
    productName: '',
    clientName: '',
    piecePrice: 0,
    quantity: 0,
    total: 0,
    amountPaid: 0,
    remainingBalance: 0,
    comments: '',
    createdAt: new Date(),
  };

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadProducts('');
    // this.loadSales();
    this.getLastSales(this.p);
    if (this.productSelection) {
      // You can perform actions on the productSelection element here
    } else {
      console.error('productSelection reference not available');
    }
  }

  loadProducts(search?: string): void {
    this.salesService.getproductsList(search).subscribe((data: any) => {
      this.products = data.data;
      console.log('data   ===>', data);
      console.log('products ===>', this.products);
      this.filteredProducts = data.data; // Initialize filteredProducts
    });
  }

  getLastSales(p: number): void {
    // Replace with your API endpoint
    this.salesService.getLastSales(p).subscribe(
      (data: any) => {
        // this.count = data.data.count;
        this.sales = data.data.rows;
        // this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching sales:', error);
      }
    );
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
    this.sale.total = 0;
    this.sale.quantity = 0;
    this.sale.remainingBalance = 0;
  }
  calcTotal(product: any): void {
    console.log('calc total ', product);
    this.sale.total = product.piecePrice * product.quantity;
  }
  calcRemaider(product: any): void {
    console.log(' calc Remaider ');
    this.sale.remainingBalance = product.total - product.amountPaid;
  }

  onSubmit(): void {
    this.salesService.sellProduct(this.sale).subscribe(
      (data: any) => {
        // this.count = data.data.count;
        console.log('hi');
        this.getLastSales(this.p);
        // this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching sales:', error);
      }
    );
  }

  // resetForm(): void {
  //   this.sale = {
  //     id: 0,
  //     product: 0,
  //     productName: '',
  //     clientName: '',
  //     salePrice: 0,
  //     dateOfSale: new Date(),
  //     paymentStatus: 'paid',
  //   };
  //   this.productSearch = '';
  //   this.filteredProducts = this.products;
  // }
}
