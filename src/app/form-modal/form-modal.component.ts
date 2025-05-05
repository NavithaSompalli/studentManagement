import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { Router } from '@angular/router';
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
    private router: Router
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

   // Date Formatting
   date = new Date();
   hours = this.date.getHours() % 12 || 12; 
   minutes = this.date.getMinutes();
   seconds = this.date.getSeconds();
   ampm = this.date.getHours() >= 12 ? 'PM' : 'AM';
   dateFormat = `${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()} ${this.hours}:${this.minutes}:${this.seconds} ${this.ampm}`;
 
  
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
    modifiedDttm: this.dateFormat,
    createdDttm: this.dateFormat,
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
   
    this.user["department"] = this.dept;
    this.user["departmentId"] = this.deptCode;
    console.log(this.user);
   
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

    console.log("departmentCode", this.deptCode);
    console.log("upadted user object", this.user);
}

  selectedUserType: string;

 
  
  onSubmitDialogue() {
    this.service.findStudent(this.user.id).subscribe({
      next: (response) => {
     //   console.log("Response :", response);
        if (response) {
          alert("Student already exists");
        } else {
          this.http.post('http://localhost:3000/studentList', this.user).subscribe({
            next: (response) => console.log(response),
            error: (error) => console.log("Error:", error),
            complete: () => console.log("Student details added successfully")
          });

          this.service.getStudentDetails().subscribe({
            next: (response) => console.log('Success:', response),
            error: (error) => console.log("Error:", error),
            complete: () => console.log("Student Details")
          });

          this.router.navigate(['home/student'])
        }
      }
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
