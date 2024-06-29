import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { SignupService } from './signup.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

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
  constructor(private SignupService: SignupService) {}
  onSubmit(signupForm: any): void {
    let user: User = {
      name: this.name,
      email: this.email,
      password: this.password,
    };
    if (signupForm.valid) {
      console.log('user   here  ', user);
      this.SignupService.createUser(user).subscribe(
        (response) => {
          // Handle successful login response
          console.log('Login successful:', response);
          // this.router.navigate(['/products']);
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
