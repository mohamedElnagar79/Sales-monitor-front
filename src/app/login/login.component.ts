import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { LoaderComponent } from '../loader/loader.component';
import { ToastrService } from '../shared/toastr.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage = '';
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private LoginService: LoginService, // private window: Window
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {}
  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      this.isLoading = true;
      this.LoginService.login(this.email, this.password).subscribe(
        (response: any) => {
          // Handle successful login response
          const token = response.data.token;
          const role = response.data.user.role;
          const name = response.data.user.name;
          const avatar = response.data.user.avatar;
          this.cookieService.set('name', name);
          this.cookieService.set('token', token);
          this.cookieService.set('role', role);
          this.cookieService.set('avatar', avatar);
          if (role == 'admin') {
            this.router.navigate(['/products']);
          } else {
            this.router.navigate(['/sales']);
          }
        },
        (error) => {
          // Handle login error
          this.errorMessage = error.error.message;
          console.log('errrrrr', this.errorMessage);
          this.isLoading = false;
          if (error.status === 0) {
            this.router.navigate(['error']);
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
          }
        }
      );
    } else {
      this.errorMessage = 'enter your email and password';
    }
  }

  ngOnInit(): void {
    if (this.cookieService.get('role') == 'admin') {
      this.router.navigate(['/products']);
    } else if (this.cookieService.get('role') == 'user') {
      this.router.navigate(['/sales']);
    }
  }
}
