import { Component, Input, OnInit, OnChanges, ViewChild,Inject,AfterViewChecked } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-attendance-form',
  
  templateUrl: './attendance-form.component.html',
  styleUrl: './attendance-form.component.css',
  standalone:false
})
export class AttendanceFormComponent implements OnInit,  OnChanges, AfterViewChecked {
    @Input() visible: boolean = false;
    @Input() stuId!: string;
    @Input() deptCode!: string;
    departmentId!: string;
    existingRecord:any[] = [];
    
    

    constructor(private dataService: ChartDataService,
      private service: LoginServiceService,
      private router: Router,
      private message:MessageService
    ){}

  
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
    
    ngOnInit(){
     // console.log(this.dataService.departmentList);

     this.getAttendanceStudentDetails();
    
    }

    user = {
      studentId:'',
      month:'',
      year:'',
      departmentId:'',
      departmentName:'',
      attendanceCount:0,
      createdSource:'Admin',
      createdSourceType:'Admin',
      createdDttm:this.getFormattedDate(),
      modifiedSource:'Admin',
      modifiedSourceType:'Admin',
      modifiedDttm:this.getFormattedDate()
    }
 
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
  
  

    ngOnChanges() {
      let index = this.dataService.departmentList.filter(depart => depart["departmentName"] === this.deptCode);
        
        if (index.length > 0) {
            this.departmentId = index[0]["departmentId"];
        } else {
            console.warn('No matching department found.');
            this.departmentId = null; // Assign default value
        }
      this.user["departmentId"] = this.departmentId;
      this.user["departmentName"] = this.deptCode;
      this.user["studentId"] = this.stuId; 
    }

    attendanceDays = 0;
    attendanceList: object[] = []

    getAttendanceStudentDetails(){ // this function return total records from the jsonserver
      this.service.getAttendanceDetails().subscribe({
        next: (response) => {
          this.attendanceList = response
          console.log("getting Student details",this.attendanceList)
        
          
        },
        error: (error) => console.log(error),
       
      })
    }

    

    
    @ViewChild('ngAttendanceForm') form: NgForm
    OnSubmitAttendance() {
      let stu = this.form.controls["studentId"].value;
      let month = this.form.controls["month"]?.value;
      console.log(month);
      let year = this.form.controls["year"]?.value;
      this.user["month"] = this.months[month-1]?.name;
      this.user["year"] = year;

     // console.log(month, year, this.user["month"],this.user["year"]);
    
      this.getAttendanceStudentDetails(); // Ensure attendanceList is populated
     
       this.existingRecord = this.attendanceList.filter((record: any) =>{
      
        if(record.studentId === this.user.studentId &&
            record.month === this.user.month &&
            record.year === this.user.year){
              return true
            }else{
              return false
            }
          }
      );
  
     
      
    //  console.log("exting Record",this.existingRecord);
    
     

      if(this.existingRecord.length === 0){
    
      // Proceed with adding attendance
      this.service.addAttendanceStudentDetails(this.user).subscribe({
        next: (response) => {
          console.log("Attendance submitted successfully!", response);
          this.message.add({
                 severity: 'success',
                 summary: 'Success',
                 detail: 'Attendance submitted successfully!',
                 life: 3000,
             });
        },
        error: (error) => {
          console.error("Failed to submit attendance", error);
           this.message.add({
                 severity: 'success',
                 summary: 'Rejected',
                 detail: 'Failed to submit attendance',
                 life: 3000,
             });
        },
        complete: () => {
          this.router.navigate(["home/attendance"]).then(() => {
            window.location.reload(); // Forces page refresh
          });
          this.visible=false;
        }
      });
    }else{
      
       this.message.add({
                 severity: 'error',
                 summary: 'Rejected',
                 detail: 'Attendance record for this student and month already exists.',
                 life: 3000,
             });

             this.visible=false;
    }
    }
    


    ngAfterViewChecked(){
      
      let year = this.form.controls["year"]?.value;
      let month = this.form.controls["month"]?.value;
    //  this.user["month"] = this.months[month-1]?.name;
      this.attendanceDays = this.getDaysInMonth(month, year); 
      
    }


    
}
