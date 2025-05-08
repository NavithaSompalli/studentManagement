import { Component, EventEmitter, Input, Output,AfterViewChecked, OnInit, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrl: './attendance-details.component.css',
  standalone:false
})
export class AttendanceDetailsComponent implements AfterViewChecked, OnInit{
  studentActive: boolean = false;

  studentData = JSON.parse(localStorage.getItem('student'));

  constructor(private service: LoginServiceService){}

  
 
  isUpdateActive:boolean = true;
  @Input() studentDetailsObject: any ={
    studentId:'ITO202521',
    month:'March',
    year:'2025',
    departmentId:'CSE001',
    departmentName:'Computer Science',
    attendanceCount:31,
    createdSource:'',
    createdSourceType:'',
    createdDttm:'',
    modifiedSource:'',
    modifiedSourceType:'',
    modifiedDttm:''
  }; // Receive selected department


  @Input() isViewDetailsActive: boolean = false; // Receive dialog visibility state
  
  months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 }
];


 

  attendanceDays = 0;
  attendanceList: object[] = []

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

   getFormattedDate() {
    let date = new Date();

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    let amPm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

    return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${amPm}`;
}

studentDetailsObjects:any = {}

ngOnChanges() {
  if (this.studentDetailsObject && Object.keys(this.studentDetailsObject).length > 0) {
    this.studentDetailsObject = this.studentDetailsObject;
  } else {
    console.warn("studentDetailsObject is missing or empty!");
    this.studentDetailsObject = {
      studentId: '',
      month: '',
      year: '',
      departmentId: '',
      departmentName: '',
      attendanceCount: 0,
      createdSource: '',
      createdSourceType: '',
      createdDttm: '',
      modifiedSource: '',
      modifiedSourceType: '',
      modifiedDttm: ''
    };
  }
}

  

  ngOnInit(){
   
    this.isUpdateActive = false;
    if(this.studentData){
      this.studentActive = false;
    }else{
      this.studentActive = true;
    }
  
  }
  

  @ViewChild('ngAttendanceForm') form : NgForm;
  
  ngAfterViewChecked() {
    if (this.form?.controls?.["year"] && this.form.controls["month"]) {
      let year = this.form.controls["year"].value;
      let month = this.form.controls["month"].value;
  
      let monthIndex = this.months.find((obj) => obj.name === month);
      if (monthIndex) {
        this.attendanceDays = this.getDaysInMonth(monthIndex.value, Number(year));
      }
    } else {
      console.warn("Form controls are missing in ngAfterViewChecked!");
    }
  }
  

  OnEditOption(){
       this.isUpdateActive = !this.isUpdateActive;
       this.isViewDetailsActive = false; 
  }

  onSubmitAttendanceDetails(event) {
     event.preventDefault();
    if ( !this.studentDetailsObject) {
    //  console.error('Invalid ID or product data');
      return;
    }
  
    

    

    this.service.updateStudentAttendance(this.studentDetailsObject.studentId, this.studentDetailsObject).subscribe(
      response => {
       // console.log('Student updated successfully', response); // Display the response object
        alert('Updated successfully');
        this.isUpdateActive = false;
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
