import { Component, EventEmitter, Input, Output,AfterViewChecked, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css',
  standalone:false
})
export class StudentDetailsComponent implements AfterViewChecked, OnInit{

  studentActive: boolean = false;

  studentData = JSON.parse(localStorage.getItem('student'));

  constructor(private service: LoginServiceService,private messageService: MessageService){}
  
  isUpdateActive:boolean = true;
  @Input() studentDetailsObject: any; // Receive selected department
  @Input() isViewDetailsActive: boolean = false; // Receive dialog visibility state
  @Input() product: { 
    id: string; 
    firstname: string; 
    lastname: string; 
    dob: string;
    email: string;
    phoneNumber: string;
    selectedCity: string;
    selectedCategory: string;
    image: string;
    modifiedResource: string;
    modifiedSourceType: string;
    modifiedDttm: string;
    createdDttm: string,
    createdSourceType:string,
    createdSource:string,
    dateOfJoining:string;
    department: string,
    departmentId:string,
    bloodGroup:string,
    address:string
  } = {
    id: '',
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    phoneNumber: '',
    selectedCity: '',
    selectedCategory: '',
    image: '',
    modifiedResource: '',
    modifiedSourceType: '',
    modifiedDttm: '',
    createdDttm: '',
    createdSourceType:'',
    createdSource:'',
    dateOfJoining:'',
    department:'',
    departmentId:'',
    bloodGroup:'',
    address:''
  };
  
  

  ngOnInit(){
    this.studentDetailsObject = this.product;
    this.isUpdateActive = false;
    if(this.studentData){
      this.studentActive = false;
    }else{
      this.studentActive = true;
    }
  }
  ngAfterViewChecked(){
      this.product = this.product;
      //console.log("student", this.product)
     // console.log(this.product);
      //console.log(this.studentDetailsObject);
  }

  OnEditOption(){
       this.isUpdateActive = !this.isUpdateActive;
       this.isViewDetailsActive = false; 
       
  }

  OnUpdateOption(id: string) {
    if (!id || !this.studentDetailsObject) {
    //  console.error('Invalid ID or product data');
      return;
    }
  
    this.isUpdateActive = !this.isUpdateActive;

  
    this.service.updateStudent(id, this.studentDetailsObject).subscribe(
      response => {
      
        this.messageService.add({ severity: 'success', detail: 'Updated successfully', life: 3000 });
      },
      error => {
      
       
        this.messageService.add({ severity: 'warn', detail: 'Failed to update student. Please try again.', life: 3000 });
      }
    );
  }

  onBackClick(){
    this.isUpdateActive = false;
  }
  
}
