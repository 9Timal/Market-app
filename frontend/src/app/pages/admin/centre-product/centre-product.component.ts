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
  selectedFile: File | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  editImagePreviewUrl: string | null = null;
  updateImagePreviewUrl: string | null = null;
  isUpdating: boolean = false;

  newProduct: Product = {
    name: '',
    category: '',
    marque: '',
    barcode: '',
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

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file); // Convertit le fichier en base64
    }
  }

 onAddProduct(): void {
    if (!this.selectedFile) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('category', this.newProduct.category);
    formData.append('marque', this.newProduct.marque);
    formData.append('barcode', this.newProduct.barcode);
    formData.append('image', this.selectedFile); // important !

    this.productServ.addProduct(formData).subscribe({
      next: (res) => {
        console.log('✅ Produit ajouté', res);
        this.showAddForm = false;
        this.newProduct = { name: '', category: '', marque: '', barcode: '' };
        this.selectedFile = null;
        this.onSearch();
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
    if (!this.selectedProduct?._id || this.isUpdating) return;

    this.isUpdating = true;

    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('category', this.selectedProduct.category);
    formData.append('marque', this.selectedProduct.marque);
    formData.append('barcode', this.selectedProduct.barcode);
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.productServ.updateProduct(this.selectedProduct._id, formData).subscribe({
      next: () => {
        alert('✅ Produit mis à jour !');
        this.selectedProduct = null;
        this.selectedImageFile = null;
        this.updateImagePreviewUrl = null;
        this.onSearch();
      },
      error: (err) => {
        console.error('❌ Erreur mise à jour', err);
        alert(err?.error?.message || 'Erreur serveur');
      },
      complete: () => {
        this.isUpdating = false;
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

  onUpdateImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.updateImagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  closeForm(): void {
    this.showAddForm = false;
    this.newProduct = { name: '', category: '', marque: '', barcode: '' };
    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }

    
}
