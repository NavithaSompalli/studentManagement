import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousUrl: string = ''; // Correctly stores previous URL
  private currentUrl: string = ''; // Stores current URL

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("Navigation Event:", event.url);

        // Store previous URL before updating current
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  getPreviousUrl(): string {
    return this.previousUrl; // Returns the last known URL before current navigation
  }
}
