import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;
  // private apiUrl = 'http://localhost:10000/';

  getInvoices(date?: string, phone?: any): Observable<any[]> {
    console.log('date from service', date);
    const token = localStorage.getItem('token');
    let params;
    if (date) {
      params = new HttpParams().set('date', date);
    }
    if (phone) {
      params = new HttpParams().set('phone', phone);
    }
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `invoices`, {
        headers,
        params,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }

  returnASale(updatedObj: any): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<any>(this.apiUrl + `return-product`, updatedObj, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
