import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRegisterDTO } from '../../DTO/user-register.dto';
import { UserLoginDTO } from '../../DTO/user-login.dto';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/api/auth'; // adapte si besoin

  constructor(private http: HttpClient) {}

  register(user: UserRegisterDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, user);
  }

  login(user: UserLoginDTO): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.API_URL}/login`, user);
}

}
