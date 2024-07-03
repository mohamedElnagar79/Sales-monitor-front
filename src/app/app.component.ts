import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CommonModule,
  ],
})
export class AppComponent {
  constructor(private _router: Router) {}
  title = 'sales-monitor-front';
  isLoggedInValue: boolean = false; // Initial value assuming user is not logged in

  ngOnInit(): void {
    this.isLoggedInValue = this.isLoggedIn(); // Check on initialization
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return (
      !!token &&
      !this._router.url.includes('/login') &&
      !this._router.url.includes('/signup')
    ); // Check both token and URL
  }
}
