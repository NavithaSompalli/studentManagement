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
import { take } from 'rxjs';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-attendance', // Fixed typo in "attendance"
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css'], // `styleUrls` should be an array
  standalone: false
})
export class AttendanceComponent implements OnInit {
  studentActive: boolean = false;
  ispaginatorIsSinglePage: boolean = true;
  studentData = JSON.parse(localStorage.getItem('student'));
  displayedPages: number[] = [];
  paginatedStudentList: object[] = [];
  updatePage?: string;
  attendanceList: object[];
  paginator: boolean = false;
  isAddBtnActive: boolean = false;
  currentPage = 0;
  rowsPerPage = {
    name: "Show 5",
    value: 5
  };
  totalPages = [];
  rowsPerPageArray = [{
    name: "Show 5",
    value: 5
  },
  {
    name: "Show 10",
    value: 10
  },
  {
    name: "Show 20",
    value: 20
  }
  ]

  departmentList: object[];
  visible: boolean = false;
  stuId: string = "";
  dept: string = "";
  isViewDetailsActive: boolean = false;
  studentDetailsObject: object;

  // mini dialogue box logic
  studentValidateModalObject = {
    studentId: '',
    department: '',
  }

  filteredDepartments: any[] = [];
  studentValidateObj = structuredClone(this.studentValidateModalObject);


  @ViewChild('miniDialog') mindialogueForm: NgForm;

