import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DepartmentComponent } from './department/department.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isAuthenticated(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isAuthenticated(route);
  }

  private isAuthenticated(route: ActivatedRouteSnapshot): boolean {
    return checkAuthentication(this.router, route);
  }
}

// authentication & role validation logic
export function checkAuthentication(router: Router, route: ActivatedRouteSnapshot): boolean {
  const token = localStorage.getItem("jwtToken"); // Checking if the user is logged in: true
  const userRole = localStorage.getItem("student"); // Retrieving user role if student is loggedIn : "student":"true" orlese null
  console.log(router.url);
  const isValidToken = token ? JSON.parse(token) : null;

  if (isValidToken) {
    // console.log("Auth Guard - User is authenticated");
    
    const allowedRoutesForStudent = ['student', 'graph', 'attendance'];
    const allowedRoutesForAdmin = ['student', 'graph', 'attendance', 'department'];
    const requestedRoute = route.url.length > 0 ? route.url[0].path : '';
   // console.log(requestedRoute);

    // Admin can access everything
    if (userRole === null && allowedRoutesForAdmin.includes(requestedRoute)) {
    //  console.log("Admin");
      return true;
    }

    // Students can only access limited routes
    if (userRole !== null && allowedRoutesForStudent.includes(requestedRoute)) {
    //  console.log("student");
      return true;
    }

    // If unknown url , redirect to home
    router.navigate(['home/graph']);
    console.log("unknown url")
    return false;
  } else {
    router.navigate(['']);
    localStorage.clear();
    return false;
  }
}
