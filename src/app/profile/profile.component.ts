import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faGear, faLock } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  faUser = faUser;
  faGear = faGear;
  faLock = faLock;
}
