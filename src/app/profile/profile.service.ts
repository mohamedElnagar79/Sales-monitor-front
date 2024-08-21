import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getUserInfo(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `my-profile`, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  UpdatePassword(Password: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<any>(
        this.apiUrl + `update-user-password/`,
        Password,
        {
          headers,
        }
      );
    } else {
      throw new Error('Authorization token not found');
    }
  }
  UpdateUserProfile(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<any>(this.apiUrl + `update-user-profile`, user, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
