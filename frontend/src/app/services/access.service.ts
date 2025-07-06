import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '../models/store.model'; // Remplace par ton vrai modèle si besoin
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccessService {

  /**
   * 🔁 selectedStoreSubject stocke le magasin actuellement sélectionné.
   * On commence avec "null", donc pas de magasin sélectionné par défaut.
   */
  private selectedStoreSubject = new BehaviorSubject<Store | null>(null);
  selectedStore$ = this.selectedStoreSubject.asObservable(); // observable pour les composants
  
  
  /**
   * 🔐 localRoleSubject stocke le rôle de l'utilisateur DANS le magasin sélectionné.
   * Exemple : 'admin', 'chef_admin', ou null s’il n’a aucun droit local.
   */
  private localRoleSubject = new BehaviorSubject<'admin' | 'chef_admin' | null>(null);
  localRole$ = this.localRoleSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initSelectedStore();
  }

  /**
   * 📍 Appelé quand l'utilisateur sélectionne un magasin dans l'app
   * Il met à jour le magasin sélectionné + vérifie les droits associés via le backend
   */
  setSelectedStore(store: Store): void {
    this.selectedStoreSubject.next(store); // maj du magasin choisi
    const localUser = JSON.parse(localStorage.getItem('user')!);
  
    // Appel backend pour savoir quel est le rôle de cet utilisateur dans ce magasin
    this.http
      .get<{ access: 'admin' | 'chef_admin' | null }>(
        `${environment.apiUrl}/api/store_access/access/${store._id}/${localUser._id}`
      )
      .subscribe({
        next: (res) => {
          this.localRoleSubject.next(res.access)// maj du rôle 
        }, 
        error: () => {
          this.localRoleSubject.next(null)
        } // en cas d'erreur, aucun droit
      });
  }

  getCurrentRole(): 'admin' | 'chef_admin' | null {
    return this.localRoleSubject.getValue();
  }
  
  /**
   * ❌ Méthode à appeler à la déconnexion ou changement global (réinitialisation)
   */
  reset(): void {
    this.selectedStoreSubject.next(null);
    this.localRoleSubject.next(null);
  }

  /**
   * Initialise le store sélectionné depuis localStorage
   * et écoute les changements pour garder localStorage synchronisé.
   */

  private initSelectedStore(): void {
    // Rechargement à l'ouverture
    const stored = localStorage.getItem('selected_store');
    if (stored) {
      try {
        const store: Store = JSON.parse(stored);
        this.selectedStoreSubject.next(store);
      } catch {
        localStorage.removeItem('selected_store');
      }
    }

    // Synchro automatique vers localStorage à chaque changement
    this.selectedStore$.subscribe(store => {
      if (store) {
        localStorage.setItem('selected_store', JSON.stringify(store));
      } else {
        localStorage.removeItem('selected_store');
      }
    });
  }
}

