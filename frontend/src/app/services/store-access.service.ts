import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AccessWithUser } from '../models/accessWithUser';

@Injectable({
  providedIn: 'root'
})
export class StoreAccessService {
  private API_URL = `${environment.apiUrl}/api/store_access`;
  

  constructor(private http: HttpClient) {}

  // 🔍 1. Récupérer tous les utilisateurs ayant accès à un magasin
    getAccessByStore(storeId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/store/${storeId}`);
    }

 // ✏️ Met à jour le rôle d’un accès (admin / chef_admin)
  updateRole(accessId: string, newRole: 'admin' | 'chef_admin'): Observable<AccessWithUser> {
    const body = { role_in_store: newRole };

    return this.http.put<AccessWithUser>(`${this.API_URL}/${accessId}`, body);
  }
  // 🗑️ 3. Supprimer l’accès d’un utilisateur à un magasin
  removeAccess(accessId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${accessId}`);
  }

  checkAccess(storeId: string): Observable<boolean> {
    return this.http.get<{ access: boolean }>(`${this.API_URL}/has-access/${storeId}`).pipe(
        map(response => response.access),
        catchError(() => of(false)), // Si erreur → pas d’accès
    );
  }
}
