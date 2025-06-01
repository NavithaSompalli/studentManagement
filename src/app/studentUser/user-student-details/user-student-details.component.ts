import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-student-details',
  templateUrl: './user-student-details.component.html',
  styleUrl: './user-student-details.component.css',
  standalone:false,
})
export class UserStudentDetailsComponent {

  constructor(
  
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private location: Location,
    private router: Router
  ) {}

  position:boolean = false

  /*  canDeactivate(): any{
    console.log("canExit from student");
  return this.confirmService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      target: event?.target as EventTarget,
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
        localStorage.clear();
         console.log(this.router.url);
        if(this.router.url  === "/home/logout"){
            localStorage.clear();

        this.router.navigate(['']).then(() => window.location.reload());
        console.log("logout");
        }else{
          this.location.back();
        }
      },
      reject: () => {
       return this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Logout cancelled', life: 1000 });
      }
    });
 }*/

}
