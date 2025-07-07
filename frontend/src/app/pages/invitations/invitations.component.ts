import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreInviteService } from '../../services/store-invite.service';
import { Myinvitation } from '../../models/MyInvitation';
import { CommonModule, NgIf,  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule,FormsModule,NgIf],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss'
})
export class InvitationsComponent implements OnInit,OnDestroy{
   invitations: Myinvitation[] = []; 
   subscriptions = new Subscription();

  constructor(
    private storeInviteService: StoreInviteService
  ){

  }

  ngOnInit():void{
    this.getMyInvitations(); // 🟢 Chargement initial
    const refreshSub = this.storeInviteService.refreshInvites$.subscribe(() => {
        this.getMyInvitations(); 
    });

    this.subscriptions.add(refreshSub);

  }

   ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // 🔪 coupe toutes les connexions RxJS
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

  AccepteInvitation(invite:Myinvitation):void{
    this.storeInviteService.acceptInvitation(invite.id).subscribe({
      next: (data)=>{
        console.log(data)
      },
      error: (err) => {
        console.error("Une erreur est survenu:", err);
      }
    })
  }

  RefuseInvitation(invite:Myinvitation):void{
    this.storeInviteService.refuseInvitation(invite.id).subscribe({
      next: (data)=>{
        console.log(data)
      },
      error: (err) => {
        console.error("Une erreur est survenu:", err);
      }
    })
  }

  isExpired(date: Date): boolean {
    return new Date(date).getTime() < Date.now();
  }

}
