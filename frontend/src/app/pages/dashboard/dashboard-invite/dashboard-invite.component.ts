import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreInviteService } from '../../../services/store-invite.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { invitation } from '../../../models/invitation.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-invite',
  standalone: true,
  imports: [CommonModule,FormsModule, NgIf],
  templateUrl: './dashboard-invite.component.html',
  styleUrl: './dashboard-invite.component.scss'
})
export class DashboardInviteComponent implements OnInit, OnDestroy {

  showInviteForm: boolean = false;
  inviteEmail: string = '';
  inviteRole: 'admin' | 'chef_admin' = 'admin';
  storeId: string = '';
  invitations: invitation[] = []; 
  subscriptions = new Subscription();

  constructor(
      private storeInviteService: StoreInviteService
    ) {}

  ngOnInit(): void {
    const storeStr = localStorage.getItem('selected_store');
    if (storeStr) {
      const storeObj = JSON.parse(storeStr);
      this.storeId = storeObj._id;
      
      this.getInvitations(); // 🟢 Chargement initial
      const refreshSub = this.storeInviteService.refreshInvites$.subscribe(() => {
        this.getInvitations(); // 🔁 Se relance automatiquement après chaque création
      });

      this.subscriptions.add(refreshSub); // 👈 pour pouvoir nettoyer plus tard
    }
    
  }

  ngOnDestroy(): void {
    console.log('🔥 Composant détruit, nettoyage en cours...');
    this.subscriptions.unsubscribe(); // 🔪 coupe toutes les connexions RxJS

  }

  createInvitation(): void {
    if (!this.inviteEmail || !this.inviteRole) {
      alert("Veuillez renseigner un email et un rôle.");
      return;
    }

    this.storeInviteService.createInvitation(this.storeId, this.inviteEmail, this.inviteRole).subscribe({
      next: (res) => {
        this.showInviteForm = false;
        this.inviteEmail = '';
        this.inviteRole = 'admin';
      },
      error: (err) => {
        console.error("Erreur lors de l'invitation :", err);
        alert("Erreur lors de l'envoi de l'invitation.");
      }
    });
  }

  getInvitations():void{
    this.storeInviteService.getInvitationsByStore(this.storeId).subscribe({
      next: (data) => {
        this.invitations = data; 
      },
      error: (err) => {
        console.error("Erreur lors du chargement des invitations :", err);
      }
    })
  }

}
