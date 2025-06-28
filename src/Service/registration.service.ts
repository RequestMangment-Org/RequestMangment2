import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { User } from '../Interfaces/user';
import { environment } from '../environments/environments';
import { LoginResponse } from '../Interfaces/login-response';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient,
        private authService: AuthServiceService
    
  ) { }
  registerUser(user: User): Observable<{ user: User, isNewUser: boolean }> {
    return this.http.post<{ user: User, isNewUser: boolean }>(this.apiUrl + '/Auth/register', user);
  }

  getUserByPhone(phoneNumber: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl + '/Auth/register'}?phone=${phoneNumber}`);
  }
  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/Auth/register');
  }

  dasboardLogin(loginData : any) {
    return this.http.post<LoginResponse>(this.apiUrl + '/Auth/login', loginData);
  }
}
