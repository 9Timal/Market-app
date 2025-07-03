import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Store } from '../models/store.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private API_URL = `${environment.apiUrl}/api/stores`;

  constructor(private http: HttpClient) {}

  /**
   * 🔎 Rechercher des magasins par critères (nom, ville, code postal)
   * @param filters objet contenant éventuellement { name, city, zip_code }
   */
  advancedSearch(filters: {
    name?: string | null;
    city?: string | null;
    zip_code?: string | null;
  }): Observable<Store[]> {
    // 🧪 Vérifie qu'au moins un champ est renseigné
    const hasAtLeastOne = filters.name || filters.city || filters.zip_code;
    if (!hasAtLeastOne) {
      return of([]); // évite l'appel si rien n'est tapé
    }

    // 🔧 Construction des paramètres de requête
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.city) params = params.set('city', filters.city);
    if (filters.zip_code) params = params.set('zip_code', filters.zip_code);

    // 🔁 Requête GET vers le backend avec les filtres
    return this.http.get<Store[]>(`${this.API_URL}/search`, { params });
  }
}
