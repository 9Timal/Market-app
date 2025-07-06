import { Component, OnInit } from '@angular/core';
import { StoreInviteService } from '../../services/store-invite.service';
import { Myinvitation } from '../../models/MyInvitation';
import { CommonModule, NgIf,  } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule,FormsModule,NgIf],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss'
})
export class InvitationsComponent implements OnInit{
   invitations: Myinvitation[] = []; 

  constructor(
    private storeInviteService: StoreInviteService
  ){

  }

  ngOnInit():void{
    this.getMyInvitations(); // 🟢 Chargement initial
  }


  getMyInvitations():void{
    this.storeInviteService.getMyInvitation().subscribe({
      next: (data) => {
        this.invitations = data; 
        console.log(data);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des invitations :", err);
      }
    })
  }

}
