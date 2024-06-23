import { Component } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: Product[] = [];
  p: number = 1;
  count: number = 1;
  showForm: boolean = false;
  updateForm: boolean = false;
  nameErr: boolean = false;
  newProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    soldPrice: 0,
    stock: 0,
    updatedAt: `${new Date()}`,
    createdAt: `${new Date()}`,
    description: ' ',
  };
  updatedProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    soldPrice: 0,
    stock: 0,
    updatedAt: `${new Date()}`,
    createdAt: `${new Date()}`,
    description: ' ',
  };

  constructor(private ProductsService: ProductsService) {}

  ngOnInit(): void {
    this.getproducts(this.p);
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  toggleUpdateForm(product: any): void {
    this.updateForm = !this.updateForm;
    this.updatedProduct.name = product.product?.name;
    this.updatedProduct.price = product.product?.price;
    this.updatedProduct.soldPrice = product.product?.soldPrice;
    this.updatedProduct.description = product.product?.description;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  getproducts(pageNumber: number): void {
    this.ProductsService.getAllProducts(pageNumber).subscribe(
      (data: any) => {
        this.count = data.data.count;
        this.products = data.data.rows;
        console.log('data   ===>', this.products);
        // Trigger change detection after data is fetched
        // (assuming you have access to ChangeDetectorRef)
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  addProduct(): void {
    this.ProductsService.addProduct(this.newProduct).subscribe(
      (product: Product) => {
        this.products.push(product);
        console.log('========', this.products);
        this.getproducts(1);
        this.newProduct = {
          id: 0,
          name: '',
          price: 0,
          soldPrice: 0,
          stock: 0,
          updatedAt: `${new Date()}`,
          createdAt: `${new Date()}`,
          description: '',
        };
        this.showForm = false;
      },
      (error) => {
        console.error('Error adding product:', error.error.error.path);
        if (error.error.error.path == 'name') {
        }
        alert(error.error.message);
      }
    );
  }
  updateProduct(): void {
    console.log('hi');
  }

  editProduct(): void {
    console.log('Edit product:');
  }

  deleteProduct(): void {
    console.log('Delete product with ID:');
  }
}
