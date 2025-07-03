// super-admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const superAdminGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser(); // ou localStorage selon ton service
  if (user?.role === 'super_admin') {
    return true;
  }

  return router.createUrlTree(['/home']);
};
