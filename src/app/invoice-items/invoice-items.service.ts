import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceItemsService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private apiUrl = environment.apiUrl;

  getInvoiceItems(id: number): Observable<any[]> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `invoice-items/${id}`, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  deleteOneInvoiceItem(id: number): Observable<any> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.delete<any>(this.apiUrl + `invoice-item/${id}`, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
