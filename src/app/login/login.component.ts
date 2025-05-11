import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrected property
  standalone: false
})
export class LoginComponent implements OnInit{
  @Input() isSignUpActive: boolean = true;
  studentId:string = "";
  visible2:boolean;
  

  constructor(private http: HttpClient, private loginService: LoginServiceService, private messageService: MessageService, private router: Router) {} 
  //loginService: LoginServiceService = Inject(LoginServiceService);

  showDialog() {
    this.isSignUpActive = !this.isSignUpActive;
  }

  closeDialog() {
    this.isSignUpActive = false;
  }

  username!: string;
  password!: string;
  confirmpassword!: string;
  userError: string = ''; 
  userType:boolean = false;
 ngOnInit(): void {
    const token = localStorage.getItem("jwtToken");
  const isValidToken = token ? JSON.parse(token) : null;
   this.userType =  JSON.parse(localStorage.getItem('student'));

   if(isValidToken !== null && this.userType !== undefined  ){
  if (isValidToken) {
    if(this.userType === true){
      this.router.navigate(['home/graph'])
    }else{
      this.router.navigate(['home/graph'])
    }
    
  } else {
    this.router.navigate(['']);
  }
}else{
   this.router.navigate(['']);
}
 
   
 }
  

  @ViewChild('myForm') form!: NgForm;

  onSubmitLogin(): any {
   /* if (!this.form) {
      alert('Form is not properly initialized.');
      return;
    }*/
  
    const usernameControl = this.form.controls['username'];
    const passwordControl = this.form.controls['password'];
  
   /* if (!usernameControl || !passwordControl) {
      alert('Invalid form structure.');
      return;
    }*/
  
    this.username = usernameControl.value;
    this.password = passwordControl.value;

    if(this.username === undefined || this.password === undefined){
      if(this.username === undefined && this.password !== undefined){
        this.userError = 'Please Enter Username field';
        this.messageService.add({ severity: 'error', summary: 'Warn', detail: this.userError});
      }else if(this.username !== undefined && this.password === undefined){
        this.userError = 'Please Enter Password field';
        this.messageService.add({ severity: 'error', summary: 'Warn', detail: this.userError});
      }else{
      this.userError = "Please Enter all the fields"
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: this.userError});
      }
    }else if (this.username.trim() !== '' && this.password.trim() !== '') {
      //console.log('Attempting login...');
    /*  this.loginService.login(this.username, this.password).subscribe({
        next: () => alert('Login Successful'),
        error: (error) => {
          console.error('Login failed:', error);
          alert('Invalid Credentials');
        }
      });*/

      this.loginService.login(this.username, this.password).subscribe({
        next: (response) => {console.log('Success:', response)
          if(this.username === 'admin'){
          this.userError = "User Login Successfully";
          localStorage.clear();
          localStorage.setItem("jwtToken", JSON.stringify(true));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.userError })
          this.router.navigate(['home/graph']);
          }else{
           // this.visible2 = !this.visible2
          /*  this.router.navigate(['home/graph']);
            localStorage.setItem('student', JSON.stringify({"student": "true"}));*/
           // this.onStudentLoginDetails(response.user.id)
           console.log(response)
           let results = response.user.id;
           localStorage.setItem('studentId', results);
           this.loginService.studentId = response.user.id;
          // console.log(results);
            localStorage.setItem('student', JSON.stringify({"student": "true"}));
            localStorage.setItem("jwtToken", JSON.stringify(true));
            this.router.navigate(['home','graph']);
          }
        },
        error: (error) => {
          this.userError = error
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.userError })
        },
        complete: () => {}
      });

    } else {
      this.userError = 'Please enter valid credentials.'
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: this.userError});
    }
  }
  
  @ViewChild('myFormSignup') signup!: NgForm;

  userData = {
    id:'',
    username:'',
    password:'',
    confirmpassword:''
  }

  onSubmitSignUp() {
    let apiUrl = 'http://localhost:3000/users';
    /*let userData = {
      username: this.username,
      password: this.password,
    };*/

   // let response = false

   console.log(this.userData);
    if (!this.userData.username || !this.userData.password || !this.userData.confirmpassword) {
      this.userError = 'Please enter all the fields';
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: this.userError })
    } else if (this.userData.password !== this.userData.confirmpassword) {
      this.userError = 'Password and Confirm Password must match';
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: this.userError })
    } else {
     // console.log('User created successfully'); 
      
     this.loginService.getUser(this.username, this.password).subscribe({
      next: (response) => {
        if(response){
          console.log(`Get User true :  ${response}`);
              this.http.post(apiUrl, this.userData).subscribe({
                next: (response) => console.log('Success:', response),
                error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: error }),
                complete: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' }),
              });
    
              this.isSignUpActive = !this.isSignUpActive;
            }else{
            //  console.log(`Get User false:  ${response}`);
              this.messageService.add({severity: 'error', summary: 'Warning', detail: 'User already Exits'});
            }
      }
     })
    }
  }

 // Forgot password
 visible: boolean; 
 position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';
  onForgotPassword(position:  'topright' ){
    this.position = position;
    this.visible = !this.visible
  }


  onStudentLoginDetails(){}



  @ViewChild('miniDialogStudent') studentIDDialog: NgForm;
  studentIdObj = {
    studentId:''
  }
  onSubmitStudent(){
    console.log(this.studentIdObj);
    this.loginService.findStudent(this.studentIdObj.studentId).subscribe({
      next: (response) => {
    
        if(response[0].id === this.studentIdObj.studentId){
          localStorage.setItem('student', JSON.stringify({"student": "true"}));
          localStorage.setItem("jwtToken", JSON.stringify(true));
          this.router.navigate(['home/student']);
            localStorage.setItem('student', JSON.stringify({"student": "true"}));
          this.visible2 = !this.visible2;
        }else{
          alert(`${this.studentIdObj.studentId} does not exits.`)
        }
      },
      error: (error) => console.log(error),
      complete: ()=>{
       // console.log("completed");
      }
    })
     
  }
}

