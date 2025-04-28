import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private apiUrl = 'http://localhost:3000/users';

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

}
