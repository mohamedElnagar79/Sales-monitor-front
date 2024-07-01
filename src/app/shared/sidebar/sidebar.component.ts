import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPen,
  faUsers,
  faCartArrowDown,
  faHome,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen: boolean = false; // Flag to track sidebar visibility
  faPen = faPen;
  faUsers = faUsers;
  faHome = faHome;
  faCartArrowDown = faCartArrowDown;
  faStore = faStore;
  constructor(private router: Router) {}
  currentRoute: string = '/products';
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  navigateToProducts(): void {
    this.router.navigate(['/products']);
    this.currentRoute = '/products';
  }
  navigateToOrders(): void {
    this.router.navigate(['/orders']);
    this.currentRoute = '/orders';
  }

  navigateTosales(): void {
    this.router.navigate(['/sales']);
    this.currentRoute = '/sales';
  }
  navigateToCustomers(): void {
    this.router.navigate(['/customers']);
    this.currentRoute = '/customers';
  }
  navigateToHome(): void {
    this.router.navigate(['/home']);
    this.currentRoute = '/home';
  }
  ngOnInit(): void {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     console.log('token   ', token);
    //     this.isOpen = true;
    //     console.log('isOpen   ', this.isOpen);
    //   }
  }
}
