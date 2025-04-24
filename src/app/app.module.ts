import { NgModule } from "@angular/core";


import { AppComponent } from "./app.component";
import { SignUpComponent } from "./sign-up/sign-up.component";


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
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple'; 

@NgModule({
    declarations:[AppComponent,LoginComponent,SignUpComponent],
    imports:[Toast,Ripple,BrowserModule,ButtonModule,ButtonModule,CardModule,FormsModule,PasswordModule,InputTextModule,DialogModule,Dialog,HttpClientModule],
    bootstrap:[AppComponent],
    providers:[provideAnimationsAsync(),providePrimeNG({theme :{preset :Aura}}), LoginServiceService,MessageService]
})

export class AppModule{}