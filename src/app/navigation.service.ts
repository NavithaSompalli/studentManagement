import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousUrl: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.url;
      }
    });
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }
}
