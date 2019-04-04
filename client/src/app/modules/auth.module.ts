import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';
import { LoginComponent } from '../components/login/login.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from '../components/register/register.component';
import { AuthService } from '../services/auth.service';


@NgModule({
  declarations: [
    AuthTabsComponent, 
    LoginComponent, 
    RegisterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  exports: [
    AuthTabsComponent, 
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
