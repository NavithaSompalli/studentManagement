import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { SortServiceService } from '../sortService.service';
import { Router } from '@angular/router';

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
  studentActive: boolean = false;
  visible: boolean = false;
  isViewDetailsActive: boolean = false;
  isAddBtnActive: boolean = false;
  loading: boolean = true;
  paginator: boolean = false;
  isSerachRecordsEmpty: any;

  // **Position Tracking**
  position: 'top' | 'center' | 'topleft' | 'topright' = 'center';

  // **Student Data**
  
  studentList: object[] = [];
  paginatedStudentList: object[] = [];
  studentDetailsObject!: object;
  departmentList: object[] = [];

  // **Pagination Settings**
  currentPage: number = 0;
  totalPages: number[] = [];
  rowsPerPage = { name: 'Show 5', value: 5 };
  rowsPerPageArray = [
    { name: 'Show 5', value: 5 },
    { name: 'Show 10', value: 10 },
    { name: 'Show 20', value: 20 },
  ];

  // **Student Validation Object**
  copiedObj = { studentId: '', department: '' };
  studentValidateObj = structuredClone(this.copiedObj);
  updatePage?: string;

  constructor(
    private service: LoginServiceService,
    private http: HttpClient,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private departmentService: ChartDataService,
    private sortService: SortServiceService,
    private router: Router
  ) {}

  // **Lifecycle Hook**
  ngOnInit(): void {
    this.fetchStudentDetails();
    this.initializeState();
  }

  // **Initialize Component State**
  private initializeState(): void {
    this.departmentList = this.departmentService.departmentList;
    this.studentActive = !localStorage.getItem('studentId');
    this.loading = false;
  }

  // **Fetch Student Details**
  private fetchStudentDetails(): void {
   const studentSubscription =   this.service.getStudentDetails().subscribe({
      next: (response) => {
        this.studentList = response;
        this.filterStudentListById();// this executes when the student is loggedin
        this.calculateTotalPages(); // its calculating the total paginator pages
        this.togglePaginator(); // it enable the table paginator is true
        this.updatePaginatedList(); // it updating the updated pagination list 
      },
      error: (error) => console.error(error),
      complete: () => studentSubscription.unsubscribe()
    });
  }

  // **Check User Type (Admin/Student)**
  private filterStudentListById(): void {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      this.studentList = this.studentList.filter((obj) => obj['id'] === studentId);
    }
  }

  // **Update Pagination**
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

  // **Handle Student Deletion**
  onDeleteRecord(id: number, position: 'center' | 'topleft' | 'topright'): void {
    this.position = position;

    this.confirmAction(`Are you sure you want to remove ${id}? Confirm to delete.`, () => {
    const deleteSubscription = this.service.deleteStudentDetails(id).subscribe({
        next: () => {
          this.fetchStudentDetails();

          // deleting all the records from the attendanceList whose id deleted from the student table
          const deptSubscribeInstance = this.service.getAttendanceDetails().subscribe({
                  next: (response) => {
                      response.forEach((obj)=> {
                        if(obj.studentId === id){
                         const deleteSubAttendance =  this.service.deleteAttendanceDetails(obj.id).subscribe({
                            next:(response) => {
                                  deleteSubAttendance.unsubscribe();
                            },
                            error:(error) => deleteSubAttendance.unsubscribe()
                          })
                        }
                      })
                  },
                  complete:()=> deptSubscribeInstance.unsubscribe()
          }) 
        },
        error: (error) => console.error(error),
        complete:()=> {
          deleteSubscription.unsubscribe()
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student record deleted', life:1000 });
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
      accept:acceptCallback,
      reject: () => {
       this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Student record is not deleted',life:1000 });
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
    this.service.findStudent(id).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          this.isAddBtnActive = !this.isAddBtnActive;
          this.visible = false;
          this.minidialogueForm.resetForm();
          return;
        }
        if (response[0].id === id) {
          this.messageService.add({ severity: 'error', detail: 'Student already registered in this department',life:1000 });
          this.visible = false;
          this.minidialogueForm.resetForm();
        }
      },
      error: (error) => {console.error(error)
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

  // **Sort Student Records**
  sortColumn(field: string): void {
    this.paginatedStudentList = this.sortService.sortData(this.studentList, field);
    this.updatePaginatedList();
  }

  // Search Functionality
  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (this.dt2) {
      this.dt2.filterGlobal(inputValue, 'contains');
      // console.log(this.dt2);
      if(inputValue !== ""){
        this.isSerachRecordsEmpty = this.dt2.filteredValue !== null;
      }else{
        this.isSerachRecordsEmpty = null;
      }
    }
  }

  ispaginatorIsSingle = true
  // **Page and Rows Per Page Update Logic**
  onChangeRowsPerPage(event: any) {
    this.rowsPerPage = event.value;
    this.currentPage = 0;
    this.updatePaginatedList();
    if(this.studentList.length < this.rowsPerPage.value ){
      this.ispaginatorIsSingle = false
    }else{
      this.ispaginatorIsSingle = true
    }
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
    // console.log(this.dt2);
  }

  onClickGo() {
    if (this.updatePage && parseInt(this.updatePage) > 0 && parseInt(this.updatePage) <= this.totalPages.length) {
      this.currentPage = parseInt(this.updatePage) - 1;
      this.updatePaginatedList();
      this.updatePage = "" 
    }
  }

  onClickCancel(){ 
    this.minidialogueForm.resetForm(); 
    this.visible = false; 
    this.isAddBtnActive = false;
  }
}
