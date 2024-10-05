// src/interfaces/interfaces.ts
export interface IProduct {
    id?: number;
    name: string;
    cost: number;
    price: number;
    stock: number;
    barcode: string;
    image?: string;
    options: IProductOption[];
    categoryId: number;
    productId?: number;
  }
  
  export interface IProductOption {
    id?: number;
    productId: number;
    price: number;
    description: string;
  }
  
  export interface ICategory {
    id: number;
    name: string;
  }
  