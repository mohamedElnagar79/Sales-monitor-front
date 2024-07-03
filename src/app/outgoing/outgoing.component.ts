import { Component } from '@angular/core';
import { faPen, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { OutgoingService } from './outgoing.service';
@Component({
  selector: 'app-outgoing',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, FontAwesomeModule],
  templateUrl: './outgoing.component.html',
  styleUrl: './outgoing.component.scss',
})
export class OutgoingComponent {
  // @ViewChild('closeModal') closeModalRef!: ElementRef;
  // @ViewChild('deleteModal') deleteModalRef!: ElementRef;
  outgoing: any = [];
  newOutgoing: any = {};
  startIndex: number = 1;
  p: number = 1;
  count: number = 1;
  search: string = '';
  faPen = faPen;
  faTrash = faTrash;
  faPlus = faPlus;
  updatedOutgoing: any = {
    id: 0,
    amount: '',
    expenseName: ' ',
    description: ' ',
    reasone: ' ',
    createdAt: `${new Date()}`,
  };
  constructor(private outgoingService: OutgoingService) {}
  ngOnInit(): void {
    this.getOutgoing(this.p);
  }
  getOutgoing(p: number, searchTerm?: string): void {
    console.log('helllo');
    this.outgoingService.getOutgoing(p, searchTerm).subscribe(
      (data: any) => {
        // console.log('data ===>', data.data.sales.rows);
        this.outgoing = data.data.rows;
        this.startIndex = this.p > 1 ? (this.p - 1) * 8 + 1 : 1;
      },
      (error) => {
        console.error('Error fetching outgoing', error);
      }
    );
  }
  updateoutgoing(outgoing: any): void {
    console.log('helllo from update');
  }
  addOutgoing(outgoing: any): void {
    console.log('helllo from update');
  }
}
