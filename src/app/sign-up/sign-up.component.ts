import { Component, EventEmitter, Output, output } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  standalone: false
})
export class SignUpComponent {
   @Output() EventEmitter = new EventEmitter();

   isSignUpActive: Boolean = false


   
}
