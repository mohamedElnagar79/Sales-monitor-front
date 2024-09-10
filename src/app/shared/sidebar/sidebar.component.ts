import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
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
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { Router, NavigationEnd } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';
import { ToastrService } from '../toastr.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, LoaderComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen: boolean = false; // Flag to track sidebar visibility
  name: any = '';
  avatar: any = '';
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
  isLoading: boolean = true;

  faChartLine = faChartLine;
  isAdmin: boolean = false;
  user: any = {
    name: '',
    email: '',
    role: '',
    avatar: '',
  };
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}
  currentRoute: string = '/products';
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  submitHandler() {
    this.profileService.updateCurrentUser(this.user);
    // this.user = { name: '', email: '', avatar: '' };
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  signout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  getUserInfo(): void {
    this.profileService.getUserInfo().subscribe(
      (data: any) => {
        this.user = { ...data.data };
        this.isAdmin = data.data.role === 'admin' ? true : false;
        this.isLoading = false;
      },
      (error) => {
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
            console.log('errrorororo');
          }, 0);
          this.router.navigate(['login']);
          localStorage.clear();
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
            'An error occurred while fetching products. Please try again later.'
          );
        }
        console.log('status ===> ', error.status);
      }
    );
  }
  ngOnInit(): void {
    this.getUserInfo();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });

    // Subscribe the currentQuote property of quote service to get real time value
    this.profileService.currentUser.subscribe(
      // update the component's property
      (user) => (this.user = user)
    );
  }
}
