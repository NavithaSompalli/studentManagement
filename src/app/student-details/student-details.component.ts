import { Component, Input, AfterViewChecked, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css',
  standalone: false,
})
export class StudentDetailsComponent implements AfterViewChecked, OnInit, OnChanges {
  studentActive: boolean = false;
  studentData = JSON.parse(localStorage.getItem('student'));
  @ViewChild('dialogForm') detailsForm: NgForm;
  @Input() studentDetailsObject: any; // Data received from parent
  @Input() isViewDetailsActive: boolean = false; // Dialog visibility state
  isUpdateActive: boolean = true;
  imageUrl: string = ""
  @Output() messageEvent1 = new EventEmitter();

  storedStudentData: any = {
    id: 'ITO2025' + `${Math.floor(Math.random() * 90) + 10}`,
    firstname: '',
    lastname: '',
    dob: '',
    email: '',
    phoneNumber: '',
    selectedCity: { code: "+91", country: "India" },
    selectedCategory: { name: 'Female', key: 'F' },
    image: '',
    modifiedResource: 'Admin',
    modifiedSourceType: 'Admin',
    modifiedDttm: '',
    createdDttm: '',
    createdSourceType: 'Admin',
    createdSource: 'Admin',
    dateOfJoining: ''

  };
  // Separate object for rendering
  constructor(private service: LoginServiceService,
    private messageService: MessageService,
    private Router: Router
  ) { }

  ngOnInit() {
    this.isUpdateActive = false;
    if (this.studentData) {
      this.studentActive = false;
    } else {
      this.studentActive = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    /* if (changes['studentDetailsObject']) { // it will return true when object changed
      this.storedStudentData = { ...changes['studentDetailsObject'].currentValue }; // The spread operator { ... } creates a copy of the studentDetailsObject, ensuring immutability.
      this.storedStudentData['gender'] = this.storedStudentData?.selectedCategory?.name
    }*/

    //console.log(this.studentDetailsObject);

    this.storedStudentData = { ...this.studentDetailsObject };
   // console.log(this.storedStudentData);


    /* this.storedStudentData = this.studentDetailsObject; // if we assign the object directly, when ever the changes will happpen in studentDetailsObject that changes will trigger in the storedDataObject
      this.storedStudentData['gender'] = this.storedStudentData?.selectedCategory?.name*/

  }

  ngAfterViewChecked() {
    // Ensure UI renders storedStudentData instead of modifying Input directly
    this.storedStudentData = { ...this.storedStudentData };
  }

  OnEditOption() {
    this.isUpdateActive = true;
    this.isViewDetailsActive = false;
  }

  OnUpdateOption(id: string) {
    this.storedStudentData["selectedCategory"] = { name: this.storedStudentData.gender, key: this.storedStudentData.gender[0] }
    this.isUpdateActive = !this.isUpdateActive;
    this.service.updateStudent(id, this.storedStudentData).subscribe(
      response => {
        this.messageService.add({ severity: 'success', detail: 'Updated successfully', life: 3000 });
        this.messageEvent1.emit();
        this.detailsForm.resetForm();
      },
      error => {
        this.messageService.add({ severity: 'warn', detail: 'Failed to update student. Please try again.', life: 3000 });
      }
    );
  }

  onBackClick() {
    this.isUpdateActive = false;
  }

  openUploadDialog() {
    document.getElementById('fileInput')?.click();
    //console.log("opendialog");
  }
// handle uploading photo
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.storedStudentData.image = this.imageUrl; // Ensure this is inside the onload function
      };
      reader.readAsDataURL(file);
    }
  }

}
