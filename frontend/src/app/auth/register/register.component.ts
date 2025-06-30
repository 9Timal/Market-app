import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRegisterDTO } from '../../DTO/user-register.dto';
import { AuthService } from '../services/auth.service'; // ou le bon chemin relatif
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  registerForm: FormGroup;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', Validators.required]
    });
  }

  private registerUser(dto: UserRegisterDTO): void {
    this.authService.register(dto).subscribe({
      next: (res: any) => {
        console.log("Inscription réussie :", res);
      },
      error: (err: any) => {
        console.error("Erreur lors de l'inscription :", err);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

      const form = this.registerForm.value;

      // Étape 1 : vérifier que les mots de passe correspondent
      if (form.password !== form.confirmPassword) {
        console.error('Les mots de passe ne correspondent pas.');
        return;
      }

      // Étape 2 : créer un objet DTO propre
      const dto: UserRegisterDTO = {
        name: form.name,
        lastname: form.lastname,
        email: form.email,
        password: form.password
      };

      // Étape 3 : appeler le service pour envoyer à l'API (on le fera après)
      console.log('Objet à envoyer à l’API :', dto);
      this.registerUser(dto);
      this.router.navigate(['/login']);

  }

}

