import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  createUser(user: User): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<User>(this.apiUrl + 'sign-up', user, { headers });
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
