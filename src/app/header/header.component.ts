import { Component, Input,Output,EventEmitter, OnChanges, OnInit} from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { HomeComponent } from '../home/home.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false
})
export class HeaderComponent implements OnInit{
  studentActive: boolean = false;

  constructor(private router: Router){

  }

  studentData = JSON.parse(localStorage.getItem('student'));
 
 
  ngOnInit(){
   this.studentActive = !this.studentData
   console.log(this.studentActive);
   
  }


//@Input() selectedComponent:any;
  @Output() notifyParent = new EventEmitter<string>();
  selectedComponent: string = 'home';

 loadComponent(component: string){
  this.notifyParent.emit(component);
  this.selectedComponent = component;
  
 }

 onLogout(){
    localStorage.clear();
    this.router.navigate(['']);

 }
}
