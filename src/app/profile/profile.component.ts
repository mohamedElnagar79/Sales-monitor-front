import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faGear,
  faLock,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from './profile.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  faUser = faUser;
  faGear = faGear;
  faPen = faPen;
  faLock = faLock;
  imageUrl = '../../../assets/1665905529695.jpg';
  user: any = {
    name: '',
    email: '',
    role: '',
  };
  updatedUser: any = {
    name: '',
    email: '',
  };

  onImageChange(event?: any) {
    console.log('eeeee');
    const file = event?.target?.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
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
}
