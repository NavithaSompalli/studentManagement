import { Component, EventEmitter, Input, Output,AfterViewChecked, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';


@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css',
  standalone:false
})
export class StudentDetailsComponent implements AfterViewChecked, OnInit{

  constructor(private service: LoginServiceService){}

  
 
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
       // console.log('Student updated successfully', response); // Display the response object
        alert('Updated successfully');
      },
      error => {
       // console.error('Error updating student', error);
        alert('Failed to update student. Please try again.');
      }
    );
  }

  onBackClick(){
    this.isUpdateActive = false;
  }
  
}
