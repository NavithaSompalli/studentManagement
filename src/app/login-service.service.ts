import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private apiUrl = 'http://localhost:3000/users';

  date = new Date();
  dateFormat = `${this.date.getDay()}-${this.date.getMonth()}-${this.date.getFullYear()} ${this.date.getHours()}:${this.date.getSeconds()} `
  imageUrl!: string;
  

  user = {
    id:'ITO2025'+`${Math.floor(Math.random() * 90)+10}`,
    firstname:'',
    lastname:'',
    dob:'',
    email:'',
    phoneNumber:'',
    selectedCity:{ code: "+91", country: "India" },
    selectedCategory:'',
    image:this.imageUrl,
    modifiedResource:'Admin',
    modifiedSourceType:'Admin',
    modifiedDttm:this.dateFormat,
    createdDttm:this.dateFormat,
    createdSourceType:'Admin',
    createdSource:'Admin',
    dateOfJoining:''
  }

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}`).pipe(
      map((users) => {
        if (users.length === 0) {
          throw new Error('User not found');
        }
        const user = users[0];
        if (user.password !== password) {
          throw new Error('Incorrect password');
        }
        return { message: 'Login successful', user };
      })
    );
  }


  getUser(username: string, password:string):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}`).pipe(
      map((users) =>{
        if(users.length === 0){
          return true
        }else{
          return false
        }
      })
    )}


    /*userData(object: Object){
      return  this.http.post('http://localhost:3000/studentList', object).subscribe({
        next: (response) => console.log('Success:', response),
        error: (error) => console.log("error", error ),
        complete: () => console.log("Student deatails add successfully")
      });
    }*/


    getStudentDetails():Observable<any>{
      return this.http.get('http://localhost:3000/studentList')
    }

    deleteStudentDetails(id):Observable<any>{
      return this.http.delete(`http://localhost:3000/studentList/${id}`);
    }


    findStudent(id){
      console.log("service", id);
      return this.http.get<any[]>(`http://localhost:3000/studentList?id=${id}`).pipe(
        map((users) =>{
        //  console.log(users);
          if(users.length !== 0){
            return users
          }else{
            return false
          }
        })
      )
    }


    updateStudent(studentId: string, studentData: any): Observable<any> {
      return this.http.put(`http://localhost:3000/studentList/${studentId}`, studentData);
      ;
    }
}
