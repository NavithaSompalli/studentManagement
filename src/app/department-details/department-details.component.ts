import { Component,Input, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { filter, pairwise } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.css',
  standalone:false,
  encapsulation: ViewEncapsulation.Emulated 
})
export class DepartmentDetailsComponent implements OnInit {
  @Input() selectedDepartment: any; // Receive selected department
  @Input() visible: boolean = false; // Receive dialog visibility state

  previousUrl: string | null = null;
  constructor(private router: Router,private activatedRouted: ActivatedRoute,private location: Location){}

  userType : string = "";

  ngOnInit(): void {
  const token = localStorage.getItem("jwtToken");
  const isValidToken = token ? JSON.parse(token) : null;
  this.userType =  JSON.parse(localStorage.getItem('student'));
  if(this.userType !== null){
   if(isValidToken !== null && token !== undefined){
    if(this.userType["student"] === 'true'){
     /* this.activatedRouted.url.subscribe(urlSegments => {
      const currentPath = `${urlSegments.map(segment => segment.path).join('/')}`;
      if(currentPath === 'department'){
            this.router.events.pipe(
              filter(event => event instanceof NavigationEnd),
              pairwise() // Gets previous and current navigation events
            ).subscribe(([previous, current]: NavigationEnd[]) => {
                this.previousUrl = previous.url; // Stores the previous route
                console.log(previous['url'], "currentUrl:", current['url']);
                if (this.previousUrl) {
                this.router.navigate([this.previousUrl]); // Navigate back
              }
            });
      }
    });*/

  /*  this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      pairwise() // Gets previous and current navigation events
    ).subscribe(([previous, current]: NavigationEnd[]) => {
      this.previousUrl = previous.url; // Stores the previous route
      console.log(this.previousUrl);
      this.router.navigate(['home', this.previousUrl])
    });*/
     this.location.back();
    }
    }
   }
  }
}
