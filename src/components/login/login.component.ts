import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../Service/auth-service.service';
import { LoginResponse } from '../../Interfaces/login-response';
import { NgIf } from '@angular/common';
import { RegistrationService } from '../../Service/registration.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthServiceService,
    private registrationService: RegistrationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false] // تعريف حقل rememberMe بشكل صريح
    });
  }

  ngOnInit(){
    this.authService.logout();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };


    this.registrationService.dasboardLogin(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.logout();
        this.authService.handleLogin(response);
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    });
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.';
    }
  }
}