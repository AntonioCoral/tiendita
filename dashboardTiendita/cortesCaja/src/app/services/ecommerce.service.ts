import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct, ICategory, IProductOption } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService {
  

  private apiUrl = 'http://86.38.203.16:500/'; // Reemplaza esto con la URL real de tu API

  constructor(private http: HttpClient) { }

  getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.apiUrl}/categories`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/products`);
  }

  createProduct(product: FormData): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.apiUrl}/products`, product);
  }

  getProductsByCategory(categoryId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/products/category/${categoryId}`);
  }

  searchProducts(query: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/products/search`, { params: { query } });
  }

  createProductsBulk(products: IProduct[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products/bulk`, products);
  }
  
  updateProduct(productId: number, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${productId}`, productData);
  }

  

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/products/${id}`);
  }
  getProductOptions(): Observable<IProductOption[]> {
    return this.http.get<IProductOption[]>(`${this.apiUrl}/productOptions`);
  }
  
}
