import { Component, Input, OnInit, OnChanges, ViewChild, EventEmitter } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class FormModalComponent implements OnInit, OnChanges {
  constructor(
    private service: LoginServiceService,
    private http: HttpClient,
    private chartDataService: ChartDataService,
    private router: Router,
    private messageService: MessageService
  ) { }

  departmentList: any[] = [];

  @Input() visible: boolean = false;
  @Input() stuId: string = '';
  @Input() dept: string = ''; 
 @Output() messageEvent = new EventEmitter();
 
  



  deptCode?: string = '';

  @ViewChild('miniDialog') mindialogueForm!: NgForm;

  categories = [
    { name: 'Female', key: 'F' },
    { name: 'Male', key: 'M' },
    { name: 'Prefer not to say', key: 'P' }
  ];

  student: object = {};
  imageUrl: string = '';

  getFormattedDate(date: Date = new Date()): string {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    let amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${amPm}`;
  }

  user = {
    id: 'ITO2025' + `${Math.floor(Math.random() * 90) + 10}`,
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    phoneNumber: '',
    selectedCity: { code: '+91', country: 'India' },
    selectedCategory: '',
    image: '',
    modifiedResource: 'Admin',
    modifiedSourceType: 'Admin',
    modifiedDttm: this.getFormattedDate(),
    createdDttm: this.getFormattedDate(),
    createdSourceType: 'Admin',
    createdSource: 'Admin',
    dateOfJoining: '',
    department: this.dept,
    departmentId: this.deptCode,
    bloodGroup: '',
    address: ''
  };

  countryPhoneCodes = [
    { country: 'USA', code: '+1' },
    { country: 'UK', code: '+44' },
    { country: 'India', code: '+91' }
  ];

  ngOnInit() {
    this.departmentList = this.chartDataService.departmentList || [];
    this.student = this.service.user;
  }

  ngOnChanges() {
    if (!this.departmentList.length) {
      console.warn('departmentList is undefined or empty.');
      return;
    }

    // this.student = this.service.user;

    let matchedDept = this.departmentList.find(depart => depart['departmentName'] === this.dept);
    this.deptCode = matchedDept ? matchedDept['departmentId'] : null;

    this.service.findStudent(this.stuId).subscribe({
      next: (response) => {
        this.user = this.user;
        this.user.department = this.dept;
        this.user.id = this.stuId;
        this.user.departmentId = this.deptCode;
      },
      error: (error) => console.error('Error:', error)
    });

    this.user.department = this.dept;
    this.user.id = this.stuId;
    this.user.departmentId = this.deptCode;
  }


  isValidEmail: boolean = true;

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    this.isValidEmail = emailRegex.test(this.user.email);
  }

  @ViewChild('dialogForm') dialogForm: NgForm;
  onSubmitDialogue() {
    if (!this.user.dateOfJoining) {
      alert('Please provide a valid joining date.');
      return;
    }

    const date = new Date(this.user.dateOfJoining);
    this.user.dateOfJoining = this.getFormattedDate(date);
    this.user.dob = this.getFormattedDate(new Date(this.user.dob))
    this.service.findStudent(this.user.id).subscribe({
      next: (response) => {
        this.http.post('http://localhost:3000/studentList', this.user
        ).subscribe({
          next: () => {

                    this.messageEvent.emit();
           /* this.service.getStudentDetails().subscribe({
              next: (response) => {
              this.service.students$ = response;
                console.log(this.service.students);
                this.router.navigate(["home/student"]).then(() => {
                  window.location.reload(); // Forces page refresh
                });
              }
            })*/

           // this.visible = false
          },
          error: (error) => console.error('Error:', error),
          complete: () => {
            this.dialogForm.resetForm();
            this.messageService.add({ severity: 'success', detail: 'Student details added successfully', life: 3000 });
            this.visible = false
          }
        });
      },
      error: (error) => console.error('Error:', error)
    });
  }

  openUploadDialog() {
    document.getElementById('fileInput')?.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.user.image = this.imageUrl; // Ensure this is inside the onload function
      };
      reader.readAsDataURL(file);
    }
  }

  today: Date = new Date();

  onClickCancel() {
    this.visible = false;
    this.dialogForm.resetForm();
  }
}

