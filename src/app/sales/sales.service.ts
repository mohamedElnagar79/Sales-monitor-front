import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = 'http://localhost:10000/';

  constructor(private http: HttpClient) {}

  sellProduct(product: {}): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<any>(this.apiUrl + `sell-product`, product, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  getLastSales(p: number): Observable<any[]> {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
}
