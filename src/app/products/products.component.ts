import { Component } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  products: Product[] = [];
  constructor(private ProductsService: ProductsService) {}
  ngOnInit(): void {
    this.ProductsService.getAllProducts().subscribe(
      (data: Product[]) => {
        console.log('data   ', data);
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
