import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { invitation } from '../models/invitation.model';
import { Subject, Observable, tap } from 'rxjs';
import { Myinvitation } from '../models/MyInvitation';

@Injectable({
  providedIn: 'root'
})
export class StoreInviteService {
  private API_URL = `${environment.apiUrl}/api/store-invite`;

  private _refreshInvites$ = new Subject<void>(); // 🔁 canal privé

    // 🔓 observable public pour s'abonner depuis le composant
    get refreshInvites$(): Observable<void> {
        return this._refreshInvites$.asObservable();
    }


  constructor(private http: HttpClient) {}

  // ➕ Créer une invitation
  createInvitation(storeId: string, email: string, role: 'admin' | 'chef_admin'): Observable<any> {
    return this.http.post(this.API_URL, { store_id: storeId, email, role })
        .pipe(tap(() => this._refreshInvites$.next()));; // 🔔 Signale qu'on doit rafraîchir
  }

  // 📥 Récupérer toutes les invitations pour un magasin
  getInvitationsByStore(storeId: string): Observable<invitation[]> {
    return this.http.get<invitation[]>(`${this.API_URL}/store/${storeId}`);
  }

  //Récupérer les invitations de l'utilisateurs
  getMyInvitation():Observable<Myinvitation[]>{
    return this.http.get<Myinvitation[]>(`${this.API_URL}/me`);
  }

  // ❌ Supprimer une invitation
  deleteInvitation(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // ✅ Accepter une invitation
  acceptInvitation(id: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/accept`, {})
       .pipe(tap(() => this._refreshInvites$.next()))
  }

  // ❌ Refuser une invitation
  refuseInvitation(id: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/refuse`, {})
       .pipe(tap(() => this._refreshInvites$.next()))
  }
}
