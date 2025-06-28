import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environments';

export interface AboutUs {
  id: number;
  titileAr: string;
  titileEn: string;
  descriptionAr: string;
  descriptionEn: string;
  filePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(): Observable<AboutUs[]> {
    return this.http.get<AboutUs[]>(this.apiUrl + '/AboutUs');
  }

  getById(id: number): Observable<AboutUs> {
    return this.http.get<AboutUs>(`${this.apiUrl + '/AboutUs'}/${id}`);
  }

  create(aboutUs: AboutUs): Observable<AboutUs> {
    return this.http.post<AboutUs>(this.apiUrl + '/AboutUs', aboutUs);
  }

  update(id: number, aboutUs: AboutUs): Observable<any> {
    return this.http.put(`${this.apiUrl + '/AboutUs'}/${id}`, aboutUs);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl + '/AboutUs'}/${id}`);
  }




  uploadVideo(videoFile: File | null): Observable<{ videoFilePath?: string | null }> {
    const formData = new FormData();

    if (videoFile) {
      // Validate file type if needed
      const validExtensions = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
      if (!validExtensions.includes(videoFile.type)) {
        return throwError(() => new Error('Invalid file type. Only video files are allowed.'));
      }
      const maxSize = 100 * 1024 * 1024;
      if (videoFile.size > maxSize) {
        return throwError(() => new Error('File size exceeds the 100MB limit.'));
      }

      formData.append('videoFile', videoFile, videoFile.name);
    }

    return this.http.post<{ videoFilePath?: string | null }>(
      `${this.apiUrl}/UploadFiles/UploadVideo`,
      formData
    );
  }
}