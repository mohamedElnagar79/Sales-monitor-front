import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faGear,
  faLock,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from './profile.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from '../shared/toastr.service';
import { LoaderComponent } from '../loader/loader.component';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule, LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  @ViewChild('changeAvatar') changeAvatarRef!: ElementRef;
  @ViewChild('closeModal') closeModalRef!: ElementRef;
  isLoading: boolean = true;
  faUser = faUser;
  faGear = faGear;
  faPen = faPen;
  faLock = faLock;
  faTrash = faTrash;
  isAdmin: boolean = false;
  imageUrl = '../../../assets/1665905529695.jpg';
  user: any = {
    name: '',
    email: '',
    role: '',
    avatar: '',
  };
  users: any = [];

  errorMessage: string = '';
  confirmErrorMessage: string = '';
  quote: any = {
    name: '',
    email: '',
    avatar: '',
  };
  updatedUser: any = {
    name: '',
    email: '',
    avatar: '',
    file_name: '',
  };
  updatedEmployee: any = {
    userId: 0,
    name: '',
    email: '',
    role: 'user',
  };
  passwordObj: any = {
    originalPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getUserInfo(); //init user data
    this.getAllUsers();
  }
  onImageChange(event?: any) {
    this.changeAvatarRef.nativeElement.click();
    let selectedFile, base64Image: any;
    if (event.target.files) {
      selectedFile = event.target?.files[0];
    }
    if (selectedFile) {
      this.isLoading = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        base64Image = e.target.result;
        this.updatedUser.avatar = e.target.result;
        this.updatedUser.file_name = event.target.value.split('\\').pop();
        this.updatedUser.file_name = this.updatedUser.file_name.replace(
          /\.[^/]+$/,
          ''
        );
      };
      reader.readAsDataURL(selectedFile);
      this.isLoading = false;
    } else {
      console.log('there is no selected file');
    }
  }
  openUpdateForm(userObj: any): void {
    this.updatedEmployee.userId = userObj?.id;
    this.updatedEmployee.name = userObj?.name;
    this.updatedEmployee.email = userObj?.email;
    this.updatedEmployee.role = userObj?.role;
  }
  updateRole(event: any) {
    this.updatedEmployee.role = event.target?.value;
  }

  updateOneEmployee(updatedEmployee: any): void {
    this.isLoading = true;
    this.profileService.UpdateUserProfile(updatedEmployee).subscribe(
      (data: any) => {
        this.getAllUsers();
        this.closeModalRef.nativeElement.click();
        setTimeout(() => {
          this.toastr.success(
            `emplyeee ${updatedEmployee.name} updated succefully`
          ),
            '',
            {
              timeOut: 5000,
              positionClass: 'toast-top-center',
            };
        }, 0);
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
          this.cookieService.deleteAll();
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
            'An error occurred while update employee. Please try again later.'
          );
        }
      }
    );
  }

  calculatePasswordStrength(password: string): void {
    let strength = 0;
    console.log('clicked====>', password);
    // Check for uppercase, lowercase, numbers, and special characters
    if (
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+{}\[\]:;<>,.?\/|-]/.test(password)
    ) {
      strength += 4;
    }

    // Check for length
    console.log('passwwww ', password);
    if (password.length >= 8) {
      strength += 2;
    }

    // Check for common patterns (you can add more checks)
    if (!/^(123456|password|qwerty|asdfg)$/.test(password)) {
      strength += 1;
    }
    if (strength < 7) {
      this.errorMessage =
        'Password is too weak password must contain at least 8 characters, 1 number, 1 lowercase, uppercase character and a symbol';
    } else this.errorMessage = '';
  }
  validateConfirmPassword(password: string): void {
    if (password != '') {
      console.log('func run nowwwww  ');
      if (password != this.passwordObj.newPassword) {
        this.confirmErrorMessage =
          'confirm password does not equal to new password ';
      } else this.confirmErrorMessage = '';
    }
  }

  validateProfileInput() {
    console.log('clicked ');
  }
  updateMyProfile(userObj: any): void {
    const updatedObj = { ...userObj };
    if (
      this.updatedUser.avatar != this.user.avatar ||
      this.updatedUser.name != this.user.name ||
      this.updatedUser.email != this.user.email
    ) {
      if (this.updatedUser.avatar == this.user.avatar) {
        // avatar is not changed
        delete updatedObj.avatar;
      }
      this.isLoading = true;
      this.profileService.UpdateUserProfile(updatedObj).subscribe(
        (data: any) => {
          setTimeout(() => {
            this.toastr.success('profile updated succefully'),
              '',
              {
                timeOut: 5000,
                positionClass: 'toast-top-center',
              };
          }, 0);
          this.user = { ...this.updatedUser };
          this.profileService.updateCurrentUser({ ...this.updatedUser });
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
            this.cookieService.deleteAll();
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
              'An error occurred while update your profile. Please try again later.'
            );
          }
        }
      );
    } else {
      setTimeout(() => {
        this.toastr.warning('you does not change any thing '),
          '',
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          };
      }, 0);
    }
  }

  // function to update the quote in the service

  getUserInfo(): void {
    this.isLoading = true;
    this.profileService.getUserInfo().subscribe(
      (data: any) => {
        this.user = { ...data.data };
        this.updatedUser = { ...data.data };
        this.isAdmin = data.data.role === 'admin' ? true : false;
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
          this.cookieService.deleteAll();
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
            'An error occurred while fetching user data. Please try again later.'
          );
        }
      }
    );
  }
  getAllUsers(): void {
    this.isLoading = true;
    this.profileService.getAllUsers().subscribe(
      (data: any) => {
        this.users = [...data.data];
        console.log('users  ', this.users);
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
          this.cookieService.deleteAll();
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
            'An error occurred while fetching users. Please try again later.'
          );
        }
      }
    );
  }

  updatePassword(passwordObj: any): void {
    if (passwordObj.newPassword && passwordObj.originalPassword) {
      this.isLoading = true;
      this.profileService.UpdatePassword(passwordObj).subscribe(
        (data: any) => {
          setTimeout(() => {
            this.toastr.success('password updated successfully'),
              '',
              {
                timeOut: 5000,
                positionClass: 'toast-top-center',
              };
          }, 0);
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
            this.cookieService.deleteAll();
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
              'An error occurred while updating your password. Please try again later.'
            );
          }
        }
      );
      this.passwordObj = {
        originalPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    } else {
      setTimeout(() => {
        this.toastr.error('complete form please'),
          '',
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          };
      }, 0);
    }
  }
}
