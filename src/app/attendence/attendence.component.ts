import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { SortServiceService } from '../sortService.service';

import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChartDataService } from '../chart-data.service';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-attendance', // Fixed typo in "attendance"
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css'], // `styleUrls` should be an array
  standalone:false,
  encapsulation: ViewEncapsulation.Emulated 
})
export class AttendanceComponent implements OnInit {

  studentActive: boolean = false;

  studentData = JSON.parse(localStorage.getItem('student'));

  displayedPages: number[] = [];
  paginatedStudentList: object[] = [];
  updatePage?:string;

  position:  'top' | 'center' | 'topleft' | 'topright'  = 'center';
  

  visible: boolean = false;
  stuId: string= "";
  dept:string = "";
  isViewDetailsActive: boolean = false;
  studentDetailsObject: object;
 
   constructor(private service: LoginServiceService, 
    private http:HttpClient, 
    private confirmService: ConfirmationService, 
    private messageService:MessageService, 
    private departmentObject: ChartDataService,
    private sortService: SortServiceService,
    private router:Router
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
     this.getAttendanceStudentDetails();
    
   }
 
   getAttendanceStudentDetails(){ // this function return total records from the jsonserver
     this.service.getAttendanceDetails().subscribe({
       next: (response) => {
         this.studentList = response;
          this.updatePaginatedList();
          this.calculateTotalPages();
          this.togglePaginator();
        // console.log(this.studentList)
         if(this.studentList.length >=5){
           this.paginator = true;
         }

         if(localStorage.getItem("studentId") !== null){
          this.studentList = this.studentList.filter((obj)=> obj["studentId"] === localStorage.getItem("studentId"))
          
       }
       
       },
       error: (error) => console.log(error),
       complete: ()=>{
       
       }
     })
   }
 
   ngOnInit(){
     this.getAttendanceStudentDetails();
     this.studentList = this.studentList || [];
     this.departmentList = this.departmentObject.departmentList;
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
             this.service.deleteAttendanceDetails(id).subscribe({
               next: (response) => console.log(id),
               error: (error) => console.log(error),
               complete: ()=>{
                 console.log("completed");
                 this.getAttendanceStudentDetails();
                 this.router.navigate(['home/attendance']).then(() => {
                  window.location.reload(); // Forces page refresh
                });
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
 
    private calculateTotalPages(): void {
    this.totalPages = Array.from(
      { length: Math.ceil(this.studentList.length / this.rowsPerPage.value) },
      (_, i) => i + 1
    );
  }

  // **Enable/Disable Paginator**
  private togglePaginator(): void {
    this.paginator = this.studentList.length >= this.rowsPerPage.value;
  }
 
 



/// **Page and Rows Per Page Update Logic**
  onChangeRowsPerPage(event: any) {
    this.rowsPerPage = event.value;
    this.currentPage = 0;
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const start = this.currentPage * this.rowsPerPage.value;
    const end = start + this.rowsPerPage.value;
    this.paginatedStudentList = this.studentList.slice(start, end);
  }

  handlePageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage.value = event.rows;
    this.updatePaginatedList();
  }

  onClickGo() {
    console.log("Go");
    if (this.updatePage && parseInt(this.updatePage) > 0 && parseInt(this.updatePage) <= this.totalPages.length) {
      this.currentPage = parseInt(this.updatePage) - 1;
      this.updatePaginatedList();
      this.updatePage = ""
      
    }
  }

 
 
 // mini dialogue box logic
 studentValidateModalObject = {
   studentId:'',
   department:'',
 }
 
 
 studentValidateObj = structuredClone(this.studentValidateModalObject);
 
 
 @ViewChild('miniDialog') mindialogueForm : NgForm;
 
 onsubmitDialogue(){

 // console.log(this.mindialogueForm);
  //  console.log(this.mindialogueForm.controls["studentId"].value);
  //  console.log(this.mindialogueForm.controls["department"].value);

    let id = this.mindialogueForm.controls["studentId"].value;
    let dept = this.mindialogueForm.controls["department"].value;
    console.log(id,dept);

  // console.log(this.studentValidateObj);
  this.studentValidateObj = structuredClone(this.studentValidateModalObject);
  // console.log(this.studentValidateObj);
 
    if(id !== undefined && dept !== undefined){
 
    this.service.findStudent(id).subscribe({
     next: (response) => {
     //  console.log(response, "onsubmitDialogue");
     //  console.log(response[0].studentId === id , response[0].department === dept)
       // console.log(response);
        if(response){
        this.isAddBtnActive = !this.isAddBtnActive;
         this.visible = !this.visible;
        
        }else{
       
           this.messageService.add({ severity: 'warn', detail: `Student Id doesn't exit in the Student List` });
        }
       
     },
     error: (error) => console.log(error),
     complete: ()=>{
      // console.log("completed");
       this.mindialogueForm.resetForm();
     }
   })
    
 }else{
   
   this.messageService.add({ severity: 'warn', detail: `please enter all the fields` });
 }
 
 }
 
 // displaying each student record
 viewStudentDetails(product:any){
   this.isViewDetailsActive = !this.isViewDetailsActive;
   console.log(product, this.isViewDetailsActive);
   this.studentDetailsObject = product;
 }
 

 //filteredDepartment
 filteredDepartments: any[] = [];
 
 filterDepartment(event) {
   this.filteredDepartments = this.departmentList.filter(dept =>{
     // console.log(dept["departmentName"]);
     dept["departmentName"].toLowerCase().includes(event.query.toLowerCase())
   }
     
   );
  }


  sortColumn(field: string) {
    this.studentList = this.sortService.sortData(this.studentList, field);
  }

  onCancelBtn(){
    this.visible = false;
    this.mindialogueForm.resetForm();
  }

}