  constructor(private service: LoginServiceService,
    private http: HttpClient,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private departmentObject: ChartDataService,
    private sortService: SortServiceService,
    private router: Router
  ) { }

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    return this.studentData !== null ? true : false; // Only allow exit if logged in
  }



  ngOnChanges() {
    this.getAttendanceStudentDetails();
    //  console.log(JSON.parse(localStorage.getItem('studentId')));

  }

  getAttendanceStudentDetails() { // this function return total records from the jsonserver
    this.service.getAttendanceDetails().pipe(take(1)).subscribe({
      next: (response) => {
        this.attendanceList = response;

        // console.log(this.attendanceList)
        if (this.attendanceList.length >= 5) {
          this.paginator = true;
        }

        if (localStorage.getItem("studentId") !== null) {
          this.attendanceList = this.attendanceList.filter((obj) => obj["studentId"] === localStorage.getItem("studentId"))
          console.log(this.attendanceList);
          if (this.attendanceList.length <= 0) {
            this.ispaginatorIsSinglePage = false
          }
          this.updatePaginatedList();
          this.calculateTotalPages();
          this.togglePaginator();
        } else {
          this.updatePaginatedList();
          this.calculateTotalPages();
          this.togglePaginator();
        }

      },
      error: (error) => console.log(error),
      complete: () => {

      }
    })
  }

  ngOnInit() {
    this.getAttendanceStudentDetails();
    this.attendanceList = this.attendanceList || [];
    this.departmentList = this.departmentObject.departmentList;
    if (this.studentData) {
      this.studentActive = false;
    } else {
      this.studentActive = true;
    }
  }

  onDeleteRecord(id: number) {

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
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Record is deleted from the attendace' });
        // console.log(id);
        this.service.deleteAttendanceDetails(id).pipe(take(1)).subscribe({
          next: (response) => console.log(id),
          error: (error) => console.log(error),
          complete: () => {
            console.log("completed");
            this.getAttendanceStudentDetails();
            this.router.navigate(['home/attendance'])
          }
        })
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Attendance record is not deleted.',
          life: 3000,
        });
      },
      key: 'positionDialog',
    });
  }

  onClickAddData() {
    this.visible = !this.visible;
    // this.isAddBtnActive = !this.isAddBtnActive;
  }
  // calculating paginator pages
  private calculateTotalPages(): void {
    this.totalPages = Array.from(
      { length: Math.ceil(this.attendanceList.length / this.rowsPerPage.value) },// no of elements in the array
      (_, i) => i + 1
    );
  }

  // Enable/Disable Paginator
  private togglePaginator(): void {
    this.paginator = this.attendanceList.length >= this.rowsPerPage.value;
  }

  /// **Page and Rows Per Page Update Logic**
  onChangeRowsPerPage(event: any) {
    this.rowsPerPage = event.value; // updating number of rows per page
    this.currentPage = 0; // reseting current page
    this.updatePaginatedList();
    if (this.attendanceList.length <= this.rowsPerPage.value) { // checking addtendaceList length is less than rowsperpge to toggle the paginator
      this.ispaginatorIsSinglePage = false
    } else {
      this.ispaginatorIsSinglePage = true
    }
  }

  updatePaginatedList() {
    // Function to update the paginated student list based on the current page
    const start = this.currentPage * this.rowsPerPage.value;
    // Calculates the starting index for slicing the list
    // `currentPage * rowsPerPage.value` gives the index of the first student on the current page

    const end = start + this.rowsPerPage.value;
    // Determines the ending index for slicing the list
    // The slice will include elements from `start` up to (but not including) `end`

    this.paginatedStudentList = this.attendanceList.slice(start, end);
    // Extracts the portion of `attendanceList` corresponding to the current page
    // Updates `paginatedStudentList` to display only the relevant subset of students
  }
  handlePageChange(event: any) {
    // Function to handle pagination when the user changes the page or rows per page
    this.currentPage = event.page;
    // Updates the `currentPage` value based on the new page selected in the pagination component
    this.rowsPerPage.value = event.rows;
    // Updates the number of rows per page based on the selected value in the pagination settings
    this.updatePaginatedList();
    // Calls the function to refresh the paginated list according to the new page and row settings
  }
  // Function to handle the user's "Go" button click for manual page navigation
  onClickGo() {
    //  console.log("Go");
    if (this.updatePage && parseInt(this.updatePage) > 0 && parseInt(this.updatePage) <= this.totalPages.length) { // - It does not exceed the total number of available pages.
      this.currentPage = parseInt(this.updatePage) - 1; // Subtracts 1 because pagination typically starts from index 0.
      this.updatePaginatedList();
      this.updatePage = "" // Clears the 'updatePage' input field after processing the page change.
    }
  }
  onsubmitDialogue() {
   // console.log(this.mindialogueForm);
    let id = this.mindialogueForm.controls["studentId"].value;
    let dept = this.mindialogueForm.controls["department"].value;
    this.studentValidateObj = structuredClone(this.studentValidateModalObject); // here coping the studentObj
    if (id !== undefined && dept !== undefined) {
      this.service.findStudent(id).pipe(take(1)).subscribe({
        next: (response) => {
          if (response !== false) {
            if (response[0].id === id && response[0].department === dept) {
              this.isAddBtnActive = !this.isAddBtnActive;
              this.visible = !this.visible;
            } else {
              if (response[0].id === id && response[0].department !== dept) {
                this.messageService.add({ severity: 'warn', detail: `${id} is not registred in this ${dept}` });
              }
            }
          } else {
            this.messageService.add({ severity: 'error', detail: `StudentId doesn't exit in the Student List` })
          }

        },
        error: (error) => this.messageService.add({ severity: 'warn', detail: `StudentId doesn't exit in the Student List` }),
        complete: () => {
          // console.log("completed");
          this.mindialogueForm.resetForm();
        }
      })

    } else {
      this.messageService.add({ severity: 'warn', detail: `please enter all the fields` });
    }
  }

  // displaying each student record
  viewStudentDetails(product: any) {
    this.isViewDetailsActive = !this.isViewDetailsActive;
    //  console.log(product, this.isViewDetailsActive);
    this.studentDetailsObject = product;
  }
  //filteredDepartment
  filterDepartment(event) {
    this.filteredDepartments = this.departmentList.filter(dept => {
      // console.log(dept["departmentName"]);
      dept["departmentName"].toLowerCase().includes(event.query.toLowerCase())
    }

    );
  }

  sortColumn(field: string) {
    this.attendanceList = this.sortService.sortData(this.attendanceList, field);
  }

  onCancelBtn() {
    this.visible = false;

    this.mindialogueForm.resetForm();
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



}
