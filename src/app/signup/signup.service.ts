import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    console.log('useeer ', user);
    return this.http.post<User>(this.apiUrl, user);
  }
}
