
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-student',
 
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  standalone:false
})
export class StudentComponent {
  position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';

 visible: boolean = false;
 stuId: string= "";
 dept:string = "";

  constructor(private service: LoginServiceService, private http:HttpClient, private confirmService: ConfirmationService, private messageService:MessageService ){}
  
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

  getStudentDetails(){
    this.service.getStudentDetails().subscribe({
      next: (response) => {
        this.studentList = response
        console.log(this.studentList)
        if(this.studentList.length >=5){
          this.paginator = true;
        }
      },
      error: (error) => console.log(error),
      complete: ()=>{
        console.log("completed");
        this.totalPages = Array(Math.ceil(this.studentList.length / this.rowsPerPage.value)).fill(0);
      console.log("total pages " + this.totalPages);
      }
    })
  }

  ngOnInit(){
    this.getStudentDetails();
  }


  onDeleteRecord(id:number, position:'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'){
    this.position = position;

    this.confirmService.confirm({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        rejectButtonStyleClass: 'p-button-text',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            text: true,
        },
        acceptButtonProps: {
            label: 'Delete',
            text: true,
        },
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Request submitted' });
            console.log(id);
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

  onClickAddData(position:'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'){
    this.visible = !this.visible;
    this.position = position;
  }

  /*OnCreateRecord(){
    this.isAddBtnActive = !this.isAddBtnActive;
    this.visible = !this.visible;
  }*/

  updatePagination(){
    this.currentPage = 0; // Reset to first page whenever rows per page changes
    this.totalPages = Array.from({ length: Math.ceil(this.studentList.length / this.rowsPerPage.value) }, (_, i) => i);
  }

  get paginatedStudents() {
    const start = this.currentPage * this.rowsPerPage.value;
    const end = start + this.rowsPerPage.value;
    return this.studentList.slice(start, end);
}

onViewDetails(id){
  console.log(id);
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

onsumbitDialogue(){
 //  console.log(this.mindialogueForm.controls["studentId"].value);
 //  console.log(this.mindialogueForm.controls["department"].value);
   let id = this.mindialogueForm.controls["studentId"].value;
   let dept = this.mindialogueForm.controls["department"].value;
   console.log(id,dept);

   if(id !== undefined && dept !== undefined){

   this.service.findStudent(id).subscribe({
    next: (response) => {
      console.log(response, "onsubmitDialogue");
      console.log(response[0].studentId === id , response[0].department === dept)
      if(response[0].id === id && response[0].department === dept){
        alert("Student Already registered in this department");
      }else{
        this.isAddBtnActive = !this.isAddBtnActive;
        this.visible = !this.visible;
      }
    },
    error: (error) => console.log(error),
    complete: ()=>{
      console.log("completed");
    }
  })
   
}else{
  alert("please enter all the fields");
}

}

}
