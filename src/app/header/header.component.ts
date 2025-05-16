import { Component, Input,Output,EventEmitter, OnChanges, OnInit} from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { HomeComponent } from '../home/home.component';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ViewEncapsulation } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated 
})
export class HeaderComponent implements  OnInit{
  studentActive: boolean = false;

  isLoggingOut: boolean = false;
  imageUrl:string = "";

  constructor(private router: Router,
    private service : LoginServiceService,
    private confirmationService: ConfirmationService, private messageService: MessageService
   
  ){

  }

  isStudentLoggedIn = JSON.parse(localStorage.getItem('student'));
  studentId = localStorage.getItem('studentId');
  studentObj:any;
  firstname: string = "";
  lastname: string = "";
 
  ngOnInit(){
   this.studentActive = !this.isStudentLoggedIn
   // console.log(this.studentActive);

  
   this.service.findStudent(this.studentId).subscribe({
    next: (response) => {
       if(response !==false){
         this.studentObj = response;
         console.log(this.studentObj);
         this.studentObj = this.studentObj.find(obj => obj.size !== 0);
         this.imageUrl = this.studentObj?.image;
         this.firstname = this.studentObj.firstname;
         this.lastname = this.studentObj.lastname;
         console.log(this.imageUrl);
        }
    },
    error: (error) => console.log(error),
    complete: ()=>{
     // console.log("completed")
    }
  })
   
  }


//@Input() selectedComponent:any;
  @Output() notifyParent = new EventEmitter<string>();
  selectedComponent: string = 'home';

 loadComponent(component: string){
  this.notifyParent.emit(component);
  this.selectedComponent = component;
  
 }

 onLogout(){
   /* localStorage.clear();
    this.router.navigate(['']);
    console.log("logout");*/
   this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      
      target: event?.target as EventTarget,
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Logout'
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have logged out', life: 3000 });
        localStorage.clear();
        this.router.navigate(['']).then(() => window.location.reload());
        console.log("logout");
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Logout cancelled', life: 1000 });
      }
    });
 }
}
