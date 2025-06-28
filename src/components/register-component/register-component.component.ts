import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../../Service/registration.service';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule],
  templateUrl: './register-component.component.html',
  styleUrl: './register-component.component.css'
})
export class RegisterComponentComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: RegistrationService
  ) {
    this.loginForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^05[0-9]{8}$')]]
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.isLoading = true;

    if (this.loginForm.valid) {
      this.registrationService.registerUser(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response.user));

          // تمرير fullName و phoneNumber إلى RequestComponent
          const navigationExtras = {
            state: {
              fullName: this.loginForm.get('fullName')?.value,
              phoneNumber: this.loginForm.get('phoneNumber')?.value
            }
          };

          if (response.isNewUser) {
            this.router.navigate(['/request-order'], navigationExtras);
          } else {
            this.router.navigate(['/request-order'], navigationExtras);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'يرجى إدخال بيانات صحيحة (الاسم الكامل ورقم الجوال مطلوبان).';
    }
  }
}
