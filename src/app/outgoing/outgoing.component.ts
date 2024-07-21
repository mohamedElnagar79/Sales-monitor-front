import { Component, ElementRef, ViewChild } from '@angular/core';
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { OutgoingService } from './outgoing.service';
import { Outgoing } from '../models/outgoing';
@Component({
  selector: 'app-outgoing',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, FontAwesomeModule],
  templateUrl: './outgoing.component.html',
  styleUrl: './outgoing.component.scss',
})
export class OutgoingComponent {
  @ViewChild('closeModal') closeModalRef!: ElementRef;
  @ViewChild('deleteModal') deleteModalRef!: ElementRef;
  outgoing: any = [];
  newOutgoing: Outgoing = {
    expenseName: '',
    description: ' ',
    amount: 0,
    reasone: 'No reasone',
  };
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
  constructor(private outgoingService: OutgoingService) {}
  ngOnInit(): void {
    this.getOutgoing(this.p);
  }
  getOutgoing(p: number, searchTerm?: string): void {
    this.outgoingService.getOutgoing(p, searchTerm).subscribe(
      (data: any) => {
        // console.log('data ===>', data.data.sales.rows);
        this.outgoing = data.data.rows;
        this.count = data.data.count;
        this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching outgoing', error);
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
        console.error('Error adding product:', error.error.error.path);
        // if (error.error.error.path == 'name') {
        // }
        alert(error.error.message);
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
      },
      (error) => {
        console.error('Error while adding outgoing', error);
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
        alert(error.error.message);
      }
    );
  }
  openDeleteModal(id: number): void {
    this.deletedId = id;
  }
}
