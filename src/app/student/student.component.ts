
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChartDataService } from '../chart-data.service';
import { SortServiceService } from '../sort-service.service';
@Component({
  selector: 'app-student',
 
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  standalone:false
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


  constructor(private service: LoginServiceService,
     private http:HttpClient, 
     private confirmService: ConfirmationService, 
     private messageService:MessageService, 
     private departmentObject: ChartDataService,
     private sortService: SortServiceService
    ){}
  
  studentList: object[];
  paginator: boolean= false;
  isAddBtnActive:boolean = false;
  currentPage = 0;
  rowsPerPage = {
    name:"show 5",
    value:5
  };
  totalPages = [];
  rowsPerPageArray = [{
        name:"show 5",
        value:5
      },
      {
        name:"show 10",
        value:10
      },
      {
        name:"show 20",
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
        if(this.studentList.length >=5){
          this.paginator = true;
        }
      },
      error: (error) => console.log(error),
      complete: ()=>{
      //  console.log("completed");
        this.totalPages = Array(Math.ceil(this.studentList.length / this.rowsPerPage.value)).fill(0);
     // console.log("total pages " + this.totalPages);
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

// pagination logic  

  updatePagination(){
    this.currentPage = 0; // Reset to first page whenever rows per page changes
    this.totalPages = Array.from({ length: Math.ceil(this.studentList.length / this.rowsPerPage.value) }, (_, i) => i);
  }

  get paginatedStudents() { // this method returns rows(based on the rowsperpage)
    const start = this.currentPage * this.rowsPerPage.value;
    const end = start + this.rowsPerPage.value;
    return this.studentList.slice(start, end);
}

prevPage() {
    if (this.currentPage > 0) this.currentPage--;
}

nextPage() {
    if (this.currentPage < this.totalPages.length - 1) this.currentPage++;
}

goToPage(index: number) {
    this.currentPage = index;
}



// mini dialogue box logic

studentValidateObj = {
  studentId:'',
  department:''
}

@ViewChild('miniDialog') mindialogueForm : NgForm;

onsubmitDialogue(){

   let id = this.mindialogueForm.controls["studentId"].value;
   let dept = this.mindialogueForm.controls["department"].value;
   //console.log("validate",id,dept);

   if(id !== undefined && dept !== undefined){

   this.service.findStudent(id).subscribe({
    next: (response) => {
  
      if(response[0].id === id && response[0].department === dept){
        alert("Student Already registered in this department");
      }else{
        this.isAddBtnActive = !this.isAddBtnActive;
        this.visible = !this.visible;
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
  this.isViewDetailsActive = !this.isViewDetailsActive;
 // console.log(product, this.isViewDetailsActive);
  this.studentDetailsObject = product;
  
}


sortColumn(field: string) {
  this.studentList = this.sortService.sortData(this.studentList, field);
}





}
