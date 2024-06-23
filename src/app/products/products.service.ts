import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:10000/';
  constructor(private http: HttpClient) {}
  getAllProducts(p: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const params = new HttpParams().set('page', p);
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `get-all-products`, {
        headers,
        params,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  addProduct(product: {}): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      console.log('headers', token);
      return this.http.post<any>(this.apiUrl + `new-product`, product, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
