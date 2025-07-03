// src/app/pages/login/login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserLoginDTO } from '../../DTO/user-login.dto';
import { Router } from '@angular/router';
import { LoginResponse } from '../../models/login-response.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['../register/register.component.scss']

})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      
    });
  }

  

  errorMessage: string = '';


 onSubmit() {
  if (this.loginForm.invalid) return;

  const dto: UserLoginDTO = this.loginForm.value;

  this.authService.login(dto).subscribe({
    next: (response: LoginResponse) => {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.router.navigate(['/home']);
    },
    error: (error) => {
      if (error.status === 400) {
        // Tu forces le message clair
        this.errorMessage = 'Email ou mot de passe incorrect.';
      } else {
        this.errorMessage = 'Une erreur inconnue est survenue.';
      }
    
    }

  });
}

}
