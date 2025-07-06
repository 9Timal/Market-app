import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AccessService } from '../../services/access.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ElementRef, HostListener } from '@angular/core';

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
    private elRef: ElementRef // ← on récupère l’élément HTML du composant
  ) {}

  ngOnInit(): void {
    
    const user = this.authService.getCurrentUser();

    // Rôle global
    this.isSuperAdmin = user?.role === 'super_admin';

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