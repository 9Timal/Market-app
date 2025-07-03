import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserAdminRegisterDTO } from '../../../DTO/admin-user-register.dto';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-centre-user',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule],
  templateUrl: './centre-user.component.html',
  styleUrl: './centre-user.component.scss'
})
export class CentreUserComponent implements OnInit{

  showAddForm = false;

  newUser: UserAdminRegisterDTO = {
    name: '',
    lastname: '',
    password:'',
    email: '',
    role: ''
  };

  users: any[] = [];
  search = {
    name: '',
    lastname: '',
    email: ''
  };

  selectedUser: any = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private userService: AuthUserService ,
  ) {}

  
  ngOnInit(): void {}

  onAddUser(): void {
    const userToRegister: UserAdminRegisterDTO = {
      ...this.newUser,
      password: 'Azerty123.Azerty123.' // 🔐 mot de passe par défaut
    };
  

    this.authService.register(userToRegister).subscribe({
      next: (res) => {
        console.log('✅ Utilisateur enregistré', res);
        this.showAddForm = false;
        this.newUser = {
          name: '',
          lastname: '',
          email: '',
          password: '',
          role: ''
        };
        this.onSearch();
      },
      error: (err) => {
        console.error('❌ Erreur lors de l’enregistrement', err);
        alert(err?.error?.message || 'Erreur lors de l’ajout');
      }
    });
  }

  onSearch(): void {
    this.userService.searchUsers(this.search).subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('❌ Recherche échouée', err)
    });
  }

  selectUser(user: any): void {
    this.selectedUser = { ...user };
  }

  onUpdateRole(): void {
    this.userService.updateUserRole(this.selectedUser._id, this.selectedUser.role).subscribe({
      next: () => {
        alert('✅ Rôle mis à jour !');
        this.selectedUser = null;
        this.onSearch();
      },
      error: (err) => console.error('❌ Erreur mise à jour rôle', err)
    });
  }

  onDelete(userId: string): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== userId);
        if (this.selectedUser?.id === userId) this.selectedUser = null;
      },
      error: (err) => console.error('❌ Erreur suppression utilisateur', err)
    });
  }

  getAllUsersDev(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('❌ Erreur lors de la récupération de tous les utilisateurs', err)
    });
  }
}