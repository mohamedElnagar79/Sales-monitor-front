import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  isLoading: boolean = true; // Optional: Input property for external control

  constructor(private spinner: NgxSpinnerService) {}
  ngOnInit() {
    this.spinner.show(); // Start the loader
    // this.spinner.hide(); // Stop the loader
  }
}
