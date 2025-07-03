// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private API = `${environment.apiUrl}/api/products`; 

  constructor(private http: HttpClient) {}

  searchProducts(filters: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API}/search`, { params: filters });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API, product);
  }

  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put(`${this.API}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
