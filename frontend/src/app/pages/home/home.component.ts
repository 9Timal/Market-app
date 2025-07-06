import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '../../models/store.model';
import { StoreService } from '../../services/store.service';
import { AccessService } from '../../services/access.service';
import {
  distinctUntilChanged,
  combineLatest,
  filter,
  switchMap,
  startWith
} from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-home',
  standalone: true,
  imports:[FormsModule, NgIf,NgFor,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nameControl = new FormControl('');
  cityControl = new FormControl('');
  zipCodeControl = new FormControl('');
  user!: User;

  searchResults: Store[] = [];
  userTyped = false;
  selectedStore: Store | null = null;
  
 

  constructor(
    private storeService: StoreService,
    private accessService: AccessService
  ) {}

  ngOnInit(): void {
  
    this.accessService.localRole$.subscribe(role => {
      if (role !== null) {
        console.log('🎖️ Rôle détecté :', role);
      }
    });
      
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData) as User;
      } catch (e) {
        console.error('Erreur lors du parsing de user depuis localStorage', e);
      }
    }


    // Récupération initiale du magasin sélectionné depuis le Behavior
    this.accessService.selectedStore$.subscribe(store => {
      this.selectedStore = store;
    });

 
    combineLatest([
      this.nameControl.valueChanges.pipe(startWith('')),
      this.cityControl.valueChanges.pipe(startWith('')),
      this.zipCodeControl.valueChanges.pipe(startWith(''))
    ])
      .pipe(
        distinctUntilChanged(),
        filter(([name, city, zip]) => {
          return !!(name?.trim() || city?.trim() || zip?.trim());
        }),
        switchMap(([name, city, zip]) => {
          this.userTyped = true;

          return this.storeService.advancedSearch({
            name: name?.trim() || null,
            city: city?.trim() || null,
            zip_code: zip?.trim() || null
          });
        })
      )
      .subscribe({
        next: results => (this.searchResults = results),
        error: () => (this.searchResults = [])
      });
  }

  selectStore(store: Store): void {
    this.accessService.setSelectedStore(store);
  }

  resetStore(): void {
    this.accessService.reset();
  }
}
