import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component,  OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { StoreAccessService } from '../../../services/store-access.service';
import { AccessWithUser } from '../../../models/accessWithUser';
import { StoreInviteService } from '../../../services/store-invite.service';


@Component({
  selector: 'app-dashboard-access',
  standalone: true,
  imports: [ CommonModule,FormsModule, NgClass],
  templateUrl: './dashboard-access.component.html',
  styleUrl: './dashboard-access.component.scss'
})
export class DashboardAccessComponent implements OnInit{

  personnels: AccessWithUser[] = [];
  filteredPersonnels: AccessWithUser[] = [];
  searchQuery: string = '';
  storeId: string = '';
  showInviteForm: boolean = false;
  inviteEmail: string = '';
  inviteRole: 'admin' | 'chef_admin' = 'admin';

  constructor(
    private storeAccessService: StoreAccessService,
    private storeInviteService: StoreInviteService
  ) {}

 ngOnInit(): void {
    const storeStr = localStorage.getItem('selected_store');
    if (storeStr) {
      const storeObj = JSON.parse(storeStr);
      this.storeId = storeObj._id;
      console.log(this.storeId); 
      this.loadPersonnels();
    }
  }

  updateRole(accessId: string, newRole: 'admin' | 'chef_admin'): void {
    this.storeAccessService.updateRole(accessId, newRole).subscribe({
      next: () => console.log("Rôle mis à jour"),
      error: (err) => console.error("Erreur mise à jour :", err)
    });
  }



  loadPersonnels(): void {
    this.storeAccessService.getAccessByStore(this.storeId).subscribe({
      next: (data: AccessWithUser[]) => {
        // On ajoute manuellement showDetails à chaque élément
        this.personnels = data.map(p => ({ ...p, showDetails: false }));
        this.filteredPersonnels = [...this.personnels];
      },
      error: (err) => {
        console.error("Erreur lors du chargement des accès :", err);
      }
    });
  }

  toggleDetails(p: AccessWithUser & { showDetails: boolean }): void {
    p.showDetails = !p.showDetails;
  }


  search(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredPersonnels = this.personnels.filter(p =>
      p.user.name.toLowerCase().includes(query) ||
      p.user.lastname.toLowerCase().includes(query)
    );
  }

  

  removeAccess(accessId: string): void {
    if (!confirm("Confirmer la suppression de l'accès ?")) return;
    this.storeAccessService.removeAccess(accessId).subscribe({
      next: () => {
        this.personnels = this.personnels.filter(u => u._id !== accessId);
        this.filteredPersonnels = this.filteredPersonnels.filter(u => u._id !== accessId);
      },
      error: (err) => {
        console.error('Erreur suppression :', err);
      }
    });
  }


  
}