import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPen,
  faUsers,
  faCartArrowDown,
  faHome,
  faStore,
  faMoneyCheckDollar,
  faChartLine,
  faCoins,
  faUser,
  faSignOut,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen: boolean = false; // Flag to track sidebar visibility
  name: any = '';
  faPen = faPen;
  faCoins = faCoins;
  faUserPlus = faUserPlus;
  faUser = faUser;
  faSignOut = faSignOut;
  faUsers = faUsers;
  faHome = faHome;
  faCartArrowDown = faCartArrowDown;
  faStore = faStore;
  faMoneyCheckDollar = faMoneyCheckDollar;
  faChartLine = faChartLine;
  isAdmin: boolean = false;
  constructor(private router: Router) {}
  currentRoute: string = '/products';
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  signout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.name = localStorage.getItem('name');
    this.isAdmin = role === 'admin' ? true : false;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    // console.log('this.currentRoute ', this.currentRoute);
  }
}
