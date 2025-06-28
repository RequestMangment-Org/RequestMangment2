import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
userData = JSON.parse(localStorage.getItem('user') || '{}');
  constructor(private router: Router) {
    this.loadInitialState();
   
  }

  private loadInitialState() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  handleLogin(response: any) {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    
    return !!this.token && this.userData?.usertype === 1;
  }
}
