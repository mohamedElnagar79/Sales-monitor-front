import { ElementRef, Injectable, ViewChild } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  @ViewChild('deleteModal') deleteModalRef!: ElementRef;
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:10000/';

  getListOfSales(p: number, searchTerm?: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams().set('page', p);
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
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
