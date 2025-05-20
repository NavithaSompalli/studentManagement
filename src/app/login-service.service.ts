import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private apiUrl = 'http://localhost:3000/users';
  studentId: string = '';

  date: Date = new Date();
  dateFormat: string = `${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()} ${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`;
  imageUrl!: string;

  user = {
    id: `ITO2025${Math.floor(Math.random() * 90) + 10}`,
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    phoneNumber: '',
    selectedCity: { code: "+91", country: "India" },
    selectedCategory: '',
    image: this.imageUrl,
    modifiedResource: 'Admin',
    modifiedSourceType: 'Admin',
    modifiedDttm: this.dateFormat,
    createdDttm: this.dateFormat,
    createdSourceType: 'Admin',
    createdSource: 'Admin',
    dateOfJoining: ''
  };

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
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  getUser(username: string, password: string, id: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map(users => {
        const user = users.find(u => u.id === id);
        return user ? user : [null, user];  
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Error fetching user:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  checkUserCredentialsOccured(username: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}`).pipe(
      map((users) => users.length === 0 ? [true, users] : false),
      catchError((error: HttpErrorResponse) => {
        console.error("Error checking credentials:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  getUserDetails(id: string): Observable<any> {
    return this.http.get<any[]>(`http://localhost:3000/users?id=${id}`).pipe(
      map((users) => users.length !== 0 ? users : false),
      catchError((error: HttpErrorResponse) => {
        console.error("Error fetching user details:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  getStudentDetails(): Observable<any> {
    return this.http.get('http://localhost:3000/studentList').pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error fetching student details:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  deleteStudentDetails(id: any): Observable<any> {
    return this.http.delete(`http://localhost:3000/studentList/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error deleting student details:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  findStudent(id: string): Observable<any> {
    return this.http.get<any[]>(`http://localhost:3000/studentList?id=${id}`).pipe(
      map((users) => users.length !== 0 ? users : false),
      catchError((error: HttpErrorResponse) => {
        console.error("Error finding student:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  updateStudent(studentId: string, studentData: any): Observable<any> {
    return this.http.put(`http://localhost:3000/studentList/${studentId}`, studentData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error updating student:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  addAttendanceStudentDetails(obj: any): Observable<any> {
    return this.http.post('http://localhost:3000/attendanceList', obj).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error adding attendance details:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  getAttendanceDetails(): Observable<any> {
    return this.http.get('http://localhost:3000/attendanceList').pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error fetching attendance details:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  deleteAttendanceDetails(id: any): Observable<any> {
    return this.http.delete(`http://localhost:3000/attendanceList/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error deleting attendance details:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  updateStudentAttendance(studentId: string, studentData: any): Observable<any> {
    return this.http.put(`http://localhost:3000/attendanceList/${studentId}`, studentData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error updating student attendance:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  getAttendanceDetailsID(studentId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/attendanceList/${studentId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error fetching attendance details by ID:", error);
        return throwError(() => new Error(error.message));
      })
    );
  }
}
