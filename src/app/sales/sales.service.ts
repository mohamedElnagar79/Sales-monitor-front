import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  sellProduct(invoice: {}): Observable<any> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<any>(this.apiUrl + `sell-product`, invoice, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  getLastSales(p: number): Observable<any[]> {
    const token = this.cookieService.get('token');
    let params = new HttpParams().set('page', p);
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `get-last-sales`, {
        headers,
        params,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }

  getproductsList(searchTerm?: string): Observable<any[]> {
    const token = this.cookieService.get('token');
    let params;
    if (searchTerm) {
      params = new HttpParams().set('search', searchTerm);
    }
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `products-list`, {
        headers,
        params,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }

  getClientsList(phone?: string, name?: string): Observable<any[]> {
    const token = this.cookieService.get('token');
    let params;
    if (phone) {
      params = new HttpParams().set('phone', phone);
    }
    if (name) {
      params = new HttpParams().set('name', name);
    }
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `clients-list`, {
        headers,
        params,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }

  getOneInvoiceById(invoiceId: number): Observable<any[]> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `invoice/${invoiceId}`, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  getInvoicePayments(invoiceId: number): Observable<any[]> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `invoice-payments/${invoiceId}`, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  updateInvoice(invoice: any): Observable<any> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<any>(this.apiUrl + `invoice`, invoice, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
