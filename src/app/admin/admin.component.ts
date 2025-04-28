import { Component } from '@angular/core';
import { OnInit, OnChanges } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone:false
})
export class AdminComponent implements OnInit,OnChanges {

  constructor(private service: LoginServiceService, private http:HttpClient){}
  
  studentList: object[];

  ngOnChanges(){
    this.service.getStudentDetails().subscribe({
      next: (response) => {
        this.studentList = response
        console.log(this.studentList)
      },
      error: (error) => console.log(error),
      complete: ()=>console.log("completed")
    })
  }

  ngOnInit(){
    this.service.getStudentDetails().subscribe({
      next: (response) => {
        this.studentList = response
        console.log(this.studentList)
      },
      error: (error) => console.log(error),
      complete: ()=>console.log("completed")
    })
  }


  onDeleteRecord(id:number){
    console.log(id);
    this.service.deleteStudentDetails(id).subscribe({
      next: (response) => console.log(id),
      error: (error) => console.log(error),
      complete: ()=>console.log("completed")
    })
  }
}
