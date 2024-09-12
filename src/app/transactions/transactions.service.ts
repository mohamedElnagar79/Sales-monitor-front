import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private apiUrl = environment.apiUrl;

  calcDailySales(date: string, searchTerm?: string): Observable<any[]> {
    const token = this.cookieService.get('token');
    let params = new HttpParams().set('date', date);
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
