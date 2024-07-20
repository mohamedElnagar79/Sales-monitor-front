import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  calcDailySales(
    p: number,
    date: string,
    searchTerm?: string
  ): Observable<any[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams().set('page', p);
    params = params.set('date', date);
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `calc-daily-sales`, {
        headers,
        params,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
