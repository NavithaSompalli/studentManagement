import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrected property
  standalone: false
})
export class LoginComponent {
  @Input() isSignUpActive: boolean = true;

  constructor(private http: HttpClient, private loginService: LoginServiceService, private messageService: MessageService) {} 
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

  @ViewChild('myForm') form!: NgForm;

  onSubmit(): any {
    if (!this.form) {
      alert('Form is not properly initialized.');
      return;
    }
  
    const usernameControl = this.form.controls['username'];
    const passwordControl = this.form.controls['password'];
  
    if (!usernameControl || !passwordControl) {
      alert('Invalid form structure.');
      return;
    }
  
    this.username = usernameControl.value;
    this.password = passwordControl.value;
  
    if (this.username.trim() !== '' && this.password.trim() !== '') {
      //console.log('Attempting login...');
    /*  this.loginService.login(this.username, this.password).subscribe({
        next: () => alert('Login Successful'),
        error: (error) => {
          console.error('Login failed:', error);
          alert('Invalid Credentials');
        }
      });*/

      this.loginService.login(this.username, this.password).subscribe({
        next: (response) => console.log('Success:', response),
        error: (error) => {
          this.userError = error
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.userError })
        },
        complete: () => {
          this.userError = "User Login Successfully";
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.userError })
        },
      });

    } else {
      this.userError = 'Please enter valid credentials.'
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: this.userError});
    }
  }
  

  @ViewChild('myFormSignup') signup!: NgForm;

  onSubmitSignUp() {
    let apiUrl = 'http://localhost:3000/users';
    let userData = {
      username: this.username,
      password: this.password,
    };

    if (!this.username || !this.password || !this.confirmpassword) {
      this.userError = 'Please enter all the fields';
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: this.userError })
    } else if (this.password !== this.confirmpassword) {
      this.userError = 'Password and Confirm Password must match';
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: this.userError })
    } else {
     // console.log('User created successfully');

      this.http.post(apiUrl, userData).subscribe({
        next: (response) => console.log('Success:', response),
        error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: error }),
        complete: () => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' }),
      });

      this.isSignUpActive = !this.isSignUpActive;
    }
  }
}
