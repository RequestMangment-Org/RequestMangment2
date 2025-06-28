import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationRequest } from '../../Interfaces/ApplicationRequest';


@Injectable({
  providedIn: 'root'
})
export class RequestServiceService {
  private apiUrl = 'https://localhost:7272';

  constructor(private http: HttpClient) {}

  
  UploadFiles(visaFile: File | null, approvalFile: File | null): Observable<{ visaFilePath?: string | null, approvalFilePath?: string | null }> {
    const formData = new FormData();
    if (visaFile) {
      formData.append('visaFile', visaFile, visaFile.name);
    }
    if (approvalFile) {
      formData.append('approvalFile', approvalFile, approvalFile.name);
    }

    return this.http.post<{ visaFilePath?: string | null, approvalFilePath?: string | null }>(
      `${this.apiUrl}/api/UploadFiles`,
      formData
    );
  }

  submitRequest(request: ApplicationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Requests`, request);
  }
  
  getAllRequests(): Observable<ApplicationRequest[]> {
    return this.http.get<ApplicationRequest[]>(`${this.apiUrl}/api/requests`);
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/requests/${id}`);
  }
    getRequestByPhone(phoneNumber: string): Observable<ApplicationRequest> {
    return this.http.get<ApplicationRequest>(`${this.apiUrl}/api/requests/by-phone/${phoneNumber}`);
  }
  
updateRequest(id: number, request: ApplicationRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/requests/${id}`, request);
}
}