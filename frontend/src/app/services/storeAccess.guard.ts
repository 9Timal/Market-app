import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { StoreAccessService } from './store-access.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


export const StoreAccessGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
    
    const router = inject(Router) ;
    const storeAccessService= inject(StoreAccessService) ;
  
    const token = localStorage.getItem('auth_token');
    const storeData = localStorage.getItem('selected_store');
    const userData = localStorage.getItem('user');

    if (!token || !storeData|| !userData) {
      return of(router.parseUrl('/login'));
    }

    try {
      const decoded: any = jwtDecode(token);
      const storeObj = JSON.parse(storeData);
      const storeId = storeObj._id;
     
      if (decoded.role === 'super_admin') {
        return of(true);
      }

    return storeAccessService.checkAccess(storeId).pipe(
        map((hasAccess) => hasAccess ? true : router.parseUrl('/login')),
        catchError((err) => {
            console.error('Erreur dans checkAccess :', err);
            return of(router.parseUrl('/login'));
        })
    );

    } catch (err) {
        console.error('Erreur de décodage du token', err);
        return of(router.parseUrl('/login'));
    }
  
}
