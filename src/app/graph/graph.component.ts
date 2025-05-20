import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';

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
  deptCodeOptionsList:any[] = [];
  deptOptionsListFilter:any[] = [];

  isStudentLogged = localStorage.getItem('student');
 
  studentActive = localStorage.getItem('studentId');
  
  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchAttendanceData();
  //  console.log(this.isStudentLogged);
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

        const deptCodeUniqueValues = this.attendanceList.map(item =>({
          departmentId: item.departmentId
        }))
       
     
        if(this.isStudentLogged !== null){
          this.deptOptionsList = uniqueEntries.filter((obj,index,self) => index === self.findIndex(t =>t.studentId === this.studentActive))
          this.deptCodeOptionsList = uniqueEntries.filter((obj,index,self)=>index === self.findIndex(t => t.studentId === this.studentActive))
        }else{
            this.deptCodeOptionsList =  deptCodeUniqueValues.filter(
              (item, index, self) =>
              index === self.findIndex(t => t.departmentId === item.departmentId )
            );
            // Remove duplicate studentId-departmentId pairs
            this.deptOptionsList = uniqueEntries.filter(
              (item, index, self) =>
                index === self.findIndex(t => t.studentId === item.studentId )
            );

            this.deptOptionsListFilter = [...this.deptOptionsList]
        }
        
        if (this.deptOptionsList.length > 0) {
          this.studentId = this.deptOptionsList[0].studentId;
          this.departmentId = this.deptOptionsList[0].departmentId;
        }

        if (this.deptCodeOptionsList.length > 0) {
          this.departmentId = this.deptCodeOptionsList[0].departmentId;
        }

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

    // Filter attendance data based on selected student and department
    const studentAttendance = this.attendanceList.filter(a => a.studentId === this.studentId && a.departmentId === this.departmentId);
    const months = studentAttendance.map(a => a.month);
    const attendanceCounts = studentAttendance.map(a => +a.attendanceCount);

    this.data = {
      labels: months,
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
    console.log(this.departmentId);
      
    this.deptOptionsListFilter = this.deptOptionsList.filter((item) => item.departmentId === value);
    this.studentId = this.deptOptionsListFilter[0].studentId;
    this.updateChartData();
  }
}
