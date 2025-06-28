import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../../Service/auth-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

 constructor(private authService: AuthServiceService) {}


 logout() {
    this.authService.logout();
  }
}
