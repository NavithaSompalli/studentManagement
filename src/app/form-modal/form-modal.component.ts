import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
  standalone: false
})
export class FormModalComponent implements OnInit, OnChanges {
  constructor(
    private service: LoginServiceService, 
    private http: HttpClient,
    private chartDataService: ChartDataService,
    private router: Router,
    private messageService: MessageService
  ) {}

  departmentList: any[] = [];

  @Input() visible: boolean = false;
  @Input() stuId: string = '';
  @Input() dept: string = '';

  deptCode?: string = '';

  @ViewChild('miniDialog') mindialogueForm!: NgForm;

  categories = [
    { name: 'Female', key: 'F' },
    { name: 'Male', key: 'M' },
    { name: 'TransGender', key: 'T' }
  ];

  student: object = {};
  imageUrl: string = 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_960_720.png';

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
    selectedCategory: { name: 'Female', key: 'F' },
    image: this.imageUrl,
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
       console.log(response);
        if (response) {
        this.user.firstname = response[0].firstname;
         this.user.lastname = response[0].lastname;
         this.user.dob = response[0].dob;
         this.user.selectedCategory = response[0].selectedCategory,
         this.user.image = response[0].image,
         this.user.address = response[0].address,
         this.user.email = response[0].email,
         this.user.bloodGroup = response[0].bloodGroup,
         this.user = response[0]
         this.user.departmentId = this.deptCode;
         this.user.department = this.dept;
        }else{
          console.log(response);

          this.user = this.user;
          this.user.department = this.dept;
          this.user.id = this.stuId;
          this.user.departmentId = this.deptCode;
        }
      },
      error: (error) => console.error('Error:', error)
    });
    
      this.user.department = this.dept;
          this.user.id = this.stuId;
          this.user.departmentId = this.deptCode;
  }

  onSubmitDialogue() {
    if (!this.user.dateOfJoining) {
      alert('Please provide a valid joining date.');
      return;
    }

    const date = new Date(this.user.dateOfJoining);
    this.user.dateOfJoining = this.getFormattedDate(date);


    this.service.findStudent(this.user.id).subscribe({
      next: (response) => {
    console.log("User",this.user);
    console.log(response);

        
          this.http.post('http://localhost:3000/studentList', this.user).pipe(
            switchMap(() => this.service.getStudentDetails())
          ).subscribe({
            next: () => {
              this.router.navigate(['home/student']).then(() => window.location.reload());
              this.visible = false
            },
            error: (error) => console.error('Error:', error),
            complete: () => {
              this.messageService.add({ severity: 'success', detail: 'Student details added successfully', life: 3000 });
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

}
