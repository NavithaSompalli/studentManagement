import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated 
})
export class LoginComponent implements OnInit {

  // Move all variable declarations to the top
  @Input() isSignUpActive: boolean = true;
  @ViewChild('myForm') form!: NgForm;
  @ViewChild('myFormSignup') signup!: NgForm;
  @ViewChild('miniDialogStudent') studentIDDialog: NgForm;

  studentId: string = "";
  visible2: boolean;
  username!: string;
  password!: string;
  confirmpassword!: string;
  userError: string = ''; 
  userType: boolean = false;
  visible: boolean;
  position: 'center' | 'topleft' | 'topright'  = 'center';

  userData = {
    id: '',
    username: '',
    password: '',
    confirmpassword: ''
  };

  studentIdObj = {
    studentId: ''
  };

  constructor(
    private http: HttpClient, 
    private loginService: LoginServiceService, 
    private messageService: MessageService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem("jwtToken");
    const isValidToken = token ? JSON.parse(token) : null;
    this.userType = JSON.parse(localStorage.getItem('student') || 'false');

    if (isValidToken !== null && this.userType !== undefined) {
      if (isValidToken) {
        this.router.navigate(['home/graph']);
      } else {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate(['']);
    }
  }

  showDialog() {
    this.isSignUpActive = !this.isSignUpActive;
  }

  closeDialog() {
    this.isSignUpActive = false;
  }

  onSubmitLogin(): any {
    const usernameControl = this.form.controls['username'];
    const passwordControl = this.form.controls['password'];

    this.username = usernameControl.value;
    this.password = passwordControl.value;

    if (this.username === undefined || this.password === undefined) {
      this.userError = !this.username ? 'Please Enter Username field' : !this.password ? 'Please Enter Password field' : 'Please Enter all the fields';
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: this.userError });
    } else if (this.username.trim() !== '' && this.password.trim() !== '') {
      this.loginService.login(this.username, this.password).subscribe({
        next: (response) => {
          if (this.username === 'admin') {
            localStorage.clear();
            localStorage.setItem("jwtToken", JSON.stringify(true));
            this.messageService.add({ severity: 'success', summary: 'Success', detail: "User Login Successfully" });
            this.router.navigate(['home/graph']);
          } else {
            let results = response.user.id;
            localStorage.setItem('studentId', results);
            this.loginService.studentId = results;
            localStorage.setItem('student', JSON.stringify({ "student": "true" }));
            localStorage.setItem("jwtToken", JSON.stringify(true));
            this.router.navigate(['home', 'graph']);
          }
        },
        error: (error) => {
          this.userError = error;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.userError });
        },
        complete: () => {
          this.username = "";
          this.password = "";
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: 'Please enter valid credentials.' });
    }
  }

  onSubmitSignUp() {
    let apiUrl = 'http://localhost:3000/users';
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{1,9}$/;

    if (!this.userData.username || !this.userData.password || !this.userData.confirmpassword) {
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: 'Please enter all the fields' });
    } else if (regex.test(this.userData.password)) {
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: 'Your password must be less than 10 characters and include at least one letter, one number, and one special character.' });
    } else if (this.userData.password !== this.userData.confirmpassword) {
      this.messageService.add({ severity: 'error', summary: 'Warn', detail: 'Password and Confirm Password must match' });
    } else {
    const signupSubscribe =   this.loginService.findStudent(this.userData.id).subscribe({
        next: (response) => {
          if (response) {
          const userSubscribe =   this.loginService.getUser(this.username, this.password, this.userData.id).subscribe({
              next: (response) => {
                if (response[0] === null) {
                  this.http.post(apiUrl, this.userData).subscribe({
                    next: () => console.log('Success'),
                    error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: error }),
                    complete: () => {
                      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
                      this.signup.resetForm();
                      userSubscribe.unsubscribe();
                    },
                  });
                  this.isSignUpActive = !this.isSignUpActive;
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Warning', detail: 'User already Exists' });
                }
              },
              complete: () => signupSubscribe.unsubscribe()
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Warning', detail: `User doesn't exist in the student list` });
          }
        }
      });
    }
  }

  onForgotPassword(position: 'topright') {
    this.position = position;
    this.visible = !this.visible;
  }



  onSubmitStudent() {
    this.loginService.findStudent(this.studentIdObj.studentId).subscribe({
      next: (response) => {
        if (response[0].id === this.studentIdObj.studentId) {
          localStorage.setItem('student', JSON.stringify({ "student": "true" }));
          localStorage.setItem("jwtToken", JSON.stringify(true));
          this.router.navigate(['home/student']);
          this.visible2 = !this.visible2;
        } else {
          alert(`${this.studentIdObj.studentId} does not exist.`);
        }
      }
    });
  }
}
