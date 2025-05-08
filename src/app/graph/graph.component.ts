import { Component,PLATFORM_ID,OnInit,ChangeDetectorRef,Inject } from '@angular/core';//Inject allows dependency injection
import { HttpClient } from '@angular/common/http';
@Component({ // it marks the component is angular component
  selector: 'app-graph',//its specifies the tag, used in html to insert the other component
  templateUrl: './graph.component.html',// defining componentview(HTML Code)
  styleUrl: './graph.component.css',// it used css styling the component
  standalone:false // it tells the component is not depenedent, its depends on ngModule
})
export class GraphComponent implements OnInit{ // implements onInit: when components runs initialize logic when it loads.
    data: any;
    options: any;
    studentId: string = ''; // Default value is initially empty
    apiUrl = "http://localhost:3000/departmentList/";
    departmentList: any[] = []; // Stores fetched attendance data
    deptOptionsList: any[] = []; // Stores unique students for dropdown
  
    constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}
  
    ngOnInit() {
      this.fetchAttendanceData();
    }
  
    fetchAttendanceData() {
      this.http.get(this.apiUrl).subscribe(response => {
        if (response) {
          this.departmentList = response as any[];
  
         
          const uniqueStudentIds = [...new Set(this.departmentList.map(item => item.studentId))];

      
    this.deptOptionsList = uniqueStudentIds.map(studentId => 
        this.departmentList.find(item => item.studentId === studentId)
      );

      
      if (this.deptOptionsList.length > 0) {
        this.studentId = this.deptOptionsList[0].studentId;
      }
          
        
          this.updateChartData(); 
        }
      });
    }
  
    updateChartData() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
  
     
      const studentAttendance = this.departmentList.filter(a => a.studentId === this.studentId);
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
  
    onStudentChange(event: Event) {
      const selectedStudentId = (event.target as HTMLSelectElement).value;
      this.studentId = selectedStudentId;
      this.updateChartData(); 
    }
      
  }



