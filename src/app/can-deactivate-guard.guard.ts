import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {
  canDeactivate(component: any): boolean | Observable<boolean> {
    return component.isLoggingOut && confirm('You have unsaved changes. Do you really want to leave?');
  }
}
