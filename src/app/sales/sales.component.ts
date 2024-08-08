import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SalesService } from './sales.service';
import { Sale } from '../models/sale';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';

import {
  faPlus,
  faClose,
  faSave,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from '../shared/toastr.service';
import { ActivatedRoute } from '@angular/router';
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface InvoiceItem {
  quantity: number;
  piecePrice: any;
  productId?: number;
  productName?: string;
  filteredProducts?: any;
  total?: number;
  description?: string;
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
  faChevronLeft = faChevronLeft;
  isUpdate: boolean = false;
  showReview: boolean = false;
  showPayment: boolean = false;
  TotalOfOldPaid: number = 0;
  returnesMoney: number = 0;
  p: number = 1;
  originalRemainder = 0;
  originalPaid = 0;
  count: number = 1;
  invoiceId: number = 0;
  titleMessage: string = 'Add new Order';
  products: Product[] = [];
  invoicePayments: any = [];
  newPayments: any = [];
  updatedinvoiceItems: any = [];
  updatedInvoice: any = {};
  invoice_items_data: any = [];
  updated_invoice_items_data_to_compare: any = [];
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
  returns: number = 0;
  invoiceItems: InvoiceItem[] = [
    {
      piecePrice: '0.00 EGP',
      quantity: 1,
      productId: 0,
      productName: '',
      total: 0,
      filteredProducts: [],
      description: '',
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
    private route: ActivatedRoute,
    private navigateRoute: Router
  ) {}
  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    this.titleMessage = id ? 'Update Invoice' : this.titleMessage;
    if (id) {
      this.getInvoicePayments(id);
      this.getOneInvoiceById(id);
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
    if (
      this.invoice.amountPaid > 0 &&
      this.invoice.amountPaid <= this.invoice.remainder
    ) {
      this.TotalOfOldPaid += this.invoice.amountPaid;
      console.log('total of old paid  paymentwhile add', this.TotalOfOldPaid);
      this.calcRemaider();
      this.invoicePayments.push({
        total: this.invoice.total,
        amountPaid: this.invoice.amountPaid,
        remaining: this.invoice.remainder,
        createdAt: this.getFormattedDate(),
      });
      this.newPayments.push({
        total: this.invoice.total,
        amountPaid: this.invoice.amountPaid,
        remaining: this.invoice.remainder,
        createdAt: this.getFormattedDate(),
      });
      this.invoice.amountPaid = 0;
    } else
      setTimeout(() => {
        this.toastr.warning('enter valid amount!'),
          '',
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          };
      }, 0);
  }

  getOneInvoiceById(invoiceId: number): void {
    this.salesService.getOneInvoiceById(invoiceId).subscribe((data: any) => {
      this.clientObj.phone = data.data.phone;
      this.clientObj.name = data.data.clientName;
      this.clientObj.id = data.data.clientId;
      this.invoiceId = data.data.id;
      console.log('data   ', data.data);
      this.originalRemainder = data.data.remainingBalance;
      this.originalPaid = data.data.amountPaid;
      this.invoice.remainder = data.data.remainingBalance;
      this.invoiceItems = data.data.invoice_items;
      this.invoiceItems = data.data.invoice_items;
      // this.invoice.newInvoiceItems = data.data.invoice_items;
      for (const item of data.data.invoice_items) {
        this.invoice_items_data.push({ ...item });
      }
      // this.invoice.amountPaid = data.data.amountPaid;
      this.invoice.clientId = data.data.clientId;
      this.invoice.invoiceId = data.data.id;
      this.calcTotal();
    });
  }
  getInvoicePayments(invoiceId: any): any {
    this.salesService.getInvoicePayments(invoiceId).subscribe((data: any) => {
      this.invoicePayments = [...data.data.payments];
      this.TotalOfOldPaid = data.data.totalOfOldPaid;
      this.returnesMoney = data.data.returnesMoney;
      this.calcRemaider();
    });
  }
  filterClientsByName(event: any): void {
    console.log('event ', event);
    this.filteredClients = this.clients.filter((client) =>
      client.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    if (this.filteredClients.length > 0) {
      this.clientSelection?.nativeElement?.children?.classList?.add('active');
    } else {
      this.clientSelection?.nativeElement?.children?.classList?.remove(
        'active'
      );
    }
  }
  filterClientsByPhone(event: any): void {
    this.filteredClients = this.clients.filter((client) =>
      client.phone.toLowerCase().includes(event.target.value.toLowerCase())
    );
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
    console.log('windoeww ', window.location);

    this.invoiceItems[index].filteredProducts = this.products.filter(
      (product) => {
        this.invoiceItems[index].description = product.description;
        return product.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase());
      }
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
    this.filteredClients = [];
    this.phoneFlag = false;
    this.invoice.clientId = client.id;
    delete this.invoice.clientName;
    delete this.invoice.phone;
    this.clientName = client.name;
    this.clientObj.name = client.name;
    this.clientObj.phone = client.phone;
  }

  selectProduct(product: Product, i: number): void {
    this.filteredProducts = [];
    const existingItemIndex = this.ProductItems.findIndex(
      (item) => item.productId === product.id
    );
    const existingInvoiceItems = this.invoiceItems.findIndex(
      (item) => item.productId === product.id
    );
    if (
      existingItemIndex >= 0 ||
      (existingInvoiceItems >= 0 && existingInvoiceItems != i)
    ) {
      this.invoiceItems[i].productName = '';
      alert('you have already add his before!');
    } else {
      this.invoiceItems[i].productName = product.name;
      this.invoiceItems[i].productId = product.id;
      this.invoiceItems[i].piecePrice = product.price;
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
        item.total = item.piecePrice * item.quantity;
        this.invoice.total += item.total;
      } else {
        return;
      }
    }
    this.calcRemaider();
  }
  calcRemaider(): void {
    console.log('calc clicked ', this.invoice.amountPaid);
    if (this.invoice.amountPaid > this.invoice.total && !this.isUpdate) {
      //handel max value
      this.invoice.amountPaid = this.invoice.total;
    }
    if (
      // handel if user has return any thing and have paid more than total
      this.isUpdate &&
      this.updatedinvoiceItems.length > 0 &&
      this.invoice.total - this.TotalOfOldPaid <= 0 &&
      this.invoice.remainder == 0
    ) {
      // user have paid more  and will take money
      console.log('h1====');
      this.invoice.remainder = 0;
    }
    if (
      // handel if user has return any thing and have paid more than total
      this.isUpdate &&
      this.updatedinvoiceItems.length == 0
    ) {
      this.invoice.remainder =
        this.originalRemainder != 0
          ? this.invoice.total - this.TotalOfOldPaid
          : this.invoice.remainder;
    }
    if (
      this.isUpdate &&
      this.invoice.remainder > 0 &&
      this.updatedinvoiceItems.length > 0
    ) {
      this.invoice.remainder =
        this.invoice.total - this.TotalOfOldPaid > 0
          ? this.invoice.total - this.TotalOfOldPaid
          : 0;
    }
    if (this.isUpdate && this.updatedInvoice.length == 0) {
      console.log('h3    ===');
      this.invoice.remainder = this.invoice.remainder;
    }
    if (!this.isUpdate) {
      console.log('h4===== ');
      this.invoice.remainder = this.invoice.total - this.invoice.amountPaid;
    } else {
      // this.invoice.remainder = this.invoice.remainder;
      if (!this.isUpdate) {
        this.invoice.remainder = this.invoice.total - this.TotalOfOldPaid;
      }
    }
    // this.invoice.remainder = this.isUpdate
    //     ? this.TotalOfOldPaid - this.invoice.total
    //     : this.invoice.total - +this.invoice.amountPaid; //while creat invoice
    if (this.invoice.remainder < 0 || isNaN(this.invoice.remainder)) {
      // setTimeout(() => {
      //   this.toastr.warning('enter valid amount!'),
      //     '',
      //     {
      //       timeOut: 2000,
      //       positionClass: 'toast-top-center',
      //     };
      // }, 0);
    }
  }
  addnewItem() {
    const lastItem = this.invoiceItems[this.invoiceItems.length - 1];

    // Check if the array has only the default object and remove it
    if (lastItem?.piecePrice === '0.00 EGP' || lastItem?.quantity === 0) {
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
      this.updatedinvoiceItems = this.invoice.newInvoiceItems.filter(
        (item: any) => {
          // Find matching item in invoice_items_data
          const existingItem = this.invoice_items_data.find(
            (invoiceItem: any) => invoiceItem.id === item.id // Use 'invoiceItem' here
          );
          // Check if price or quantity changed (assuming 'piecePrice' is the correct key)
          return (
            existingItem &&
            (item.piecePrice !== existingItem.piecePrice ||
              item.quantity !== existingItem.quantity)
          );
        }
      );
      this.calcTotal();
      this.showPayment = true;
      this.invoice.amountPaid = 0;
      this.updatedInvoice.updatedinvoiceItems = [...this.updatedinvoiceItems];
    }
  }
  showReviewSection(): void {
    this.returns = 0;
    this.showPayment = false;
    this.showReview = true;
    this.calcRemaider();

    // decrease returns
    // this.TotalOfOldPaid =
    //   this.invoice.total - this.invoice.amountPaid == this.returns
    //     ? this.TotalOfOldPaid
    //     : this.TotalOfOldPaid - this.returns;
    console.log(
      'this.totalofamount-returns  --',
      this.TotalOfOldPaid - this.returns
    );
    if (
      this.isUpdate &&
      this.invoice.amountPaid != this.originalPaid &&
      this.invoice.amountPaid != 0
    ) {
      console.log('helooo');
      this.invoice.amountPaid = this.TotalOfOldPaid - this.returns;
    }
    if (this.isUpdate && this.invoice.remainder == 0) {
      this.invoice.amountPaid = this.invoice.total;
    }
    if (this.isUpdate && this.invoice.remainder != 0) {
      this.invoice.amountPaid = this.TotalOfOldPaid;
    }
    // console.log('this.originalPaid  ', this.originalPaid);
    // this.invoice.amountPaid = this.isUpdate
    //   ? this.originalPaid - this.returns
    //   : this.invoice.amountPaid;
    if (
      this.isUpdate &&
      this.updatedinvoiceItems.length > 0 &&
      this.invoice.total - this.TotalOfOldPaid < 0
    ) {
      this.invoice.remainder = 0;
      console.log('this.TotalOfOldPaid ', this.TotalOfOldPaid);
      console.log('this.invoice.total ', this.invoice.total);
      this.returns = this.TotalOfOldPaid - this.invoice.total;

      this.invoice.amountPaid = this.TotalOfOldPaid - this.returns;
      // loop for updated invoice item is more strong
      // this.TotalOfOldPaid -= this.returns;
      setTimeout(() => {
        this.toastr.warning(
          `${this.clientObj.name} will take  ${this.returns} EGP`
        ),
          '',
          {
            timeOut: 9000,
            positionClass: 'toast-top-center',
          };
      }, 0);
    }
    this.updatedInvoice.newPayments = [...this.newPayments];
    this.updatedInvoice.invoice = this.invoice;
    this.updatedInvoice.clientId = this.invoice.clientId;
    this.updatedInvoice.invoiceId = this.invoiceId;
  }
  showUpdateSection(): void {
    this.showReview = false;
    this.showPayment = false;
  }
  showPaymentSection(): void {
    this.invoice.amountPaid = 0;
    this.showReview = false;
    this.showPayment = true;
  }
  backToPayment(): void {
    this.invoice.amountPaid = 0;
    this.showReview = false;
    this.calcRemaider();
  }
  validateAmountPaid(): void {
    if (!this.isUpdate) {
      if (this.invoice.amountPaid > this.invoice.total) {
        this.invoice.amountPaid = this.invoice.total;
      }
    }
  }
  validateQuantity(item: any): void {
    if (this.isUpdate) {
      const currentItem = this.invoice_items_data.find(
        (invoiceItem: any) => invoiceItem.id === item.id // Use 'invoiceItem' here
      );
      item.quantity =
        item.quantity > currentItem.quantity
          ? currentItem.quantity
          : item.quantity;
    }
  }
  printReview(): void {
    const reviewSectionElement = this.reviewSection.nativeElement;
    const clonedReviewSection = reviewSectionElement.cloneNode(true); // Clone with styles

    // Optional: Modify cloned content before printing (e.g., remove unnecessary elements)
    this.SaveInvoice();
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
  SaveInvoice(print?: boolean): void {
    if (this.isUpdate) {
      this.salesService.updateInvoice(this.updatedInvoice).subscribe(
        (data: any) => {
          // this.resetForm();
          setTimeout(() => {
            this.toastr.success('Invoice Updated successfully!'),
              '',
              {
                timeOut: 5000,
                positionClass: 'toast-top-center',
              };
          }, 0); // Display message after 2 seconds
          if (this.returns > 0) {
            setTimeout(() => {
              this.toastr.warning(
                `${this.clientObj.name} will take  ${this.returns} EGP`
              ),
                '',
                {
                  timeOut: 12000,
                  positionClass: 'toast-top-center',
                };
            }, 0);
          }
          this.navigateRoute.navigate(['orders']);
        },
        (error) => {
          alert(`${error.error.message}`);
          console.error('Error updating invoice:', error);
        }
      );
    } else {
      this.salesService.sellProduct(this.invoice).subscribe(
        (data: any) => {
          // this.count = data.data.count;
          this.resetForm();
          this.showReview = false;
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
          console.error('Error creating invoice:', error);
        }
      );
    }
  }
  isAdmin(): boolean {
    const role: any = localStorage.getItem('role');

    return role == 'admin' ? true : false; // Replace 'userRole' with your user role variable
  }
}
