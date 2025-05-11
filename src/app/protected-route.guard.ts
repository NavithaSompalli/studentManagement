import { CanActivateFn } from '@angular/router';

export const protectedRouteGuard: CanActivateFn = (route, state) => {
  return true;
};
