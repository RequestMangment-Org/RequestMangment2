import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';

// PrimeNG Modules
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { AboutUsService } from '../../Service/about-us.service';

@Component({
  selector: 'app-about-us-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    FileUploadModule,
    ButtonModule
  ],
  templateUrl: './about-us-form.component.html',
  styleUrls: ['./about-us-form.component.css'],
  providers: [
    MessageService,
    provideAnimations() 
  ]
})
export class AboutUsFormComponent implements OnInit {
  aboutUs: any = {
    id: 0,
    titileAr: '',
    titileEn: '',
    descriptionAr: '',
    descriptionEn: '',
    filePath: '',
    file: null 
  };
  isEditMode = false;
  loading = false;

  constructor(
    private aboutUsService: AboutUsService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadAboutUs(id);
    }
  }

  loadAboutUs(id: number): void {
    this.loading = true;
    this.aboutUsService.getById(id).subscribe({
      next: (data) => {
        this.aboutUs = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load data'});
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    
    if (this.aboutUs.file) {
      this.uploadFileAndSave();
    } else {
      this.saveAboutUs();
    }
  }

  private uploadFileAndSave(): void {
    this.aboutUsService.uploadVideo(this.aboutUs.file).subscribe({
      next: (uploadResponse) => {
        this.aboutUs.filePath = uploadResponse.videoFilePath;
        this.saveAboutUs();
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to upload file'});
        this.loading = false;
      }
    });
  }

  private saveAboutUs(): void {
    const operation = this.isEditMode 
      ? this.aboutUsService.update(this.aboutUs.id, this.aboutUs)
      : this.aboutUsService.create(this.aboutUs);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Item ${this.isEditMode ? 'updated' : 'created'} successfully`
        });
        this.router.navigate(['/admin/about-us']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.isEditMode ? 'update' : 'create'} item`
        });
      },
      complete: () => this.loading = false
    });
  }

  onFileUpload(event: any): void {
    if (event.files && event.files.length > 0) {
      this.aboutUs.file = event.files[0];
      this.messageService.add({
        severity: 'info',
        summary: 'File Selected',
        detail: 'File ready for upload'
      });
    }
  }
}