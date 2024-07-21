import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.apiUrl;
  // private apiUrl = 'http://localhost:10000/login';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any[]> {
    console.log('hi from function');
    // Implement your login logic here, e.g., calling an API
    // For demonstration purposes, let's assume a simple login
    return this.http.post<any>(`${this.apiUrl}login`, { email, password });
  }
}
