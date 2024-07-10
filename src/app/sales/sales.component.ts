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

interface InvoiceItem {
  quantity: number;
  piecePrice: any;
  productId?: number;
  productName?: string;
  filteredProducts?: any;
}
interface Invoice {
  clientName?: string;
  phone?: string;
  clientId?: number;
  newInvoiceItems: InvoiceItem[];
  amountPaid: number;
  comments?: string;
}
interface Client {
  name: '';
  phone: '';
  id?: 0;
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
  @ViewChild('clientSelection', { static: false })
  clientSelection!: ElementRef;
  @ViewChild('clientPhoneSelection', { static: false })
  clientPhoneSelection!: ElementRef;
  @ViewChild('closeModal') closeModalRef!: ElementRef;

  faPlus = faPlus;
  p: number = 1;
  count: number = 1;
  products: Product[] = [];
  clients: Client[] = [
    {
      name: '',
      phone: '',
    },
  ];
  clientObj: Client = {
    name: '',
    phone: '',
  };
  newClient: Client = {
    name: '',
    phone: '',
  };
  invoice: Invoice = {
    clientId: 0,
    amountPaid: 0,
    newInvoiceItems: [
      {
        piecePrice: 0,
        quantity: 0,
      },
    ],
  };
  filteredProducts: Product[] = [];
  filteredClients: Client[] = [];
  phoneFlag: boolean = false;
  nameFlag: boolean = false;
  invoiceItems: InvoiceItem[] = [
    {
      piecePrice: '0.00 EGP',
      quantity: 1,
      productId: 0,
      productName: '',
      filteredProducts: [],
    },
  ];
  ProductItems: InvoiceItem[] = [];
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
    this.loadClients('');
  }
  ngAfterViewInit(): void {
    if (this.productSelection) {
      console.log('this.productSelection ', this.productSelection);
      // You can perform actions on the productSelection element here
    } else {
      console.error('productSelection reference not available');
    }
  }

  addNewClient(newClient: Client) {
    if (newClient.name == '' || newClient.phone == '') {
      alert('name and phone is required ');
    } else {
      this.invoice.clientName = newClient.name;
      this.invoice.phone = newClient.phone;
      this.clientObj.name = newClient.name;
      this.clientObj.phone = newClient.phone;
      this.closeModalRef.nativeElement.click();
    }
  }
  loadClients(name?: string, phone?: string): void {
    this.salesService.getClientsList(name, phone).subscribe((data: any) => {
      this.clients = data.data;
      // this.filteredClients = data.data;
    });
  }
  loadProducts(search?: string): void {
    this.salesService.getproductsList(search).subscribe((data: any) => {
      this.products = data.data;
      this.filteredProducts = data.data; // Initialize filteredProducts
    });
  }
  trackByFn(index: number, item: InvoiceItem) {
    return item; // Or a unique identifier for each item
  }

  filterClientsByName(event: any): void {
    console.log('event', event.target.value.toLowerCase());
    console.log('clients   ', this.clients);
    this.filteredClients = this.clients.filter((client) =>
      client.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    console.log('filteredClients  ', this.filteredClients);
    if (this.filteredClients.length > 0) {
      this.clientSelection?.nativeElement?.children?.classList?.add('active');
    } else {
      this.clientSelection?.nativeElement?.children?.classList?.remove(
        'active'
      );
    }
  }
  filterClientsByPhone(event: any): void {
    console.log('event', event.target.value.toLowerCase());
    console.log('clients   ', this.clients);
    this.filteredClients = this.clients.filter((client) =>
      client.phone.toLowerCase().includes(event.target.value.toLowerCase())
    );
    console.log('filteredClients  ', this.filteredClients);
    if (this.filteredClients.length > 0) {
      this.phoneFlag = true;
      this.clientPhoneSelection?.nativeElement?.children?.classList?.add(
        'active'
      );
    } else {
      this.phoneFlag = false;
      this.clientPhoneSelection?.nativeElement?.children?.classList?.remove(
        'active'
      );
    }
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
  selectClient(client: Client): void {
    console.log('client  ', client);
    this.filteredClients = [];
    this.phoneFlag = false;
    this.invoice.clientId = client.id;
    console.log('invoice   ', this.invoice);
    this.clientObj.name = client.name;
    this.clientObj.phone = client.phone;
    console.log('clientObj  ', this.clientObj);
  }

  selectProduct(product: Product, i: number): void {
    this.filteredProducts = [];
    const existingItemIndex = this.ProductItems.findIndex(
      (item) => item.productId === product.id
    );
    const existingInvoiceItems = this.invoiceItems.findIndex(
      (item) => item.productId === product.id
    );
    console.log('from select  ProductItems  ', this.ProductItems);
    console.log('from select  invoiceItems ', this.invoiceItems);
    console.log('from select  existingItemIndex ', existingItemIndex);
    console.log('from select  existingInvoiceItems ', existingInvoiceItems);
    if (existingItemIndex >= 0 || existingInvoiceItems >= 0) {
      this.invoiceItems[i].productName = '';
      alert('you have already add his before!');
    } else {
      console.log('hoooooooooooooooooooooo');
      this.invoiceItems[i].productName = product.name;
      this.invoiceItems[i].productId = product.id;
      this.invoiceItems[i].piecePrice = product.price;
      console.log('clicked', product, 'index', i);
      this.invoiceItems[i].filteredProducts = [];
      this.calcTotal();
    }
  }
  calcTotal(): void {
    this.sale.total = 0;
    let itemTotalPrice: number;
    for (const item of this.invoiceItems) {
      // console.log('itemmmmm ', item);
      if (
        item.piecePrice == 0 ||
        item.piecePrice == '0.00 EGP' ||
        item.quantity != 0
      ) {
        // console.log('22');
        console.log('from select  invoiceItems ', this.invoiceItems);

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
      lastItem?.piecePrice === '0.00 EGP' ||
      lastItem?.quantity === 0 ||
      ((lastItem?.piecePrice === '0.00 EGP' || lastItem?.quantity === 0) &&
        this.invoiceItems.length != 1)
    ) {
      this.invoiceItems?.pop();
    }

    if (lastItem?.productId && lastItem?.piecePrice && lastItem?.quantity) {
      const existingItemIndex = this.ProductItems.findIndex(
        (item) => item.productId === lastItem.productId
      );
      if (existingItemIndex === -1) {
        // Item doesn't exist, push a copy of lastItem
        this.ProductItems.push({ ...lastItem });
      } else {
        // this.invoiceItems?.pop();
      }
      this.invoiceItems.push({
        piecePrice: '0.00 EGP',
        quantity: 1,
        productName: '',
      });
    } else if (this.invoiceItems.length > 0) {
      // alert('Please complete the current item before adding a new one.');
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
