import { Component, OnInit, ViewChild, ViewEncapsulation, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { SortServiceService } from '../sortService.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Location } from '@angular/common';
//import { CanComponentDeactivate } from '../can-deactivate-guard.guard';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated,
})
export class StudentComponent implements OnInit {
  // **ViewChild References**
  @ViewChild('dt2') dt2!: Table;
  @ViewChild('miniDialog') minidialogueForm!: NgForm;

  // **State Variables**
  studentActive: boolean = false; // it used for to checking the student is loggedin are not
  visible: boolean = false; // it used for rendering dialog dynamically
  isViewDetailsActive: boolean = false; // it used for student-details component rendering
  isAddBtnActive: boolean = false; // student form modal component

  paginator: boolean = false;
  isSerachRecordsEmpty: any;

  // **Position Tracking**
  position: 'top' | 'center' | 'topleft' | 'topright' = 'center';

  // **Student Data**

  studentList: object[] = [];
  paginatedStudentList: object[] = [];
  studentDetailsObject!: object;
  departmentList: object[] = [];
  filteredSearchList: object[] = [];

  // **Pagination Settings**
  currentPage: number = 0;
  totalPages: number[] = [];
  rowsPerPage = { name: 'Show 5', value: 5 };
  previousPage: number = 0; // here this variable using for to store current page value when search operation is happen 
  rowsPerPageArray = [
    { name: 'Show 5', value: 5 },
    { name: 'Show 10', value: 10 },
    { name: 'Show 20', value: 20 },
  ];
   totalRecords:number; 
  // **Student Validation Object**
  copiedObj = { studentId: '', department: '' };
  studentValidateObj = structuredClone(this.copiedObj);
  updatePage?: string;
  ispaginatorIsSingle = true;

  constructor(
    private service: LoginServiceService,
    private http: HttpClient,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: ChartDataService,
    private sortService: SortServiceService,
    private router: Router,
    private location: Location
  ) { }
  // **Lifecycle Hook**
  ngOnInit(): void {
    this.fetchStudentDetails();
    this.initializeState();
  }

  // **Initialize Component State**
  private initializeState(): void {
    this.departmentList = this.departmentService.departmentList;
    this.studentActive = !localStorage.getItem('studentId');

  }

  // **Fetch Student Details**
  fetchStudentDetails(): void {
    const studentSubscription = this.service.getStudentDetails().pipe(take(1)).subscribe({
      next: (response) => {
        this.studentList = response;
        this.filterStudentListById();// this executes when the student is loggedin
        this.calculateTotalPages(); // its calculating the total paginator pages
        this.togglePaginator(); // it enable the table paginator is true
        this.updatePaginatedList(); // it updating the updated pagination list 
      },
      error: (error) => console.log(error),
      complete: () => console.log("complete")
    });
  }

