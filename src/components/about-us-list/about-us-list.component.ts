import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { AboutUsService } from '../../Service/about-us.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-about-us-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    ToolbarModule
  ],
  templateUrl: './about-us-list.component.html',
  styleUrls: ['./about-us-list.component.css'],
  providers: [MessageService, ConfirmationService,provideNoopAnimations()]
})
export class AboutUsListComponent implements OnInit {
  aboutUsList: any[] = [];
  loading = false;

  constructor(
     private confirmationService: ConfirmationService,
    private aboutUsService: AboutUsService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadAboutUs();
  }

  loadAboutUs(): void {
    this.loading = true;
    this.aboutUsService.getAll().subscribe({
      next: (data) => {
        this.aboutUsList = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load data'});
        this.loading = false;
      }
    });
  }

deleteAboutUs(id: number): void {
  this.confirmationService.confirm({
    message: 'هل أنت متأكد من رغبتك في الحذف؟',
    header: 'تأكيد الحذف',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'نعم',       // Sets "Yes" to "نعم"
    rejectLabel: 'لا',        // Sets "No" to "لا"
    acceptButtonStyleClass: 'p-button-danger',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.aboutUsService.delete(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم حذف السجل بنجاح'
          });
          this.loadAboutUs(); // Refresh the list
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'حدث خطأ أثناء محاولة الحذف'
          });
        }
      });
    },
    reject: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'ملغى',
        detail: 'تم إلغاء عملية الحذف'
      });
    }
  });
}

  isVideo(filePath: string): boolean {
    if (!filePath) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg'];
    return videoExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }
}