import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { StoreProductService } from '../../../services/store-product.service';


@Component({
  selector: 'app-dashboard-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard-product.component.html',
  styleUrl: './dashboard-product.component.scss'
})
export class DashboardProductComponent implements OnInit {

  nameProduct:string = '';
  categoryProduct:string = '';
  barcodeProduct:string = '';
  marqueProduct:string = '';

  constructor(
    private productService: ProductService,
    private storeProductService: StoreProductService 
  ){}

  ngOnInit(): void {
      
  }

}
