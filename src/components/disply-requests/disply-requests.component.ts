import { Component, OnInit } from '@angular/core';
import { ApplicationRequest } from '../../Interfaces/ApplicationRequest';
import { RequestServiceService } from '../../Service/RequestService/request-service.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-disply-requests',
  imports: [NgFor, NgIf, FormsModule, TableModule, ProgressSpinnerModule,CardModule,
    MessageModule,
      ToastModule,
      ButtonModule,
      ConfirmDialogModule,
      ToolbarModule],
  templateUrl: './disply-requests.component.html',
  styleUrl: './disply-requests.component.css',
  providers: [DatePipe]
})
export class DisplyRequestsComponent implements OnInit {
  requests: ApplicationRequest[] = [];
  filteredRequests: ApplicationRequest[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchTerm: string = '';
  headers = [
    '#', 'الاسم', 'رقم الهاتف', 'تاريخ الميلاد', 
    'عضو في نادي', 'اسم النادي', 'تأشيرة شنغن',
    'ملف التأشيرة', 'موافقة ولي الأمر', 'ملف الموافقة',
    'تاريخ التقديم'
  ];

  constructor(
    private requestService: RequestServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.requestService.getAllRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.filteredRequests = requests;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'فشل تحميل الطلبات: ' + (error.error?.message || 'حاول مرة أخرى');
      }
    });
  }

  filterRequests(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRequests = this.requests;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredRequests = this.requests.filter(request =>
      (request.fullName?.toLowerCase().includes(searchLower) || false) ||
      (request.phoneNumber?.toLowerCase().includes(searchLower) || false) ||
      (request.clubName?.toLowerCase().includes(searchLower) || false)
    );
  }

  formatDate(date: Date | undefined | null): string {
    if (!date) return '-';
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '-';
  }

  isImage(filePath: string | null): boolean {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.jpg') || 
           filePath.toLowerCase().endsWith('.jpeg') ||
           filePath.toLowerCase().endsWith('.png') ||
           filePath.toLowerCase().endsWith('.gif');
  }

  isPdf(filePath: string | null): boolean {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.pdf');
  }

  openInNewTab(url: string) {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  }

  deleteRequest(id: number | undefined, index: number): void {
    if (id === undefined) {
      this.errorMessage = 'لا يمكن حذف الطلب: معرف الطلب غير موجود';
      return;
    }

    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      this.isLoading = true;
      this.requestService.deleteRequest(id).subscribe({
        next: () => {
          this.requests = this.requests.filter(request => request.id !== id);
          this.filteredRequests = this.filteredRequests.filter(request => request.id !== id);
          this.isLoading = false;
          this.errorMessage = null;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'فشل حذف الطلب: ' + (error.error?.message || 'حاول مرة أخرى');
        }
      });
    }
  }
}