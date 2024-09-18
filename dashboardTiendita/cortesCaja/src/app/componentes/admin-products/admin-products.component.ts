import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  form: FormGroup;
  categories: any[] = []; // Puedes definir una interfaz para las categorías
  loading: boolean = false;
  selectedFile: File | null = null;
  importedProducts: any[] = []; // Almacenar los productos importados aquí
  searchQuery: string = ''; // Cadena de búsqueda
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ecommerceService: EcommerceService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Inicialización del formulario con opciones de precio como FormArray
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      barcode: ['', Validators.required],
      image: [''],
      categoryId: [''],
      options: this.fb.array([]) // Para las opciones de precio
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductOptions();
  }

  loadCategories() {
    this.ecommerceService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  // Cargar opciones de precios
  loadProductOptions() {
    this.ecommerceService.getProductOptions().subscribe((options: any[]) => {
      options.forEach(option => this.addOptionToForm(option));
    });
  }

  // Obtener el FormArray de opciones de precios
  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  // Agregar una nueva opción de precio al formulario
  addOptionToForm(option?: any) {
    const optionGroup = this.fb.group({
      description: [option?.description || '', Validators.required],
      price: [option?.price || '', Validators.required]
    });
    this.options.push(optionGroup);
  }

  // Añadir una nueva opción de precio
  addNewPriceOption() {
    this.addOptionToForm(); // Llamar para añadir una nueva opción vacía
  }

  // Eliminar una opción de precio
  removeOption(index: number) {
    this.options.removeAt(index); // Eliminar una opción del FormArray
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  addProduct() {
    if (this.form.invalid && this.importedProducts.length === 0) {
      this.toastr.error('Formulario inválido o no hay productos importados');
      return;
    }
  
    this.loading = true;
  
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('cost', this.form.get('cost')?.value);
    formData.append('price', this.form.get('price')?.value);
    formData.append('stock', this.form.get('stock')?.value);
    formData.append('barcode', this.form.get('barcode')?.value);
    formData.append('categoryId', this.form.get('categoryId')?.value);

    // Asociar opciones de precio
    formData.append('options', JSON.stringify(this.options.value)); // Pasar las opciones de precio

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing) {
      const productId = this.form.get('id')?.value;
      this.ecommerceService.updateProduct(productId, formData).subscribe(
        () => {
          this.loading = false;
          this.toastr.success('Producto actualizado con éxito');
          this.isEditing = false;
          this.form.reset();
          this.router.navigate(['/admin-products']);
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Error al actualizar el producto');
        }
      );
    } else {
      this.ecommerceService.createProduct(formData).subscribe(
        () => {
          this.loading = false;
          this.toastr.success('Producto agregado con éxito');
          this.router.navigate(['/admin-products']);
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Error al agregar el producto');
        }
      );
    }
  }

  searchProduct() {
    if (this.searchQuery.trim()) {
      this.ecommerceService.searchProducts(this.searchQuery).subscribe(products => {
        if (products.length > 0) {
          const product = products[0];
          this.isEditing = true;
          
          this.form.patchValue({
            id: product.id,
            name: product.name,
            cost: product.cost,
            price: product.price,
            stock: product.stock,
            barcode: product.barcode,
            categoryId: product.categoryId
          });

          // Asignar las opciones de precios
          this.options.clear(); // Limpiar opciones previas antes de asignar nuevas
          product.options.forEach(option => this.addOptionToForm(option));

        } else {
          this.toastr.error('Producto no encontrado');
        }
      }, error => {
        this.toastr.error('Error en la búsqueda de productos');
      });
    }
  }
}
