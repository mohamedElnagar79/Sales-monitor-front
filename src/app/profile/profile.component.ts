import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faGear,
  faLock,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from './profile.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from '../shared/toastr.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  @ViewChild('changeAvatar') changeAvatarRef!: ElementRef;
  faUser = faUser;
  faGear = faGear;
  faPen = faPen;
  faLock = faLock;
  imageUrl = '../../../assets/1665905529695.jpg';
  user: any = {
    name: '',
    email: '',
    role: '',
    avatar: '',
  };
  updatedUser: any = {
    name: '',
    email: '',
    avatar: '',
    file_name: '',
  };
  passwordObj: any = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  constructor(
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserInfo(); //init user data
  }
  onImageChange(event?: any) {
    this.changeAvatarRef.nativeElement.click();
    let selectedFile, base64Image: any;
    if (event.target.files) {
      selectedFile = event.target?.files[0];
    }
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        base64Image = e.target.result;
        this.updatedUser.avatar = e.target.result;
        this.updatedUser.file_name = event.target.value.split('\\').pop();
      };
      console.log('Filename:', event.target.value.split('\\').pop());
      reader.readAsDataURL(selectedFile);
    } else {
      console.log('there is no selected file');
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
      this.validateProfileInput();
      console.log('updated user ===> ', this.updatedUser);
      console.log('user ===> ', this.user);
      console.log('updatedObj ===> ', updatedObj);

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
        },
        (error) => {
          console.log('errororroro ', error);
          setTimeout(() => {
            this.toastr.error(error.error.message),
              '',
              {
                timeOut: 5000,
                positionClass: 'toast-top-center',
              };
          }, 0);
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

  getUserInfo(): void {
    this.profileService.getUserInfo().subscribe(
      (data: any) => {
        this.user = { ...data.data };
        this.updatedUser = { ...data.data };
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updatePassword(passwordObj: any): void {
    console.log('hello');
    if (passwordObj.newPassword != passwordObj.confirmPassword) {
      setTimeout(() => {
        this.toastr.error('new Password not equal to confirm password'),
          '',
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          };
      }, 0);
    }
    if (passwordObj.newPassword && passwordObj.oldPassword) {
      this.profileService.UpdatePassword(passwordObj).subscribe(
        (data: any) => {
          console.log('updated ', passwordObj);
        },
        (error) => {
          console.log(error);
        }
      );
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
