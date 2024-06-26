import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SalesService } from './sales.service';
import { Sale } from '../models/sale';

interface Product {
  id: number;
  name: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],

  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
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
    createdAt: new Date(),
  };

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    // this.loadProducts();
    // this.loadSales();
    this.getLastSales(this.p);
  }

  // loadProducts(): void {
  //   // Replace with your API endpoint
  //   // this.http
  //     .get<Product[]>('http://localhost:10000/products')
  //     .subscribe((data) => {
  //       this.products = data;
  //       this.filteredProducts = data; // Initialize filteredProducts
  //     });
  // }

  getLastSales(p: number): void {
    // Replace with your API endpoint
    this.salesService.getLastSales(p).subscribe(
      (data: any) => {
        // this.count = data.data.count;
        this.sales = data.data.rows;
        console.log('data  ===> ', data);
        console.log('sales  ===> ', this.sales);
        // this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching sales:', error);
      }
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.productSearch.toLowerCase())
    );
  }

  // onSubmit(): void {
  //   const product = this.products.find((p) => p.id === this.sale.product);
  //   if (product) {
  //     // this.sale.productName = product.name;
  //     // this.sale.dateOfSale = new Date();
  //     // Replace with your API endpoint
  //     this.http
  //       .post<Sale>('http://localhost:10000/sales', this.sale)
  //       .subscribe((data) => {
  //         this.sales.push(data);
  //         this.resetForm();
  //       });
  //   }
  // }

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
