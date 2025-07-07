import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AccessService } from '../../services/access.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ElementRef, HostListener } from '@angular/core';
import { AccessInStore } from '../../models/AccessInStore';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink],
  templateUrl: './burger-menu.component.html',
  styleUrl: './burger-menu.component.scss'
})
export class MenuBurgerComponent implements OnInit {
  isSuperAdmin = false;
  hasLocalAccess = false;
  isOpen = false;
  

  constructor(
    private authService: AuthService,
    private storeAccessService: AccessService,
    private router: Router,
    private elRef: ElementRef, // ← on récupère l’élément HTML du composant
    
  ) {}

  ngOnInit(): void {
    
    // Rôle global
    const user = this.authService.getCurrentUser();
    this.isSuperAdmin = user?.role === 'super_admin';
    

    // 🔄 Restaurer le magasin depuis le localStorage si présent
    const stored = localStorage.getItem('selected_store');
    if (stored) {
      try {
        const store: Store = JSON.parse(stored);
        this.accessRole(store);
      } catch (e) {
        console.warn("❗Magasin localStorage invalide");
        localStorage.removeItem('selected_store');
      }
    }

    // Rôle local (admin ou chef_admin pour un magasin)
    this.storeAccessService.localRole$.subscribe(role => {
      this.hasLocalAccess = role === 'admin' || role === 'chef_admin';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

 get canAccessDashboard(): boolean {
    const storeExists = !!localStorage.getItem('selected_store');
    return storeExists && (this.isSuperAdmin || this.hasLocalAccess);
  }
  
  accessRole(store: Store): void {
    this.storeAccessService.setSelectedStore(store);
  }


  toggleMenu(event: MouseEvent): void {
    event.stopPropagation(); // ⛔ empêche le HostListener de le capter
    this.isOpen = true;
  }

  // 🔍 écoute les clics sur le document entier
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen) {
      this.isOpen = false; // ferme le menu si on clique ailleurs
    }
  }
}