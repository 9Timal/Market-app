import { Component } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/store.model';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-centre-store',
  standalone: true,
  imports: [CommonModule,NgIf,NgIf,FormsModule],
  templateUrl: './centre-store.component.html',
  styleUrl: './centre-store.component.scss'
})
export class CentreStoreComponent {
   stores: Store[] = [];
  selectedStore: Store | null = null;
  showAddForm = false;

  newStore: Partial<Store> = {
    name: '',
    address: '',
    city: '',
    zip_code: ''
  };

  search = {
    name: '',
    city: '',
    zip_code: ''
  };

  constructor(private storeService: StoreService) {}

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  getAllStores() {
    this.storeService.getAllStores().subscribe({
      next: (stores) => this.stores = stores,
      error: (err) => console.error('Erreur getAllStores', err)
    });
  }

  onSearch() {
    this.storeService.advancedSearch(this.search).subscribe({
      next: (results) => this.stores = results,
      error: (err) => console.error('Erreur recherche', err)
    });
  }

  onAddStore() {
    this.storeService.createStore(this.newStore).subscribe({
      next: () => {
        this.getAllStores();
        this.newStore = { name: '', address: '', city: '', zip_code: '' };
        this.showAddForm = false;
      },
      error: (err) => console.error('Erreur ajout magasin', err)
    });
  }

  selectStore(store: Store) {
    this.selectedStore = { ...store };
  }

  onUpdateStore() {
    if (!this.selectedStore) return;
    this.storeService.updateStore(this.selectedStore._id!, this.selectedStore).subscribe({
      next: () => {
        this.getAllStores();
        this.selectedStore = null;
      },
      error: (err) => console.error('Erreur MAJ magasin', err)
    });
  }

  onDeleteStore(id: string) {
    this.storeService.deleteStore(id).subscribe({
      next: () => this.getAllStores(),
      error: (err) => console.error('Erreur suppression', err)
    });
  }
}
