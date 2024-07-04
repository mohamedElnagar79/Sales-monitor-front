import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Outgoing } from '../models/outgoing';
@Injectable({
  providedIn: 'root',
})
export class OutgoingService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:10000/';

  getOutgoing(p: number, searchTerm?: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    let params = new HttpParams().set('page', p);
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<any>(this.apiUrl + `get-expenses`, {
        headers,
        params,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }

  addOutgoing(outgoing: Outgoing) {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.post<any>(this.apiUrl + `new-expense`, outgoing, {
        headers,
      });
    } else {
      throw new Error('Authorization token not found');
    }
  }

  updateOutgoing(outgoing: Outgoing): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<any>(
        this.apiUrl + `update-expenses/${outgoing.id}`,
        outgoing,
        {
          headers,
        }
      );
    } else {
      throw new Error('Authorization token not found');
    }
  }
}
