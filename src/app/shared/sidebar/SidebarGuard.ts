import { Injectable } from '@angular/core';
import {
  CanLoad,
  GuardResult,
  MaybeAsync,
  Route,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../../login/auth.service';
// Import your authentication service if you have one
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarGuard implements CanLoad {
  canLoad(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    throw new Error('Method not implemented.');
  }
  // Inject the authentication service if you're using it
  constructor(private authService: AuthService) {}

  canActivate(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> {
    // Check for token directly in localStorage (alternative)
    const token = localStorage.getItem('token');
    return of(!!token); // Create an Observable of the boolean value
  }

  // Check for token directly in localStorage (alternative)
  // const token = localStorage.getItem('token');
  // return !!token;
  // Return true if token exists, false otherwise
}
