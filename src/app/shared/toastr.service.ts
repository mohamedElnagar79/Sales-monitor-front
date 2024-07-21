import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr'; // Import from ngx-toastr

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  constructor(private toastr: NgxToastrService) {}

  success(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title);
  }
}
