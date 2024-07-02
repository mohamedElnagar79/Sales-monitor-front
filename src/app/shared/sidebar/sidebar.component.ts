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
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  isAdmin: boolean = false;
  constructor(
    private router: Router,
    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
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
    // console.log('this.currentRoute ', this.currentRoute);
  }

  navigateTosales(): void {
    this.router.navigate(['/sales']);
    // this.currentRoute = '/sales';
  }
  navigateToCustomers(): void {
    this.router.navigate(['/customers']);
    // this.currentRoute = '/customers';
  }
  navigateToHome(): void {
    this.router.navigate(['/home']);
    // this.currentRoute = '/home';
  }
  navigateToTransactions(): void {
    this.router.navigate(['/transactions']);
    // this.currentRoute = '/transactions';
  }
  ngOnInit(): void {
    const role = localStorage.getItem('role');
    console.log('role ', role);
    this.isAdmin = role === 'admin' ? true : false;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    console.log('this.currentRoute ', this.currentRoute);

    // this.currentRoute = this.isAdmin ? '/sales' : this.currentRoute;
  }
}
