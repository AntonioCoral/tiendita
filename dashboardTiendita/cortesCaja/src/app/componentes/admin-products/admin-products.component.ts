// src/app/components/admin-products/admin-products.component.ts

import { Component, OnInit } from '@angular/core';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import { IProduct, ICategory } from 'src/app/interfaces/interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  newProduct: IProduct = { id: 0, name: '', cost: 0, price: 0, stock: 0, barcode: '', categoryId: 0, image: '' };

  constructor(
    private ecommerceService: EcommerceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.ecommerceService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadProducts(): void {
    this.ecommerceService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  addProduct(): void {
    if (this.newProduct.name.trim()) {
      this.ecommerceService.createProduct(this.newProduct).subscribe(
        product => {
          this.products.push(product);
          this.newProduct = { id: 0, name: '', cost: 0, price: 0, stock: 0, barcode: '', categoryId: 0, image: '' };
          this.toastr.success('Producto agregado con éxito');
        },
        error => {
          this.toastr.error('Error al agregar el producto');
        }
      );
    }
  }
}
