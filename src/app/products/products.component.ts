import { Component } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  products: Product[] = [];
  p: number = 2;
  constructor(private ProductsService: ProductsService) {}
  ngOnInit(): void {
    this.ProductsService.getAllProducts(this.p).subscribe(
      (data: any) => {
        console.log('data   ', typeof data);
        this.p = data.data.count / 10;
        this.products = data.data.rows;
        console.log('data   ===>', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  editProduct(): void {
    console.log('Edit product:');
  }

  deleteProduct(): void {
    console.log('Delete product with ID:');
  }
}
