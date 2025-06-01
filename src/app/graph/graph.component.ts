import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'], // Fixed property name
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated
})
export class GraphComponent implements OnInit {
  data: any;
  options: any;
  studentId: string = '';
  departmentId: string = '';
  apiUrl = 'http://localhost:3000/attendanceList/';
  attendanceList: any[] = [];
  deptOptionsList: any[] = [];
  deptCodeOptionsList: any[] = [];
  deptOptionsListFilter: any[] = [];

  isStudentLogged = localStorage.getItem('student');


  studentActive = localStorage.getItem('studentId');

  constructor(private http: HttpClient, 
    private cd: ChangeDetectorRef,
  private confirmService: ConfirmationService,
private messageService: MessageService,
private router: Router
) { }

  ngOnInit() {
    this.fetchAttendanceData();
    console.log(this.isStudentLogged);
    // console.log(this.studentActive);
  }

  fetchAttendanceData() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (response) => {
        if (!response || response.length === 0) {
          console.warn('No data received from API.');
          return;
        }

        this.attendanceList = response;

        // Extract unique student and department combinations
        const uniqueEntries = this.attendanceList.filter(item => ({
          studentId: item.studentId
        }));

        const deptCodeUniqueValues = this.attendanceList.map(item => ({
          departmentId: item.departmentId
        }))


        if (this.isStudentLogged !== null) {
          this.deptOptionsList = uniqueEntries.filter((obj, index, self) => index === self.findIndex(t => t.studentId === this.studentActive))
          this.deptCodeOptionsList = uniqueEntries.filter((obj, index, self) => index === self.findIndex(t => t.studentId === this.studentActive))
          this.studentId = this.studentActive
        } else {
          this.deptCodeOptionsList = deptCodeUniqueValues.filter(
            (item, index, self) =>
              index === self.findIndex(t => t.departmentId === item.departmentId)
          );
          // Remove duplicate studentId-departmentId pairs
          this.deptOptionsList = uniqueEntries.filter(
            (item, index, self) =>
              index === self.findIndex(t => t.studentId === item.studentId)
          );

          this.deptOptionsListFilter = [...this.deptOptionsList]

        }

        if (this.deptOptionsList.length > 0) {
          this.studentId = this.deptOptionsList[0].studentId;
          this.departmentId = this.deptOptionsList[0].departmentId;
          this.deptOptionsListFilter = this.deptOptionsList.filter((item) => item.departmentId === this.departmentId);
        }

        /*      if (this.deptCodeOptionsList.length > 0) {
                this.departmentId = this.deptCodeOptionsList[0].departmentId;
               
              }*/

        this.updateChartData();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  updateChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    // Define month sorting order
    const monthOrder = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    // Filter attendance data based on selected student and department
    const studentAttendance = this.attendanceList.filter(a => a.studentId === this.studentId && a.departmentId === this.departmentId);

    // Sort months based on predefined order
    const sortedAttendance = studentAttendance.sort((a, b) => {
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    const months = sortedAttendance.map(a => a.month);
    const attendanceCounts = sortedAttendance.map(a => +a.attendanceCount);

    this.data = {
      labels: months, //  months will be displayed in order
      datasets: [{
        label: 'Attendance Count',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: attendanceCounts,
        borderRadius: 50
      }]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { display: true, labels: { color: textColor } }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: true }
        },
        y: {
          min: 5,
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false }
        }
      }
    };

    this.cd.markForCheck();
  }

  onStudentChange(value) {
    this.studentId = value;
    this.updateChartData();
    console.log(this.studentId);
  }

  onDepartmentChange(value) {
    this.departmentId = value;
    //  console.log(this.departmentId);
    this.deptOptionsListFilter = this.deptOptionsList.filter((item) => item.departmentId === value);
    this.studentId = this.deptOptionsListFilter[0].studentId;
    this.updateChartData();
  }


 /* canDeactivate(): any{
    console.log("canExit from student");
  return this.confirmService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      target: event?.target as EventTarget,
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Yes'
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have logged out', life: 1000 });
        localStorage.clear();
        this.router.navigate(['']).then(() => window.location.reload());
        console.log("logout");
      },
      reject: () => {
       return this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Logout cancelled', life: 1000 });
      }
    });
 }*/


   canDeactivate(): Promise<boolean> {
    console.log("Existd")
     const result$ = new Subject<boolean>();
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
            // console.log(this.router.url);
         // console.log("isUserr",localStorage.getItem('isUserLoggedout'));
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
