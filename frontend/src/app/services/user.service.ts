import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  private API = `${environment.apiUrl}/api/users`; // adapte si besoin

  constructor(private http: HttpClient) {}

     searchUsers(filters: { name?: string; lastname?: string; email?: string }): Observable<User[]> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value?.trim()) {
        params = params.set(key, value.trim());
      }
    });

    return this.http.get<User[]>(`${this.API}/search`, { params });
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.API}/${userId}`, { role });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.API}/${userId}`);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API}/${userId}`);
  }
  getAllUsers() {
    return this.http.get<User[]>(`${this.API}`);
    }
}
