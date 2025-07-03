import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-centre-product',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './centre-product.component.html',
  styleUrl: './centre-product.component.scss'
})
export class CentreProductComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product | null = null;
  showAddForm = false;

  newProduct: Product = {
    name: '',
    category: '',
    marque: '',
    barcode: ''
  };

  search = {
    name: '',
    category: '',
    marque: '',
    barcode: ''
  };

  constructor(private productServ: ProductService) {}

  ngOnInit(): void {}

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onAddProduct(): void {
    this.productServ.addProduct(this.newProduct).subscribe({
      next: (res) => {
        console.log('✅ Produit ajouté', res);
        this.showAddForm = false;
        this.newProduct = { name: '', category: '', marque: '', barcode: '' };
        this.onSearch(); // Refresh list
      },
      error: (err) => {
        console.error('❌ Erreur ajout produit', err);
        alert(err?.error?.message || 'Erreur serveur');
      }
    });
  }

  onSearch(): void {
    const filters: any = {};
    Object.entries(this.search).forEach(([key, value]) => {
      if (value) filters[key] = value;
    });

    this.productServ.searchProducts(filters).subscribe({
      next: (res:any) => this.products = res,
      error: (err:any) => console.error('❌ Erreur recherche', err)
    });
  }

  getAllProducts(): void {
    this.productServ.getAllProducts().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error('❌ Erreur récupération', err)
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
  }

  onUpdateProduct(): void {
    if (!this.selectedProduct?._id) return;

    this.productServ.updateProduct(this.selectedProduct._id, this.selectedProduct).subscribe({
      next: () => {
        alert('✅ Produit mis à jour !');
        this.selectedProduct = null;
        this.onSearch();
      },
      error: (err) => {
        console.error('❌ Erreur mise à jour', err);
        alert(err?.error?.message || 'Erreur serveur');
      }
    });
  }

  onDeleteProduct(id?: string): void {
    if (!id || !confirm('Supprimer ce produit ?')) return;

    this.productServ.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p._id !== id);
        if (this.selectedProduct?._id === id) this.selectedProduct = null;
      },
      error: (err) => {
        console.error('❌ Erreur suppression', err);
        alert(err?.error?.message || 'Erreur serveur');
      }
    });
  }
}
