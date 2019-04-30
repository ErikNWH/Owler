import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;
  showSpinner = false;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private router: Router, 
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email:    ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  }

  registerUser() {
    this.showSpinner = true; 
    this.authService.registerUser(this.registerForm.value).subscribe(data => {
     this.tokenService.SetToken(data.token);
      this.registerForm.reset();
      setTimeout(() => {
        this.router.navigate(['streams']);
      }, 1000)
    }, err => {
      this.showSpinner = false; 
      if (err.error.msg) {
        this.errorMessage = err.error.msg[0].message;
      }
      if(err.error.message) {
        this.errorMessage = err.error.message;
      }
    });
  }
}


