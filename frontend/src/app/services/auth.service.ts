import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthCheckResponse } from '../models/auth-check';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlAuth = `${environment.apiUrl}/api/auth`; 

  constructor(
    private http: HttpClient,
    private router :Router
  ) {}

  checkToken(): Observable<AuthCheckResponse> {
    return this.http.get<AuthCheckResponse>(`${this.apiUrlAuth}/check`);
  }

   logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Si tu stockes d'autres choses, supprime-les ici aussi
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
