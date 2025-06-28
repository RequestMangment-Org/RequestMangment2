import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RequestServiceService } from '../../Service/RequestService/request-service.service';
import { ApplicationRequest } from '../../Interfaces/ApplicationRequest';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
  providers: [DatePipe]
})
export class RequestComponent implements OnInit {
  requestForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  visaFile: File | null = null;
  approvalFile: File | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode = false;
  currentRequestId: number | null = null;
  visaFilePath: string | null = null;
  approvalFilePath: string | null = null;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestServiceService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^05[0-9]{8}$')]],
      birthDate: ['', [Validators.required, this.pastDateValidator(), this.maxAgeValidator(100)]],
      isInClub: [false],
      clubName: ['', [Validators.maxLength(100)]],
      hasSchengenVisa: [false],
      visaFile: [null],
      hasParentApproval: [false],
      approvalFile: [null]
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.fullName && user.phoneNumber) {
          this.requestForm.patchValue({
            fullName: user.fullName,
            phoneNumber: user.phoneNumber
          });
          if (user.phoneNumber) {
            this.loadExistingRequest(user.phoneNumber);
          }
        } else {
          console.warn('Invalid user data in localStorage');
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    this.OnSelectionChange();
    this.updateFileValidation();
  }

  private loadExistingRequest(phoneNumber: string): void {
    this.isLoading = true;
    this.requestService.getRequestByPhone(phoneNumber).subscribe({
      next: (request) => {
        this.isEditMode = true;
        this.currentRequestId = request.id ?? null;
        this.populateForm(request);
        this.updateFileValidation();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private populateForm(request: ApplicationRequest): void {
    this.requestForm.patchValue({
      fullName: request.fullName,
      phoneNumber: request.phoneNumber,
      birthDate: this.formatDate(request.birthDate),
      isInClub: request.isInClub,
      clubName: request.clubName || '',
      hasSchengenVisa: request.hasSchengenVisa,
      hasParentApproval: request.hasParentApproval
    });
    this.visaFilePath = request.visaFilePath ?? null;
    this.approvalFilePath = request.approvalFilePath ?? null;
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private updateFileValidation(): void {
    const visaFileControl = this.requestForm.get('visaFile');
    const approvalFileControl = this.requestForm.get('approvalFile');

    if (this.requestForm.get('hasSchengenVisa')?.value) {
      if (this.isEditMode && this.visaFilePath) {
        visaFileControl?.clearValidators();
      } else {
        visaFileControl?.setValidators([Validators.required]);
      }
    } else {
      visaFileControl?.clearValidators();
    }
    visaFileControl?.updateValueAndValidity();

    if (this.requestForm.get('hasParentApproval')?.value) {
      if (this.isEditMode && this.approvalFilePath) {
        approvalFileControl?.clearValidators();
      } else {
        approvalFileControl?.setValidators([Validators.required]);
      }
    } else {
      approvalFileControl?.clearValidators();
    }
    approvalFileControl?.updateValueAndValidity();
  }

  OnSelectionChange() {
    this.requestForm.get('isInClub')?.valueChanges.subscribe((isInClub) => {
      const clubNameControl = this.requestForm.get('clubName');
      if (isInClub) {
        clubNameControl?.setValidators([Validators.required]);
      } else {
        clubNameControl?.clearValidators();
        clubNameControl?.setValue(null);
      }
      clubNameControl?.updateValueAndValidity();
    });

    this.requestForm.get('hasSchengenVisa')?.valueChanges.subscribe((hasSchengenVisa) => {
      const visaFileControl = this.requestForm.get('visaFile');
      if (hasSchengenVisa) {
        if (!this.isEditMode || !this.visaFilePath) {
          visaFileControl?.setValidators([Validators.required]);
        } else {
          visaFileControl?.clearValidators();
        }
      } else {
        visaFileControl?.clearValidators();
        visaFileControl?.setValue(null);
        this.visaFile = null;
        this.visaFilePath = null;
      }
      visaFileControl?.updateValueAndValidity();
    });

    this.requestForm.get('hasParentApproval')?.valueChanges.subscribe((hasParentApproval) => {
      const approvalFileControl = this.requestForm.get('approvalFile');
      if (hasParentApproval) {
        if (!this.isEditMode || !this.approvalFilePath) {
          approvalFileControl?.setValidators([Validators.required]);
        } else {
          approvalFileControl?.clearValidators();
        }
      } else {
        approvalFileControl?.clearValidators();
        approvalFileControl?.setValue(null);
        this.approvalFile = null;
        this.approvalFilePath = null;
      }
      approvalFileControl?.updateValueAndValidity();
    });
  }

  pastDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      return selectedDate <= today ? null : { futureDate: true };
    };
  }

  maxAgeValidator(maxYears: number) {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      const maxDate = new Date(today.getFullYear() - maxYears, today.getMonth(), today.getDate());
      return selectedDate >= maxDate ? null : { tooOld: true };
    };
  }

  onFileChange(event: Event, field: 'visaFile' | 'approvalFile'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = `حجم ملف ${field === 'visaFile' ? 'تأشيرة الشنغن' : 'موافقة ولي الأمر'} يتجاوز 5 ميغابايت`;
        this.requestForm.get(field)?.setValue(null);
        if (field === 'visaFile') this.visaFile = null;
        else this.approvalFile = null;
        return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        this.errorMessage = `صيغة ملف ${field === 'visaFile' ? 'تأشيرة الشنغن' : 'موافقة ولي الأمر'} غير مدعومة (يجب أن تكون PDF, JPG, PNG)`;
        this.requestForm.get(field)?.setValue(null);
        if (field === 'visaFile') this.visaFile = null;
        else this.approvalFile = null;
        return;
      }
      this.requestForm.get(field)?.setValue(file);
      if (field === 'visaFile') {
        this.visaFile = file;
        this.visaFilePath = null;
      } else {
        this.approvalFile = file;
        this.approvalFilePath = null;
      }
      this.errorMessage = null;
    } else {
      this.requestForm.get(field)?.setValue(null);
      if (field === 'visaFile') {
        this.visaFile = null;
      } else {
        this.approvalFile = null;
      }
    }
    this.updateFileValidation();
  }

  onSubmit(): void {debugger
    this.isSubmitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.updateFileValidation();

    if (this.requestForm.invalid) {
      this.isLoading = false;
      console.log('Form is invalid:', this.requestForm.errors);
      return;
    }

    this.isLoading = true;

    const requestData: ApplicationRequest = {
      id: this.currentRequestId ?? undefined,
      fullName: this.requestForm.get('fullName')?.value,
      phoneNumber: this.requestForm.get('phoneNumber')?.value,
      birthDate: new Date(this.requestForm.get('birthDate')?.value),
      isInClub: this.requestForm.get('isInClub')?.value,
      clubName: this.requestForm.get('clubName')?.value || null,
      hasSchengenVisa: this.requestForm.get('hasSchengenVisa')?.value,
      hasParentApproval: this.requestForm.get('hasParentApproval')?.value,
      submissionDate: new Date(),
      visaFilePath: this.cleanFilePath(this.visaFilePath),
      approvalFilePath: this.cleanFilePath(this.approvalFilePath)
    };

    if (this.visaFile || this.approvalFile) {
      this.requestService.UploadFiles(this.visaFile, this.approvalFile).subscribe({
        next: (response) => {
          requestData.visaFilePath = this.cleanFilePath(response.visaFilePath) ?? this.cleanFilePath(this.visaFilePath);
          requestData.approvalFilePath = this.cleanFilePath(response.approvalFilePath) ?? this.cleanFilePath(this.approvalFilePath);
          this.processRequest(requestData);
        },
        error: (error) => {
          this.handleError('فشل رفع الملفات: ', error);
        }
      });
    } else {
      this.processRequest(requestData);
    }
  }

  private cleanFilePath(filePath: string | null | undefined): string | null {
    if (!filePath) return null;
    return filePath.replace(environment.url, '');
  }

  private processRequest(request: ApplicationRequest): void {
    const cleanedRequest = {
      ...request,
      visaFilePath: this.cleanFilePath(request.visaFilePath),
      approvalFilePath: this.cleanFilePath(request.approvalFilePath)
    };

    if (this.isEditMode && this.currentRequestId) {
      this.requestService.updateRequest(this.currentRequestId, cleanedRequest).subscribe({
        next: (response) => {
          this.handleSuccess('تم تحديث الطلب بنجاح!');
        },
        error: (error) => {
          this.handleError('فشل تحديث الطلب: ', error);
        }
      });
    } else {
      this.requestService.submitRequest(cleanedRequest).subscribe({
        next: (response) => {
          this.handleSuccess('تم تقديم الطلب بنجاح!');
        },
        error: (error) => {
          this.handleError('فشل تقديم الطلب: ', error);
        }
      });
    }
  }

  private handleSuccess(message: string): void {
    this.isLoading = false;
    this.successMessage = message;
    this.resetForm();
  }

  private handleError(prefix: string, error: any): void {
    this.isLoading = false;
    this.errorMessage = prefix + (error.error?.message || 'حاول مرة أخرى');
  }

  private resetForm(): void {
    this.requestForm.reset({
      isInClub: false,
      hasSchengenVisa: false,
      hasParentApproval: false
    });
    this.visaFile = null;
    this.approvalFile = null;
    this.visaFilePath = null;
    this.approvalFilePath = null;
    this.isSubmitted = false;
  }

  isImageFile(filePath: string | null): boolean {
    if (!filePath) return false;
    return filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png');
  }
}