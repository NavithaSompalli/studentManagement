
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student',
 
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  standalone:false
})
export class StudentComponent {

  constructor(private service: LoginServiceService, private http:HttpClient){}

  visible: boolean = false;

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
     dateFormat = `${this.date.getDay()}-${this.date.getMonth()}-${this.date.getFullYear()} ${this.date.getHours()}:${this.date.getSeconds()} `
     imageUrl!: string;
    user = {
      username:'',
      firstname:'',
      lastname:'',
      dob:'',
      email:'',
      phoneNumber:'',
      selectedCity:{ code: "+91", country: "India" },
      selectedCategory:'',
      image:this.imageUrl,
      modifiedResource:'ECE',
      modifiedSourceType:'Admin',
      modifiedDttm:this.dateFormat,
      createdDttm:this.dateFormat,
      createdSourceType:'Admin',
      createdSource:'CSE',
      dateOfJoining:''
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
      console.log(this.form);
      console.log(this.imageUrl);
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