  // **Check User Type (Admin/Student)**
  private filterStudentListById(): void {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      this.studentList = this.studentList.filter((obj) => obj['id'] === studentId);
    }
  }

  // **Update Pagination pages**
  private calculateTotalPages(): void {
    if (this.filteredSearchList.length > 0) {
      this.totalPages = Array.from(
        { length: Math.ceil(this.filteredSearchList.length / this.rowsPerPage.value) },
        (_, i) => i + 1
      );
      if (this.totalPages.length <= 1) {
        this.ispaginatorIsSingle = false
      } else {
        this.ispaginatorIsSingle = true
      }
    //  console.log("filtered ", this.totalPages)
    } else {
      this.totalPages = Array.from(
        { length: Math.ceil(this.studentList.length / this.rowsPerPage.value) },
        (_, i) => i + 1
      );


    }
  }

  // **Enable/Disable Paginator**
  private togglePaginator(): void {
    this.paginator = this.studentList.length >= this.rowsPerPage.value;
  }

  // **Handle Student Deletion**
  onDeleteRecord(id: number, position: 'center' | 'topleft' | 'topright'): void {
    this.position = position;
    this.confirmAction(`Are you sure you want to remove ${id}? Confirm to delete.`, () => {
      const deleteSubscription = this.service.deleteStudentDetails(id).pipe(take(1)).subscribe({
        next: () => {
          this.fetchStudentDetails();
          // deleting all the records from the attendanceList whose id deleted from the student table
          const deptSubscribeInstance = this.service.getAttendanceDetails().pipe(take(1)).subscribe({
            next: (response) => {
              response.forEach((obj) => {
                if (obj.studentId === id) {
                  const deleteSubAttendance = this.service.deleteAttendanceDetails(obj.id).pipe(take(1)).subscribe({
                    next: (response) => {
                      //   deleteSubAttendance.unsubscribe();
                    },
                    error: (error) => deleteSubAttendance.unsubscribe()
                  })
                }
              })
            },
            complete: () => console.log("complete")
          })
        },
        error: (error) => console.error(error),
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student record is deleted', life: 1000 });
        }
      });
    });
  }

  // **Common Confirmation Dialog Method**
  private confirmAction(message: string, acceptCallback: () => void): void {
    this.confirmService.confirm({
      message: message,
      header: 'Confirmation',
      acceptButtonProps: { label: 'Yes', text: true },
      rejectButtonProps: { label: 'No', severity: 'secondary', text: true },
      accept: acceptCallback,
      reject: () => {
        this.messageService.add({ severity: 'error', 
          summary: 'Rejected',
           detail: 'Student record is not deleted', 
           life: 1000 // Duration in milliseconds for which the message is displayed.
          });
      },
      key: 'positionDialog', 
    });
  }

  // **Open Add Student Dialog**
  onClickAddData(position: 'center' | 'topleft' | 'topright'): void {
    this.visible = true;
    this.position = position;
  }

  // **Validate and Submit Student ID**
  onsubmitDialogue() {
    const id = this.minidialogueForm.controls['studentId'].value;
    const dept = this.minidialogueForm.controls['department'].value;

    if (!id || !dept) {
      alert('Please enter all fields');
      return;
    }
    this.studentValidateObj = structuredClone(this.copiedObj);
    this.service.findStudent(id).pipe(take(1)).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          this.isAddBtnActive = !this.isAddBtnActive;
          this.visible = false;
          this.minidialogueForm.resetForm();
          return;
        }
        if (response[0].id === id) {
          this.messageService.add({ severity: 'error', detail: 'StudentId is already Exists', life: 1000 });
          //  this.visible = false;
          //  this.minidialogueForm.resetForm();
        }
      },
      error: (error) => {
       // console.error(error)
        this.visible = false;
        this.minidialogueForm.resetForm();
        this.isAddBtnActive = false
      },
    });
  }

  // **View Student Details**
  viewStudentDetails(product: any): void {
    this.isViewDetailsActive = !this.isViewDetailsActive;
    this.studentDetailsObject = product;
  }
  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value.trim();
    if (this.dt2) {
      this.dt2.filterGlobal(inputValue, 'contains'); // Apply global filtering
      if (inputValue !== "") {
        this.filteredSearchList = this.studentList.filter((object) =>
          object["id"]?.toString().toLowerCase().includes(inputValue.toLowerCase()) ||
          object["firstname"]?.toLowerCase().includes(inputValue.toLowerCase()) ||
          object["department"]?.toLowerCase().includes(inputValue.toLowerCase()));

        this.isSerachRecordsEmpty = this.filteredSearchList.length === 0;
      } else {
        this.filteredSearchList = [];
        this.isSerachRecordsEmpty = null;
      }
      this.currentPage = 0; // Reset pagination to first page on search
      this.updatePaginatedList();
    }
  }
  onChangeRowsPerPage(event: any): void {
    this.rowsPerPage = event.value;
    this.currentPage = 0; // Reset page to first when changing rows per page
    this.updatePaginatedList();

    const dataSource = this.filteredSearchList.length > 0 ? this.filteredSearchList : this.studentList;
    this.ispaginatorIsSingle = dataSource.length > this.rowsPerPage.value;
  }

  updatePaginatedList(): void {
    const dataSource = this.filteredSearchList.length > 0 ? this.filteredSearchList : this.studentList;
    console.log(this.studentList);

    this.totalRecords = dataSource.length; // Update total count
    this.calculateTotalPages(); // Ensure paginator updates correctly

    const startIndex = this.currentPage * this.rowsPerPage.value;
    const endIndex = startIndex + this.rowsPerPage.value;
    this.paginatedStudentList = dataSource.slice(startIndex, endIndex);
  }

  // **Sort Student Records**
  sortColumn(field: string): void {
    this.currentPage = 0;
    this.studentList = this.sortService.sortData(this.studentList, field);
    // console.log(this.studentList)
    this.calculateTotalPages()
    this.updatePaginatedList();

  }

  handlePageChange(event: any): void {
    this.currentPage = event.page;
    this.previousPage = event.page;
    this.rowsPerPage.value = event.rows;
    this.updatePaginatedList();
  }


  onClickGo() {
    if (this.updatePage && parseInt(this.updatePage) > 0 && parseInt(this.updatePage) <= this.totalPages.length) {
      this.currentPage = parseInt(this.updatePage) - 1;
      this.updatePaginatedList();
      this.updatePage = "";
    }
  }

  onClickCancel() {
    this.minidialogueForm.resetForm();
    this.visible = false;
    this.isAddBtnActive = false;
  }

  onSubmitFrom() {
    this.fetchStudentDetails();
  }

  onSubmitFrom1() {
    this.fetchStudentDetails();
  }



  canDeactivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmService.confirm({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        rejectButtonProps: {
          label: 'No',
          severity: 'secondary',
          outlined: true
        },
        acceptButtonProps: {
          label: 'Yes'
        },
        accept: () => {



          if (localStorage.getItem('isUserLoggedout') === 'true') {
            console.log(this.router.url);
            console.log("isUserr", localStorage.getItem('isUserLoggedout'));
            localStorage.clear();
            this.router.navigate(['']).then(() => window.location.reload());
            console.log('logout');
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have logged out', life: 1000 });
          }


          resolve(true); // Allow navigation
        },
        reject: () => {
          if (localStorage.getItem('isUserLoggedout') === 'true') {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Logout cancelled', life: 1000 });
            //  result$.next(false)
          }
          localStorage.setItem('isUserLoggedout', 'false');
          resolve(false); // Prevent navigation
        }
      });
    });
  }
  /*canDeactivate(): any {
   console.log("canDeactivate from student");
    if(localStorage.getItem("jwtToken") !== null){
       localStorage.clear();
    }
 }*/
}
