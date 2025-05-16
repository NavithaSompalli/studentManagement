import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { HttpClient } from '@angular/common/http';
import { ChartDataService } from '../chart-data.service';
import { SortServiceService } from '../sort-service.service';
import { ViewEncapsulation } from '@angular/core';

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
  visible:boolean = false;
  rowsPerPageArray = [
    { name: "Show 5", value: 5 },
    { name: "Show 10", value: 10 },
    { name: "Show 20", value: 20 }
  ];

  selectedDepartment: any = null;

  constructor(private service: LoginServiceService, 
    private http: HttpClient, 
    private chartDataService: ChartDataService,
    private sortSerivce: SortServiceService
  ) {}

  ngOnInit() {
    this.departmentList = this.chartDataService.departmentList; // Fetching department data from the service
    this.getStudentDetails();
  }

  getStudentDetails() { 
    this.service.getStudentDetails().subscribe({
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

 
  viewStudentDetails(department) {
    // Implement view logic
    this.selectedDepartment = department;
    this.visible = !this.visible;
  }

  sortColumn(field: string) {
    this.departmentList = this.sortSerivce.sortData(this.departmentList, field);
  }
}
