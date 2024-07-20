import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SalesService } from './sales.service';
import { Sale } from '../models/sale';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faPlus, faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from '../shared/toastr.service';
import { ActivatedRoute } from '@angular/router';
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
  total?: number;
}
interface Invoice {
  invoiceId?: number;
  clientName?: string;
  phone?: string;
  clientId?: number;
  newInvoiceItems: InvoiceItem[];
  amountPaid: number;
  comments?: string;
  total: number;
  remainder: number;
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
  @ViewChild('reviewSection') reviewSection!: ElementRef;
  sellerName: any = localStorage.getItem('name')
    ? localStorage.getItem('name')
    : 'computer World';
  clientName: string = 'client';
  faPlus = faPlus;
  faClose = faClose;
  faSave = faSave;
  isUpdate: boolean = false;
  showReview: boolean = false;
  showPayment: boolean = false;
  p: number = 1;
  count: number = 1;
  invoiceId: number = 0;
  titleMessage: string = 'Add new Order';
  products: Product[] = [];
  invoicePayments: any = [];
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
    total: 0,
    remainder: 0,
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
      total: 0,
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
  getFormattedDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get numeric month (01-12)
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  }

  constructor(
    private salesService: SalesService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.titleMessage = id ? 'Update Invoice' : this.titleMessage;
    if (id) {
      this.getOneInvoiceById(id);
      this.getInvoiceById(id);
      this.isUpdate = true;
    }
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
    if (newClient.phone.length < 11) {
      alert('phone must be 11 char ');
      return;
    }
    if (newClient.name == '' || newClient.phone == '') {
      alert('name and phone is required ');
      return;
    } else {
      this.invoice.clientName = newClient.name;
      this.invoice.phone = newClient.phone;
      this.clientObj.name = newClient.name;
      this.clientObj.phone = newClient.phone;
      this.clientName = newClient.name;
      delete this.invoice.clientId;
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
  addPayment(): void {
    console.log('hi add new payment');
    this.invoicePayments.push({
      total: this.invoice.total,
      amountPaid: this.invoice.amountPaid,
      remaining: this.invoice.remainder,
      createdAt: this.getFormattedDate(),
    });
    console.log('this.invoicePayments ???? ', this.invoicePayments);
  }
  getOneInvoiceById(invoiceId: number): void {
    this.salesService.getOneInvoiceById(invoiceId).subscribe((data: any) => {
      console.log('get data =====>  ', data); // Initialize filteredProducts
      this.clientObj.phone = data.data.phone;
      this.clientObj.name = data.data.clientName;
      this.clientObj.id = data.data.clientId;
      this.invoiceId = data.data.id;
      this.invoiceItems = data.data.invoice_items;
      this.invoice.newInvoiceItems = data.data.invoice_items;
      // this.invoice.amountPaid = data.data.amountPaid;
      this.invoice.clientId = data.data.clientId;
      this.invoice.invoiceId = data.data.id;
      this.calcTotal();
    });
  }
  getInvoiceById(invoiceId: any): void {
    this.salesService.getInvoicePayments(invoiceId).subscribe((data: any) => {
      console.log('invoiceData =====>  ', data.data); // Initialize filteredProducts
      this.invoicePayments = [...data.data];
    });
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
    delete this.invoice.clientName;
    delete this.invoice.phone;
    this.clientName = client.name;
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
    console.log('iii ', i);
    if (
      existingItemIndex >= 0 ||
      (existingInvoiceItems >= 0 && existingInvoiceItems != i)
    ) {
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
    this.invoice.total = 0;
    for (const item of this.invoiceItems) {
      if (
        // item.piecePrice != 0 ||
        // item.piecePrice != '0.00 EGP' ||
        // item.quantity != 0 ||
        item.productName != ''
      ) {
        console.log('from select  invoiceItems ', this.invoiceItems);

        item.total = item.piecePrice * item.quantity;
        this.invoice.total += item.total;
      } else {
        return;
      }
    }
    this.calcRemaider();
  }
  calcRemaider(): void {
    console.log('this.invoice.remainder ', this.invoice.remainder);
    if (this.invoice.remainder < 0 || isNaN(this.invoice.remainder)) {
      alert('enter valid amount paid');
    }
    console.log(' calc Remaider ');
    this.invoice.remainder = this.invoice.total - +this.invoice.amountPaid;
  }
  addnewItem() {
    const lastItem = this.invoiceItems[this.invoiceItems.length - 1];

    // Check if the array has only the default object and remove it
    if (lastItem?.piecePrice === '0.00 EGP' || lastItem?.quantity === 0) {
      console.log('lastItem ', this.invoiceItems[0]);
      if (this.invoiceItems[0].productName !== '') {
        this.invoiceItems?.pop();
      }
    }
    -[];

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

  onSubmit(sellForm: any): void {
    if (sellForm.valid && this.invoiceItems[0].productId != 0) {
      const lastItem = this.invoiceItems[this.invoiceItems.length - 1];
      if (
        lastItem?.piecePrice === '0.00 EGP' ||
        lastItem?.quantity === 0 ||
        lastItem.productId === 0
      ) {
        if (this.invoiceItems[0].productName !== '') {
          this.invoiceItems?.pop();
        }
      }
      this.invoice.newInvoiceItems = [...this.invoiceItems];
      console.log('this.invoice', this.invoice);
      this.showPayment = true;
    }
  }
  showReviewSection(): void {
    console.log('heloo');
    this.showPayment = false;
    this.showReview = true;
  }
  printReview(): void {
    const reviewSectionElement = this.reviewSection.nativeElement;
    const clonedReviewSection = reviewSectionElement.cloneNode(true); // Clone with styles

    // Optional: Modify cloned content before printing (e.g., remove unnecessary elements)
    this.SaveNewInvoice();
    const printWindow = window.open('', '_blank'); // Open in new tab/window
    printWindow?.document.write(clonedReviewSection.outerHTML); // Write HTML to new window
    printWindow?.document.close(); // Close the document for printing
    setTimeout(() => printWindow?.print(), 100); // Print after slight delay
  }

  resetForm(): void {
    this.productSearch = '';
    this.filteredProducts = [];
    this.filteredClients = [];
    this.invoiceItems = [
      {
        piecePrice: '0.00 EGP',
        quantity: 1,
        productId: 0,
        productName: '',
        total: 0,
        filteredProducts: [],
      },
    ];
    this.ProductItems = [];
    this.newClient = {
      name: '',
      phone: '',
    };
    this.clientObj = {
      name: '',
      phone: '',
    };
    this.invoice = {
      clientId: 0,
      amountPaid: 0,
      total: 0,
      remainder: 0,
      newInvoiceItems: [
        {
          piecePrice: 0,
          quantity: 0,
        },
      ],
    };
    this.newClient = {
      name: '',
      phone: '',
    };
    this.clientName = 'client';
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
  SaveNewInvoice(print?: boolean): void {
    this.salesService.sellProduct(this.invoice).subscribe(
      (data: any) => {
        // this.count = data.data.count;
        console.log('data ', data);
        this.resetForm();
        this.showReview = false;
        console.log('print ', print);
        setTimeout(() => {
          this.toastr.success('Invoice created successfully!'),
            '',
            {
              timeOut: 5000,
              positionClass: 'toast-top-center',
            };
        }, 0); // Display message after 2 seconds
        if (print) {
          console.log('print func work =========');
          // this.printReview();
        }
        // this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        alert(`${error.error.message}`);
        console.error('Error fetching sales:', error);
      }
    );
  }
  isAdmin(): boolean {
    const role: any = localStorage.getItem('role');

    return role == 'user' ? true : false; // Replace 'userRole' with your user role variable
  }
}
