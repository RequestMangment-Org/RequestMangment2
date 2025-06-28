import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterOutlet,NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });

}
 isAboutRoute(): boolean {
    return this.currentRoute === '/' || this.currentRoute === '/about';
  }

isUserLoggedIn(): boolean {
    return !!localStorage.getItem('user'); 
  }

}
