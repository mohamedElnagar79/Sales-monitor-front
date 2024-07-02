import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage = '';
  constructor(
    private router: Router,
    private LoginService: LoginService // private window: Window
  ) {}
  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      this.LoginService.login(this.email, this.password).subscribe(
        (response: any) => {
          // Handle successful login response
          const token = response.data.token;
          const role = response.data.user.role;
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
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
        }
      );
    } else {
      console.log('errrrrrrrrrrrrrrr');
    }
  }
}
