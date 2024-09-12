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
export class AdminGuard implements CanActivate {
  constructor(private cookieService: CookieService) {}
  canActivate(
    route: ActivatedRouteSnapshot, // Use ActivatedRouteSnapshot
    state: RouterStateSnapshot // Add state parameter
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const role = this.cookieService.get('role');
    return role === 'admin'; // Return true if token exists, false otherwise
  }
}
