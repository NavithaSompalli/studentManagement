import { Component, Input, OnInit, OnChanges,AfterViewChecked } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.css',
  standalone: false
})
export class FormModalComponent implements OnInit, OnChanges {
  constructor(
    private service: LoginServiceService, 
    private http: HttpClient,
    private chartDataService: ChartDataService, // Correct way to inject service
    private router: Router,
    private messageService: MessageService
  ) {}

  departmentList: any;

  @Input() visible: boolean = false;
  @Input() stuId: string = "";
  @Input() dept: string = "";

  deptCode?: string = "";


  categories = [
    { name: "Female", key: 'F' },
    { name: "Male", key: 'M' },
    { name: "TransGender", key: "T" }
  ];

  student: object;

  imageUrl: string = "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_960_720.png";

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
   
  
  user = {
    id: 'ITO2025' + `${Math.floor(Math.random() * 90) + 10}`,
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    phoneNumber: '',
    selectedCity: { code: "+91", country: "India" },
    selectedCategory: { name: "Female", key: 'F' },
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
    { country: "USA", code: "+1" },
    { country: "UK", code: "+44" },
    { country: "India", code: "+91" }
  ];




  ngOnInit() {
    this.departmentList = this.chartDataService.departmentList; // Access service data
  //  console.log('Department List:', this.departmentList);
    this.student = this.service.user;
   
   // this.user["department"] = this.dept;
   // this.user["departmentId"] = this.deptCode;
   // console.log(this.user);
   
  }

  ngOnChanges() {
    if (!this.departmentList || this.departmentList.length === 0) {
        console.warn('departmentList is undefined or empty.');
        return;
    }

    this.student = this.service.user;
    
    let index = this.departmentList.filter(depart => depart["departmentName"] === this.dept);
    
    if (index.length > 0) {
        this.deptCode = index[0]["departmentId"];
    } else {
        console.warn('No matching department found.');
        this.deptCode = null; // Assign default value
    }

    this.user["department"] = this.dept;
    this.user["id"] = this.stuId;
    this.user["departmentId"] = this.deptCode;

 
}

  selectedUserType: string;

 
  onSubmitDialogue() {
    let dateString = this.user["dateOfJoining"]
    const date = new Date(dateString);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    let amPm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

    this.user["dateOfJoining"]  = `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${amPm}`;

    this.service.findStudent(this.user.id).subscribe({
      next: (response) => {
        if (!response) {
          alert("Student already exists");
        } else {
          this.http.post('http://localhost:3000/studentList', this.user).pipe(
            switchMap(() => this.service.getStudentDetails()) // Fetch updated student list after adding
          ).subscribe({
            next: (updatedList) => {
          //    console.log('Updated Student List:', updatedList);
              this.router.navigate(['home/student']).then(() => {
                window.location.reload(); // Forces page refresh
              });
            },
            error: (error) => console.log("Error:", error),
            complete: () =>{ 
             // console.log(" and list refreshed")
              this.messageService.add({ severity: 'success', detail: 'Student details added successfully', life: 3000 });
            }
          });
        }
      },
      error: (error) => console.log("Error:", error)
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
        //console.log(this.imageUrl);
       // this.user["image"] = this.imageUrl;
      };
      reader.readAsDataURL(file);
     // console.log(this.imageUrl);
    }
  }

}
