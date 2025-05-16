
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChartDataService } from '../chart-data.service';
import { SortServiceService } from '../sort-service.service';
import { Table } from 'primeng/table';
import { ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-student',
 
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  standalone:false,
  encapsulation: ViewEncapsulation.Emulated 
})
export class StudentComponent {

  studentActive: boolean = false;

  studentData = JSON.parse(localStorage.getItem('student'));
  position:  'top' | 'center' | 'topleft' | 'topright'  = 'center';

 visible: boolean = false;
 stuId: string= "";
 dept:string = "";
 isViewDetailsActive: boolean = false;
 studentDetailsObject: object;
// selectedDepartment: any = null;

loading: boolean = true;



  constructor(private service: LoginServiceService,
     private http:HttpClient, 
     private confirmService: ConfirmationService, 
     private messageService:MessageService, 
     private departmentObject: ChartDataService,
     private sortService: SortServiceService,
    
    ){}
  
  studentList: object[];
  paginator: boolean= false;
  isAddBtnActive:boolean = false;

  currentPage = 0;
  rowsPerPage = {
    name:"Show 5",
    value:5
  };
  totalPages = [];
  rowsPerPageArray = [{
        name:"Show 5",
        value:5
      },
      {
        name:"Show 10",
        value:10
      },
      {
        name:"Show 20",
        value:20
      }
  ]

  departmentList: object[];

  ngOnChanges(){
    this.service.getStudentDetails().subscribe({
      next: (response) => {
        this.studentList = response
       // console.log(this.studentList)
      },
      error: (error) => console.log(error),
      complete: ()=>console.log("completed")
    })

    
  }

  getStudentDetails(){ // this function return total records from the jsonserver
    this.service.getStudentDetails().subscribe({
      next: (response) => {
        this.studentList = response
       // console.log(this.studentList)

       if(localStorage.getItem("studentId") !== null){
          this.studentList = this.studentList.filter((obj)=> obj["id"] === localStorage.getItem("studentId"))
       }else{

         if(this.studentList.length >=5){
          this.paginator = true;
        }
        
       }


       
      },
      error: (error) => console.log(error),
      complete: ()=>{
    
         this.totalPages = Array.from({ length: Math.ceil(this.studentList.length / this.rowsPerPage.value) }, (_, i) => i + 1);
     
      }
    })
  }

  ngOnInit(){
    this.getStudentDetails();
    this.studentList = this.studentList || [];
    this.departmentList = this.departmentObject.departmentList;
    this.visible = false;
    this.isViewDetailsActive = false;
    if(this.studentData){
      this.studentActive = false;
    }else{
      this.studentActive = true;
    }

    console.log("this id form service", localStorage.getItem("studentId"));
    this.loading = false;
   
  }


  onDeleteRecord(id:number, position: 'center' | 'topleft' | 'topright' ){
    
    this.position = position;

    this.confirmService.confirm({
        message: `Are you sure you want to remove ${id}? Confirm to Delete.`,
        header: 'Confirmation',
        rejectButtonStyleClass: 'p-button-text',
        rejectButtonProps: {
            label: 'No',
            severity: 'secondary',
            text: true,
        },
        acceptButtonProps: {
            label: 'Yes',
            text: true,
        },
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Request submitted' });
           // console.log(id);
            this.service.deleteStudentDetails(id).subscribe({
              next: (response) => console.log(id),
              error: (error) => console.log(error),
              complete: ()=>{
                console.log("completed");
                this.getStudentDetails();
              }
            })
        },
        reject: () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Rejected',
                detail: 'Process incomplete',
                life: 3000,
            });
        },
        key: 'positionDialog',
    });
  }

  onClickAddData(position: 'center' | 'topleft' | 'topright' ){
    this.visible = !this.visible;
    this.position = position;
  }
 

/*studentValidateObj = {
  studentId:'',
  department:''
}*/

 copiedObj = {
  studentId:'',
  department:''
}
 
 
studentValidateObj =structuredClone(this.copiedObj);

@ViewChild('miniDialog') mindialogueForm : NgForm;

onsubmitDialogue(){

   let id = this.mindialogueForm.controls["studentId"].value;
   let dept = this.mindialogueForm.controls["department"].value;
   //console.log("validate",id,dept);

   console.log(id,dept);
   this.studentValidateObj = structuredClone(this.copiedObj);

   if(id !== undefined && dept !== undefined){

   this.service.findStudent(id).subscribe({
    next: (response) => {

      if (!response || response.length === 0) {
         this.isAddBtnActive = !this.isAddBtnActive;
        this.visible = !this.visible;
         this.mindialogueForm.resetForm();
      return
    }
      if(response[0].id === id ){
        
         this.messageService.add({ severity: 'error', detail: 'Student Already registered in this department' });
      }
    },
    error: (error) => console.log(error),
    complete: ()=>{
     // console.log("completed");


    }
  })
   
}else{
  alert("please enter all the fields");
}

}

// displaying each student record
viewStudentDetails(product:any){
  this.isViewDetailsActive = true;
 // console.log(product, this.isViewDetailsActive);
  this.studentDetailsObject = product;
}


sortColumn(field: string) {
  this.studentList = this.sortService.sortData(this.studentList, field);
}


@ViewChild('dt2') dt2!: Table; // Correctly reference the table

   onSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value; // Get input value
    if (this.dt2) {
        this.dt2.filterGlobal(inputValue, 'contains'); // Pass the string value
    }
}




}
