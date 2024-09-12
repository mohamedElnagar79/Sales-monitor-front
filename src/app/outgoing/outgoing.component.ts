import { Component, ElementRef, ViewChild } from '@angular/core';
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { OutgoingService } from './outgoing.service';
import { Outgoing } from '../models/outgoing';
import { LoaderComponent } from '../loader/loader.component';
import { ToastrService } from '../shared/toastr.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-outgoing',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    FontAwesomeModule,
    LoaderComponent,
  ],
  templateUrl: './outgoing.component.html',
  styleUrl: './outgoing.component.scss',
})
export class OutgoingComponent {
  @ViewChild('closeModal') closeModalRef!: ElementRef;
  @ViewChild('closeAddModal') closeAddModalRef!: ElementRef;
  @ViewChild('deleteModal') deleteModalRef!: ElementRef;
  outgoing: any = [];
  newOutgoing: Outgoing = {
    expenseName: '',
    description: ' ',
    amount: 0,
    reasone: 'No reasone',
  };
  isLoading: boolean = true;
  startIndex: number = 1;
  p: number = 1;
  count: number = 1;
  search: string = '';
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  deletedId: number = 0;
  updatedOutgoing: Outgoing = {
    id: 0,
    expenseName: '',
    description: ' ',
    amount: 0,
  };
  constructor(
    private outgoingService: OutgoingService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService
  ) {}
  ngOnInit(): void {
    this.getOutgoing(this.p);
  }
  getOutgoing(p: number, searchTerm?: string): void {
    this.outgoingService.getOutgoing(p, searchTerm).subscribe(
      (data: any) => {
        // console.log('data ===>', data.data.sales.rows);
        this.isLoading = false;
        this.outgoing = data.data.rows;
        this.count = data.data.count;
        this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.router.navigate(['error']);
        } else if (error.status === 401) {
          setTimeout(() => {
            this.toastr.error(`Unauthorized access. Please log in again.`),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
          this.router.navigate(['login']);
          this.cookieService.deleteAll();
        } else if (error.status === 500) {
          setTimeout(() => {
            this.toastr.error(
              `Internal server error. Please contact the administrator.`
            ),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
        } else {
          this.toastr.error(
            'An error occurred while fetching outgoing items. Please try again later.'
          );
        }
      }
    );
  }
  openUpdateForm(outgoing: any): void {
    this.updatedOutgoing.expenseName = outgoing?.expenseName;
    this.updatedOutgoing.amount = outgoing?.amount;
    this.updatedOutgoing.description = outgoing?.description;
    this.updatedOutgoing.id = outgoing?.id;
  }
  updateoutgoing(outgoing: Outgoing): void {
    console.log('this.uo   ', this.updatedOutgoing);
    this.outgoingService.updateOutgoing(outgoing).subscribe(
      (data: any) => {
        this.getOutgoing(this.p);
        this.closeModalRef.nativeElement.click();
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.router.navigate(['error']);
        } else if (error.status === 401) {
          setTimeout(() => {
            this.toastr.error(`Unauthorized access. Please log in again.`),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
          this.router.navigate(['login']);
          this.cookieService.deleteAll();
        } else if (error.status === 500) {
          setTimeout(() => {
            this.toastr.error(
              `Internal server error. Please contact the administrator.`
            ),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
        } else {
          this.toastr.error(
            'An error occurred while updating outgoing item. Please try again later.'
          );
        }
      }
    );
  }
  addOutgoing(outgoing: Outgoing): void {
    this.outgoingService.addOutgoing(outgoing).subscribe(
      (data: any) => {
        console.log('data added ===>', data.data);
        this.newOutgoing.expenseName = ' ';
        this.newOutgoing.amount = 0;
        this.newOutgoing.description = ' ';
        this.getOutgoing(1);
        this.closeAddModalRef.nativeElement.click();
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.router.navigate(['error']);
        } else if (error.status === 401) {
          setTimeout(() => {
            this.toastr.error(`Unauthorized access. Please log in again.`),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
          this.router.navigate(['login']);
          this.cookieService.deleteAll();
        } else if (error.status === 500) {
          setTimeout(() => {
            this.toastr.error(
              `Internal server error. Please contact the administrator.`
            ),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
        } else {
          this.toastr.error(
            'An error occurred while adding outgoing item. Please try again later.'
          );
        }
      }
    );
  }
  deleteOutgoing(id: number): void {
    this.outgoingService.deleteOneOutgoing(id).subscribe(
      (data: any) => {
        this.getOutgoing(this.p);
        this.deleteModalRef.nativeElement.click();
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.router.navigate(['error']);
        } else if (error.status === 401) {
          setTimeout(() => {
            this.toastr.error(`Unauthorized access. Please log in again.`),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
          this.router.navigate(['login']);
          this.cookieService.deleteAll();
        } else if (error.status === 500) {
          setTimeout(() => {
            this.toastr.error(
              `Internal server error. Please contact the administrator.`
            ),
              '',
              {
                timeOut: 10000,
                positionClass: 'toast-top-center',
              };
          }, 0);
        } else {
          this.toastr.error(
            'An error occurred while delete  outgoing item. Please try again later.'
          );
        }
      }
    );
  }
  openDeleteModal(id: number): void {
    this.deletedId = id;
  }
}
