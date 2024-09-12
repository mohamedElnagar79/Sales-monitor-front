import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard implements CanActivate {
  constructor(private cookieService: CookieService) {}

  canActivate(
    route: ActivatedRouteSnapshot, // Use ActivatedRouteSnapshot
    state: RouterStateSnapshot // Add state parameter
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.cookieService.get('token');
    return !!token; // Return true if token exists, false otherwise
  }
}
