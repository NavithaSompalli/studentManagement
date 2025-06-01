import { Component, EventEmitter, Input, Output, AfterViewChecked, OnInit, ViewChild, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-attendance-details',
  templateUrl: './attendance-details.component.html',
  styleUrl: './attendance-details.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class AttendanceDetailsComponent implements AfterViewChecked, OnInit, OnChanges {
  @Input() studentDetailsObject: any; // 
  @Input() isViewDetailsActive: boolean = false; // Receive dialog visibility state
  @ViewChild('ngAttendanceForm') form: NgForm;
  @Output() messageEvent = new EventEmitter();
  studentActive: boolean = false;
  isUpdateActive: boolean = true;
  storedStudentData: any;
  studentData = JSON.parse(localStorage.getItem('student'));
  studentDetailsObjects: any = {};
  attendanceDays = 0;
  attendanceList: object[] = [];
  updateSubscription;
  months = [
    { name: "January", value: 1 }, { name: "February", value: 2 },
    { name: "March", value: 3 }, { name: "April", value: 4 },
    { name: "May", value: 5 }, { name: "June", value: 6 },
    { name: "July", value: 7 }, { name: "August", value: 8 },
    { name: "September", value: 9 }, { name: "October", value: 10 },
    { name: "November", value: 11 }, { name: "December", value: 12 }
  ];
  constructor(private service: LoginServiceService,
    private messageService: MessageService,
    private router: Router
  ) { }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }
  getFormattedDate(): string {
    let date = new Date();
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); //pads the beginning of a string with another string until it reaches the specified length.
    let day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    let amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${amPm}`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['studentDetailsObject']) {
      this.storedStudentData = { ...changes['studentDetailsObject'].currentValue };
      this.storedStudentData['gender'] = this.storedStudentData.selectedCategory?.name;
    }
  }

  ngOnInit() {
    this.isUpdateActive = false;
    this.studentActive = !this.studentData;
  }
ngAfterViewChecked() {  
  // Lifecycle hook called after the view is checked by Angular
  
  if (this.form.controls["year"] && this.form.controls["month"]) {  
    // Checking that the 'year' and 'month' form controls exist before proceeding
    
    let year = this.form.controls["year"].value;  
    // Retrieves the value of 'year' from the form controls
    
    let month = this.form.controls["month"].value;  
    // Retrieves the value of 'month' from the form controls
    
    let monthIndex = this.months.find(obj => obj.name === month);  
    // Searches the 'months' array to find an object whose 'name' matches the selected month
    
    if (monthIndex) {  
      // If a valid month is found, proceed with updating attendance days
      
      this.attendanceDays = this.getDaysInMonth(monthIndex.value, Number(year));  
      // Calls the 'getDaysInMonth()' function to compute the number of days in the specified month and year,
      // and assigns the result to 'attendanceDays'
    }
  }  
}

// this used for to open the edit form and close the deatils form
  OnEditOption() {
    this.isUpdateActive = !this.isUpdateActive;
    this.isViewDetailsActive = false;
  }

  // submiting updated form data
  onSubmitAttendanceDetails(event: Event) {
    event.preventDefault(); // it will prevent the default behaviour of the form

    if (!this.storedStudentData) return; // it will check the storedDataObject is undefined or not

   // let isEmpty = Object.values(this.storedStudentData).includes(''); // it will return list of values of object and checking that array is having any empty string

    if (this.storedStudentData.attendanceCount <= this.attendanceDays) { // it will checking the condition is the attendace count is less the atendaceDayss
      this.updateSubscription = this.service.updateStudentAttendance(this.storedStudentData.id, this.storedStudentData).subscribe(
        response => {
          this.messageEvent.emit();
          this.messageService.add({ severity: 'success', detail: `Updated successfully` });
          this.isUpdateActive = false;
          this.updateSubscription.unsubscribe();
        },
        error => {
          this.messageService.add({ severity: 'warn', detail: `Failed to update student. Please try again` });
        }
      );
    }
  }

  onBackClick() {
    this.isUpdateActive = false;
  }
}
