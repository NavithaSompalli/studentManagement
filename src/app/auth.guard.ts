import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isAuthenticated();
  }

  // Standalone authentication function
  private isAuthenticated(): boolean {
    return checkAuthentication(this.router);
  }

  
}

// authentication logic
export function checkAuthentication(router: Router): boolean {
  const token = localStorage.getItem("jwtToken");
  const isValidToken = token ? JSON.parse(token) : null;

  if (isValidToken) {
    console.log("Auth Guard");
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
}
