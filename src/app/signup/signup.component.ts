import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { SignupService } from './signup.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ToastrService } from '../shared/toastr.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, LoaderComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'user';
  errorMessage: string = '';
  isLoading: boolean = false;
  constructor(
    private SignupService: SignupService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  updateRole(event: any) {
    this.role = event.target?.value;
  }
  onSubmit(signupForm: any): void {
    let user: User = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
    if (signupForm.valid) {
      this.isLoading = true;
      this.SignupService.createUser(user).subscribe(
        (response) => {
          setTimeout(() => {
            this.toastr.success('user created successfully'),
              '',
              {
                timeOut: 2000,
                positionClass: 'toast-top-center',
              };
          }, 0);
          this.name = '';
          this.email = '';
          this.password = '';
          this.role = 'user';
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
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
              'An error occurred while creating new user. Please try again later.'
            );
          }
        }
      );
    } else {
      this.errorMessage = 'invalid form';
      console.log('invalid form');
    }
  }
}
