import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, FontAwesomeModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  @ViewChild('closeModal') closeModalRef!: ElementRef;
  @ViewChild('deleteModal') deleteModalRef!: ElementRef;
  search: any = '';
  activeId: number = 0;
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  startIndex: number = 1;
  products: Product[] = [];
  p: number = 1;
  count: number = 1;
  showForm: boolean = false;
  updateForm: string = 'closed';
  nameErr: boolean = false;
  newProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    soldPrice: 0,
    stock: 1,
    min_stock: 1,
    updatedAt: `${new Date()}`,
    createdAt: `${new Date()}`,
    description: ' ',
  };
  updatedProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    soldPrice: 0,
    stock: 1,
    min_stock: 1,
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
  closeUpdateForm(): void {
    this.updateForm = 'closed';
  }
  openUpdateForm(product: any): void {
    console.log('hello');
    this.updatedProduct.id = product?.id;
    this.updatedProduct.name = product?.name;
    this.updatedProduct.price = product?.price;
    this.updatedProduct.soldPrice = product?.soldPrice;
    this.updatedProduct.stock = product?.stock;
    this.updatedProduct.min_stock = product?.min_stock;
    this.updatedProduct.description = product?.description;
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // });
  }

  getproducts(
    pageNumber: number,
    searchTerm?: any,
    min_stock?: boolean,
    max_stock?: boolean,
    out_of_stock?: boolean
  ): void {
    console.log('fun run');
    this.ProductsService.getAllProducts(
      pageNumber,
      searchTerm,
      min_stock,
      max_stock,
      out_of_stock
    ).subscribe(
      (data: any) => {
        this.count = data.data.count;
        this.products = data.data.rows;
        this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  onStockChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    switch (value) {
      case 'all':
        this.getproducts(1);
        break;
      case 'min':
        this.getproducts(1, undefined, true);
        break;
      case 'max':
        this.getproducts(1, undefined, undefined, true);
        break;
      case 'out':
        this.getproducts(1, undefined, undefined, undefined, true);
        break;
      default:
        this.getproducts(1);
    }
  }

  addProduct(): void {
    this.ProductsService.addProduct(this.newProduct).subscribe(
      (product: Product) => {
        this.products.push(product);
        this.getproducts(1);
        this.newProduct = {
          id: 0,
          name: '',
          price: 0,
          soldPrice: 0,
          stock: 0,
          min_stock: 0,
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
  updateOneProduct(updatedProduct: Product): void {
    this.ProductsService.updateproduct(updatedProduct).subscribe(
      (product: Product) => {
        console.log('current page === ', this.p);
        this.getproducts(this.p);
        this.updateForm = 'closed';
        this.closeModalRef.nativeElement.click();
      },
      (error) => {
        console.error('Error adding product:', error.error.error.path);
        // if (error.error.error.path == 'name') {
        // }
        alert(error.error.message);
      }
    );
  }
  ActivateProductToDelete(id: number): void {
    this.activeId = id;
    console.log('active ===> ', this.activeId);
  }
  deleteProduct(): void {
    this.ProductsService.deleteOneProduct(this.activeId).subscribe(
      (product: Product) => {
        this.getproducts(this.p);
        this.deleteModalRef.nativeElement.click();
      },
      (error) => {
        // console.error('Error deleting product:', error.error.error.path);
        // if (error.error.error.path == 'name') {
        // }
        alert(error.error.message);
      }
    );
  }
}
