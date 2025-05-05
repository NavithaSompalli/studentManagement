import { NgModule } from "@angular/core";


import { AppComponent } from "./app.component";
//import { SignUpComponent } from "./sign-up/sign-up.component";
import { HomeComponent } from "./home/home.component";
import {HeaderComponent} from './header/header.component';
import { AdminComponent } from "./admin/admin.component";
import { StudentComponent } from "./student/student.component";
import { GraphComponent } from "./graph/graph.component";
import { FooterComponent } from "./footer/footer.component";
import { FormModalComponent } from "./form-modal/form-modal.component";
import { StudentDetailsComponent } from "./student-details/student-details.component";
import {DepartmentComponent} from "./department/department.component";
import { AttendanceComponent } from "./attendence/attendence.component";
import { DepartmentDetailsComponent } from "./department-details/department-details.component";


import { BrowserModule } from "@angular/platform-browser";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {FormsModule} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { Dialog } from 'primeng/dialog';
import {HttpClientModule} from '@angular/common/http';
import { LoginComponent } from "./login/login.component";
import { LoginServiceService } from "./login-service.service";
import { MessageService } from 'primeng/api'; // toast modules
import { ConfirmationService } from 'primeng/api';
import { ChartDataService } from "./chart-data.service";

import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { RouterModule } from "@angular/router"; 
import { Routes } from "@angular/router";


import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from "@angular/common";
import { TableModule } from 'primeng/table';

import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RadioButton } from 'primeng/radiobutton';

import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmDialog } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';
import { ChartModule } from 'primeng/chart';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown'


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, 
    children: [
      { path: 'student', component: StudentComponent },
      { path: 'department', component: DepartmentComponent },
      {path:'graph', component: GraphComponent},
      {path:'attendance', component: AttendanceComponent}
    ] 
  },
  { path: 'admin', component: AdminComponent }
];
@NgModule({
    declarations:[DepartmentComponent,
      StudentDetailsComponent,
      FormModalComponent,
      FooterComponent,
      AppComponent,
      LoginComponent,
      HomeComponent,
      HeaderComponent,
      AdminComponent,
      StudentComponent,
      GraphComponent,
      AttendanceComponent,
      DepartmentDetailsComponent
    ],
    imports:[
      DropdownModule,
      AutoCompleteModule,
      ChartModule,
      TextareaModule,
      ConfirmDialog,
      ConfirmDialogModule,
      Select,
      InputNumberModule,
      RadioButton,
      RadioButtonModule,
      DatePickerModule,
      TableModule,
      CommonModule,
      MenubarModule,
      RouterModule.forRoot(routes),
      Toast,
      Ripple,
      BrowserModule,
      ButtonModule,
      ButtonModule,
      CardModule,
      FormsModule,
      PasswordModule,
      InputTextModule,
      DialogModule,
      Dialog,
      HttpClientModule],
    bootstrap:[AppComponent],
    providers:[ChartDataService,
      provideAnimationsAsync(),providePrimeNG({theme :{preset :Aura}}), 
      LoginServiceService,
      MessageService,
      ConfirmationService],
    exports:[RouterModule]
})

export class AppModule{}