import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  departmentList = [
    {
      departmentId: "CSE001", departmentName:"Computer Science", noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    },
    {
      departmentId: "ECE002", departmentName:"Electronics and Communication Engineering", noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    },
    {
      departmentId:"CIVIL003", departmentName:"Civil Engineering",noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    },
    {
      departmentId: "EE004", departmentName: 'Electrical Engineering',noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    },
    {
      departmentId: "ME005", departmentName:'Mechanical Engineering', noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    },
    {
      departmentId: "CH006", departmentName:'Chemical Engineering',noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    },
    {
      departmentId:'AE007', departmentName:'Automobile Engineering',noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    },
    {
      departmentId: 'AIML008', departmentName:'Artificial Intelligence and Machine Learning', noOfStudents:'20', createdSource:'Admin', createdSourceType:'Admin', createdDttm: new Date(), modifiedSource: 'Admin', modifiedSourceType: 'Admin', modifiedDttm: new Date()
    }
  ]

}
