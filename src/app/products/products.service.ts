import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.apiUrl;
  // private apiUrl = 'http://localhost:10000/';
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  getAllProducts(
    p: number,
    searchTerm?: string,
    min_stock?: boolean,
    max_stock?: boolean,
    out_of_stock?: boolean
  ): Observable<any[]> {
    const token = this.cookieService.get('token');
    let params = new HttpParams().set('page', p);
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    if (min_stock) {
      params = params.set('min_stock', min_stock);
    }
    if (max_stock) {
      params = params.set('max_of_stock', max_stock);
    }
    if (out_of_stock) {
      params = params.set('out_of_stock', out_of_stock);
    }
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
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<any>(this.apiUrl + `new-product`, product, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  updateproduct(product: Product): Observable<any> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<any>(
        this.apiUrl + `update-product/${product.id}`,
        product,
        {
          headers,
        }
      );
    } else {
      throw new Error('Authorization token not found');
    }
  }
  deleteOneProduct(id: number): Observable<any> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.delete<any>(this.apiUrl + `delete-product/${id}`, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
