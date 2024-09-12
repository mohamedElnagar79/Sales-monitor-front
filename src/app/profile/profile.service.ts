import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}
  getUserInfo(): Observable<any[]> {
    const token = this.cookieService.get('token');
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
    const token = this.cookieService.get('token');
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
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      console.log('user obj ===> ', user);
      return this.http.put<any>(this.apiUrl + `update-user-profile`, user, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  getAllUsers(): Observable<any[]> {
    const token = this.cookieService.get('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `get-all-users`, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }
  // declare and initialize the quote property
  // which will be a BehaviorSubject
  user = new BehaviorSubject({
    name: '',
    avatar: '',
    email: '',
  });
  // expose the BehaviorSubject as an Observable
  currentUser = this.user.asObservable();

  // function to update the value of the BehaviorSubject
  updateCurrentUser(newUser: any) {
    console.log('hhhhh ,', newUser);
    this.user.next(newUser);
  }
}
