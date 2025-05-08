import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuthentication();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuthentication();
  }

  private checkAuthentication(): boolean {
    const token = localStorage.getItem("jwtToken");
    const isValidToken = token ? JSON.parse(token) : null;

    if (isValidToken) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
