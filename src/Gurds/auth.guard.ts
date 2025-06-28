import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../Service/auth-service.service';


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};