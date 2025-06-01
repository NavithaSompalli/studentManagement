import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { SortServiceService } from '../sortService.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavigationService } from '../navigation.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'], // Fixed `styleUrl` to `styleUrls`
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class DepartmentComponent implements OnInit {

  departmentList = []; // Store department data from ChartDataService
  studentList: object[] = []; // Initialize as an empty array
  paginator: boolean = false;
  isAddBtnActive: boolean = false;
  currentPage = 0;
  rowsPerPage = { name: "Show 5", value: 5 };
  totalPages = [];
  visible: boolean = false;
  paginatedStudentList: object[] = [];
  rowsPerPageArray = [
    { name: "Show 5", value: 5 },
    { name: "Show 10", value: 10 },
    { name: "Show 20", value: 20 }
  ];


  updatePage?: string;
  selectedDepartment: any = null;
  ispaginatorIsSinglePage: boolean = true
  constructor(private service: LoginServiceService,
    private http: HttpClient,
    private chartDataService: ChartDataService,
    private sortSerivce: SortServiceService,
    private router: Router,
    private location: Location,
    private navigationService: NavigationService,
     private confirmService: ConfirmationService,
        private messageService: MessageService,
  ) { }

  userType: string;

  ngOnInit() {

    const token = localStorage.getItem("jwtToken");
    const isValidToken = token ? JSON.parse(token) : null;
    this.userType = JSON.parse(localStorage.getItem('student'));
    // console.log("department",this.userType);
    if (this.userType !== null) {
      if (isValidToken !== null && token !== undefined) {
        if (this.userType["student"] === 'true') {
          // console.log("department",this.router.url)
        /*  if (this.router.url === '/home/department') {
            this.location.back();
          }*/
         

          /*else{
              const prevUrl = this.navigationService.getPreviousUrl();
           //   console.log("navi",prevUrl);
              this.router.navigate([prevUrl.slice(1,prevUrl.length)]);
          }*/
        }
      }
    }
    this.departmentList = this.chartDataService.departmentList; // Fetching department data from the service
    this.getStudentDetails();
    this.updatePaginatedList();

  }

  getStudentDetails() {
    this.service.getStudentDetails().pipe(take(1)).subscribe({
      next: (response) => {
        this.studentList = response;
        const departmentStudentCount = {};

        this.studentList.forEach(student => {
          const deptId = student['departmentId'];
          departmentStudentCount[deptId] = (departmentStudentCount[deptId] || 0) + 1;
        });

        // Update departmentList with actual student count
        this.departmentList.forEach(department => {
          department.noOfStudents = departmentStudentCount[department.departmentId] || 0;
        });

        if (this.studentList.length >= 5) {
          this.paginator = true;
        }
      },
      error: (error) => console.error('Error fetching student details:', error),
      complete: () => {
        this.totalPages = Array.from({ length: Math.ceil(this.studentList.length / this.rowsPerPage.value) }, (_, i) => i);
      }
    });
  }

  // this function is used for to selecting each student details 
  viewStudentDetails(department) {
    // Implement view logic
    this.selectedDepartment = department;
    this.visible = !this.visible;
  }

  // sorting table rows based on column name
  sortColumn(field: string) {
    this.departmentList = this.sortSerivce.sortData(this.departmentList, field);
  }


  // **Page and Rows Per Page Update Logic**
  onChangeRowsPerPage(event: any) {
    this.rowsPerPage = event.value;
    this.currentPage = 0;
    this.updatePaginatedList();
    if (this.departmentList.length <= this.rowsPerPage.value) {
      this.ispaginatorIsSinglePage = false
    } else {
      this.ispaginatorIsSinglePage = true
    }
  }

  updatePaginatedList() {
    const start = this.currentPage * this.rowsPerPage.value;
    const end = start + this.rowsPerPage.value;
    this.paginatedStudentList = this.departmentList.slice(start, end);
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
            
  
           
            if(localStorage.getItem('isUserLoggedout') === 'true'){
               console.log(this.router.url);
            console.log("isUserr",localStorage.getItem('isUserLoggedout'));
              localStorage.clear();
              this.router.navigate(['']).then(() => window.location.reload());
              console.log('logout');
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have logged out', life: 1000 });
            }
  
            
            resolve(true); // Allow navigation
          },
          reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Logout cancelled', life: 1000 });
          //  result$.next(false)
          localStorage.setItem('isUserLoggedout','false');
            resolve(false); // Prevent navigation
          }
        });
      });
    }
}
