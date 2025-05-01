import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.css',
  standalone:false
})
export class FormModalComponent implements OnInit,OnChanges {
  constructor(private service: LoginServiceService, private http:HttpClient){}

 @Input() visible: boolean = false;
 @Input() stuId: string = "";
 @Input() dept: string = "";

    showDialog() {
        this.visible = true;
    }
    categories = [
      {
        name: "Female", key:'F'
      },
      {
        name: "Male", key:'M'
      },
      {
        name: "TransGender", key:"T"
      }
    ]
    
    student : object;

    ngOnInit(){
      this.student = this.service.user;
      console.log('services :',this.student);
    }
    ngOnChanges(){
      this.student = this.service.user;
      console.log('services :',this.student);
    }

    userTypes = [
      {
        name: 'User'
      },
      {
        name: 'Admin'
      }
    ]

    selectedUserType : string;
    
     date = new Date();
     hours = this.date.getHours() % 12 || 12; // Converts 24-hour format to 12-hour
     minutes = this.date.getMinutes();
    seconds = this.date.getSeconds();
    ampm = this.date.getHours() >= 12 ? 'PM' : 'AM'; // Determines AM/PM
    
    dateFormat = `${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()} ${this.hours}:${this.minutes}:${this.seconds} ${this.ampm}`;
    
     imageUrl!: string;
     
     user = {
      id:'ITO2025'+`${Math.floor(Math.random() * 90)+10}`,
      firstname:'',
      lastname:'',
      dob:'',
      email:'',
      phoneNumber:'',
      selectedCity:{ code: "+91", country: "India" },
      selectedCategory:'',
      image:this.imageUrl,
      modifiedResource:'Admin',
      modifiedSourceType:'Admin',
      modifiedDttm:this.dateFormat,
      createdDttm: new Date(),
      createdSourceType:'Admin',
      createdSource:'Admin',
      dateOfJoining:'',
      department:'',
      departmentId:''
    }

   
     countryPhoneCodes = [
      { country: "USA", code: "+1" },
      { country: "UK", code: "+44" },
      { country: "India", code: "+91" },
      { country: "Australia", code: "+61" },
      { country: "Canada", code: "+1" },
      { country: "Germany", code: "+49" },
      { country: "France", code: "+33" },
      { country: "Japan", code: "+81" },
      { country: "China", code: "+86" },
      { country: "Brazil", code: "+55" },
      { country: "Russia", code: "+7" },
      { country: "South Africa", code: "+27" },
      { country: "Mexico", code: "+52" },
      { country: "Italy", code: "+39" },
      { country: "Spain", code: "+34" },
      { country: "Saudi Arabia", code: "+966" },
      { country: "UAE", code: "+971" },
      { country: "Singapore", code: "+65" },
      { country: "South Korea", code: "+82" },
      { country: "Netherlands", code: "+31" }
  ];
    @ViewChild('dialogForm') form!: NgForm;

    onSubmitDialogue(){
     // console.log(this)
     // console.log(this.form);
     // console.log(this.imageUrl);

     // console.log(this.user.id)
      this.service.findStudent(this.user.id).subscribe({
        next: (response) =>{
          console.log("Response :" , response);
          if(!response){
            alert("student already exit");
          }else{
            this.http.post('http://localhost:3000/studentList', this.user).subscribe({
              next: (response) => console.log('Success:', response),
              error: (error) => console.log("error", error ),
              complete: () => console.log("Student deatails add successfully")
            });


            this.service.getStudentDetails().subscribe({
              next: (response) => console.log('success:', response),
              error: (error) =>console.log("error", error),
              complete:()=>console.log("Student Details")
            })
          }
        }
      })  
    }


    openUploadDialog() {
      document.getElementById('fileInput')?.click();
  }
  
  onFileSelected(event: any) {
      const file: File = event.target.files[0];
  
      if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
              this.imageUrl = reader.result as string;
          };
      }
  }
}
