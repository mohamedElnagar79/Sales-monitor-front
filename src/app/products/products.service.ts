import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:10000/get-all-products';
  constructor(private http: HttpClient) {}
  getAllProducts(p: number): Observable<any[]> {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    const params = new HttpParams().set('page', p);
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl, { headers, params });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
