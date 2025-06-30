import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthCheckResponse } from '../models/auth-check'; // assure-toi que ce fichier existe

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkToken().pipe(
    map((res: AuthCheckResponse) => {
      const localUser = localStorage.getItem('user');
      if (!localUser) return router.createUrlTree(['/login']);

      const parsedLocalUser = JSON.parse(localUser);
      const sameUser = res.user._id === parsedLocalUser._id;

      if (!sameUser) {
        authService.logout();
        return router.createUrlTree(['/login']);
      }

      return true;
    }),
    catchError(() => {
      authService.logout();
      return of(router.createUrlTree(['/login']));
    })
  );
};
