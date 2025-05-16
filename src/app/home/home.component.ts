import { Component, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated 
})
export class HomeComponent {
  
 


  selectedComponent: string = 'home'

  receiveData(event){
    this.selectedComponent = event;
    console.log(this.selectedComponent);
  }
}
