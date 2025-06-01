import { Component, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {
  selectedComponent: string = 'home'
  constructor(private router: Router, private confirmService: ConfirmationService,
    private messageService: MessageService, private location: Location) { }
  ngOnInit(): void {
    console.log(this.router.url);
    if (this.router.url) {
      this.router.navigate(['home', 'graph']);
    }
  }
  receiveData(event) {
    this.selectedComponent = event;
  //  console.log(this.selectedComponent);
  }
  canDeactivate(): Promise<boolean> {
    //  console.log("Existd")
    // const result$ = new Subject<boolean>();
    return new Promise((resolve) => {
      this.confirmService.confirm({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        rejectButtonProps: {
          label: 'No',
          severity: 'secondary',
          outlined: true
        },
        acceptButtonProps: {
          label: 'Yes'
        },
        accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have logged out', life: 1000 });
          if (localStorage.getItem('isUserLoggedout') === 'true') {
            // console.log(this.router.url);
            // console.log("isUserr",localStorage.getItem('isUserLoggedout'));
            localStorage.clear();
            this.router.navigate(['']);
            //  console.log('logout');
          }
          resolve(true); // Allow navigation
        },
        reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Logout cancelled', life: 1000 });
          //  result$.next(false)
          localStorage.setItem('isUserLoggedout', 'false');
          resolve(false); // Prevent navigation
        }
      });
    });
  }
}
