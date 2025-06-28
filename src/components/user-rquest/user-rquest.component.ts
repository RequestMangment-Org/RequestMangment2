import { Component, OnInit } from '@angular/core';
import { ApplicationRequest } from '../../Interfaces/ApplicationRequest';
import { RequestServiceService } from '../../Service/RequestService/request-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-rquest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-rquest.component.html',
  styleUrl: './user-rquest.component.css',
  providers: [DatePipe]

})

export class UserRquestComponent implements OnInit {
  headers = [
    '#', 'الاسم الكامل', 'رقم الهاتف', 'تاريخ الميلاد', 
    'عضو في نادي', 'اسم النادي', 'يوجد تأشيرة شنغن',
    'ملف التأشيرة', 'موافقة ولي الأمر', 'ملف الموافقة',
    'تاريخ التقديم', 'إجراءات'
  ];
  
  requests: ApplicationRequest[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private requestService: RequestServiceService, private datePipe: DatePipe) {}

  ngOnInit() {
    
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.requestService.getAllRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء جلب البيانات';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  formatDate(date: Date | undefined | null): string {
    if (!date) return '-';
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '-';
  }

  isPdf(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.pdf');
  }

  isImage(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }

  openInNewTab(url: string) {
    window.open(url, '_blank');
  }

    
  }