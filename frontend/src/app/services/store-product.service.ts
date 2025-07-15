import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StoreProduct } from '../models/store-product.model';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreProductService {
  private API_URL = `${environment.apiUrl}/api/store-products`;

  private _storeProducts$ = new BehaviorSubject<StoreProduct[]>([]);
  public storeProducts$ = this._storeProducts$.asObservable();

  constructor(private http: HttpClient) {}

  // Récupère les produits et les push dans le subject (mais sans subscribe ici)
  fetchStoreProducts(storeId: string): Observable<StoreProduct[]> {
    return this.http.get<StoreProduct[]>(`${this.API_URL}/store/${storeId}`).pipe(
      tap(products => this._storeProducts$.next(products))
    );
  }

  // Getter pour accéder directement aux produits actuels
  get currentProducts(): StoreProduct[] {
    return this._storeProducts$.value;
  }

  // Création d’un produit (à consommer depuis le composant)
  addStoreProduct(product: Partial<StoreProduct>): Observable<StoreProduct> {
    return this.http.post<StoreProduct>(this.API_URL, product);
  }

  // Suppression d’un produit
  deleteStoreProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${productId}`);
  }

  // Méthode pour mettre à jour manuellement la liste dans le BehaviorSubject si besoin
  setStoreProducts(products: StoreProduct[]): void {
    this._storeProducts$.next(products);
  }
}
