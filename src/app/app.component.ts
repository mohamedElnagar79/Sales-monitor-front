import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

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
  isLoggedIn(): boolean {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    console.log('helooo');
    return !!token; // Return true if token exists, false otherwise
  }
  title = 'sales-monitor-front';
}
