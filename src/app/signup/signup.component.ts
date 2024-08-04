import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { SignupService } from './signup.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { ToastrService } from '../shared/toastr.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  errorMessage: string = '';
  constructor(
    private SignupService: SignupService,
    private toastr: ToastrService
  ) {}
  onSubmit(signupForm: any): void {
    let user: User = {
      name: this.name,
      email: this.email,
      password: this.password,
    };
    if (signupForm.valid) {
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
        },
        (error) => {
          // Handle login error
          this.errorMessage = error.error.message;
          console.log('errrrrr', this.errorMessage);
        }
      );
    } else {
      this.errorMessage = 'invalid form';
      console.log('invalid form');
    }
  }
}
