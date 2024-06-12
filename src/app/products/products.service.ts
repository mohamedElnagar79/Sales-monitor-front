import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:10000/get-all-products';
  constructor(private http: HttpClient, private window: Window) {}
  getAllProducts(): Observable<any[]> {
    const token = this.window.localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl);
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
