import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { SortServiceService } from '../sort-service.service';

import { NgForm } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChartDataService } from '../chart-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance', // Fixed typo in "attendance"
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css'], // `styleUrls` should be an array
  standalone:false
})
export class AttendanceComponent implements OnInit {

  studentActive: boolean = false;

  studentData = JSON.parse(localStorage.getItem('student'));

   displayedPages: number[] = [];

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
     this.service.getStudentDetails().subscribe({
       next: (response) => {
         this.studentList = response
        // console.log(this.studentList)
       },
       error: (error) => console.log(error),
       complete: ()=>console.log("completed")
     })
   }
 
   getAttendanceStudentDetails(){ // this function return total records from the jsonserver
     this.service.getAttendanceDetails().subscribe({
       next: (response) => {
         this.studentList = response
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
       //  console.log("completed");
         this.totalPages = Array.from({ length: Math.ceil(this.studentList.length / this.rowsPerPage.value) }, (_, i) => i + 1);

      // console.log("total pages " + this.totalPages);
          if(this.totalPages.length === 2){
              this.displayedPages = [1,2];
            }else{
              this.displayedPages = [1,2,3];
            }
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
 
 // pagination logic  
 



// Update Pagination when rows per page changes
updatePagination() {
    this.currentPage = 0; // Reset to first page when pagination is updated
    this.totalPages = Array.from({ length: Math.ceil(this.studentList.length / this.rowsPerPage.value) }, (_, i) => i + 1);
    this.updateDisplayedPages();
}

// Get paginated data based on current page selection
get paginatedStudents() {
    const start = this.currentPage * this.rowsPerPage.value;
    const end = start + this.rowsPerPage.value;
    return this.studentList.slice(start, end);
}

// Update displayed pages (Only show 3 at a time dynamically)
updateDisplayedPages() {
    let start = Math.max(0, this.currentPage - 1); 
    let end = Math.min(this.totalPages.length, start + 3);
    if(this.totalPages.slice(start, end)[this.totalPages.slice(start, end).length-1] !== this.totalPages.length){
      this.displayedPages = this.totalPages.slice(start, end);
    }
    
}

// Navigate to previous page
prevPage() {
    if (this.currentPage > 0) {
        this.currentPage--;
        this.updateDisplayedPages();
    }
}

// Navigate to next page
nextPage() {
    if (this.currentPage < this.totalPages.length - 1) {
        this.currentPage++;
        this.updateDisplayedPages();
        console.log(this.displayedPages, this.totalPages.length);
    }
}

// Navigate to a specific page
goToPage(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPages.length) {
        this.currentPage = pageIndex;
    }
}

 
 
 // mini dialogue box logic
 
 studentValidateObj = {
   studentId:'',
   department:'',

 }
 
 @ViewChild('miniDialog') mindialogueForm : NgForm;
 
 onsubmitDialogue(){

 // console.log(this.mindialogueForm);
  //  console.log(this.mindialogueForm.controls["studentId"].value);
  //  console.log(this.mindialogueForm.controls["department"].value);

    let id = this.mindialogueForm.controls["studentId"].value;
    let dept = this.mindialogueForm.controls["department"].value;
    console.log(id,dept);

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
        //  alert("Student Id doesn't exit in the Student List")
           this.messageService.add({ severity: 'warn', detail: `Student Id doesn't exit in the Student List` });
        }
       
     },
     error: (error) => console.log(error),
     complete: ()=>{
      // console.log("completed");
     }
   })
    
 }else{
   // alert("please enter all the fields");
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

}
