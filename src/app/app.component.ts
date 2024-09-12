import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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
  constructor(private _router: Router, private cookieService: CookieService) {}
  title = 'sales-monitor-front';
  isLoggedInValue: boolean = false; // Initial value assuming user is not logged in

  ngOnInit(): void {
    this.isLoggedInValue = this.isLoggedIn(); // Check on initialization
  }

  isLoggedIn(): boolean {
    const token = this.cookieService.get('token');
    return (
      !!token &&
      !this._router.url.includes('/login') &&
      !this._router.url.includes('/signup') &&
      !this._router.url.includes('/error')
    ); // Check both token and URL
  }
}
