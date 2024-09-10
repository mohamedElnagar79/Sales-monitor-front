import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  faRefresh = faRefresh;
  lastRoute: string = 'products';
  previousUrl: string = '';
  currentUrl: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      console.log('queryyyy ', queryParams);
      const previousRoute = queryParams['previousRoute'];
      // Do something with the previous route information
      console.log('Previous route:', previousRoute);
    });
  }
  navigateBack() {
    this.location.back();
  }
}
