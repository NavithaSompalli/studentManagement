import { Component, Input, AfterViewChecked, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated 
})
export class StudentDetailsComponent implements AfterViewChecked, OnInit, OnChanges {
  studentActive: boolean = false;
  studentData = JSON.parse(localStorage.getItem('student'));

  constructor(private service: LoginServiceService, 
    private messageService: MessageService,
    private Router: Router
  ) {}

  isUpdateActive: boolean = true;

  @Input() studentDetailsObject: any; // Data received from parent
  @Input() isViewDetailsActive: boolean = false; // Dialog visibility state

  storedStudentData: any = {
    id:'ITO2025'+`${Math.floor(Math.random() * 90)+10}`,
    firstname:'',
    lastname:'',
    dob:'',
    email:'',
    phoneNumber:'',
    selectedCity:{ code: "+91", country: "India" },
    selectedCategory:{name:'Female', key:'F'},
    image:'',
    modifiedResource:'Admin',
    modifiedSourceType:'Admin',
    modifiedDttm:'',
    createdDttm:'',
    createdSourceType:'Admin',
    createdSource:'Admin',
    dateOfJoining:''

  }; // Separate object for rendering

  ngOnInit() {
    this.isUpdateActive = false;
    if (this.studentData) {
      this.studentActive = false;
    } else {
      this.studentActive = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['studentDetailsObject']) {
      this.storedStudentData = { ...changes['studentDetailsObject'].currentValue };
      this.storedStudentData['gender'] = this.storedStudentData?.selectedCategory?.name
    }

  //  console.log(this.storedStudentData);
  }

  ngAfterViewChecked() {
    // Ensure UI renders storedStudentData instead of modifying Input directly
    this.storedStudentData = { ...this.storedStudentData };
  }

  OnEditOption() {
    this.isUpdateActive = !this.isUpdateActive;
    this.isViewDetailsActive = false;
  }


  @ViewChild('dialogForm') detailsForm : NgForm;
  OnUpdateOption(id: string) {
    if (!id || !this.storedStudentData) {
      return;
    }

  //  console.log(this.detailsForm);

    this.isUpdateActive = !this.isUpdateActive;

    this.service.updateStudent(id, this.storedStudentData).subscribe(
      response => {
        this.messageService.add({ severity: 'success', detail: 'Updated successfully', life: 3000 });
       /* this.Router.navigate['/home/student'];*/
        this.Router.navigate(['home/student']).then(() => window.location.reload());
        this.detailsForm.resetForm();
      },
      error => {
        this.messageService.add({ severity: 'warn', detail: 'Failed to update student. Please try again.', life: 3000 });
      }
    );
  }

  onBackClick() {
    this.isUpdateActive = false;
  }
}
