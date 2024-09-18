import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import * as XLSX from 'xlsx';  // Importar la librería XLSX

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  loading: boolean = false;
  selectedFile: File | null = null;
  productId: number;

  constructor(
    private fb: FormBuilder,
    private ecommerceService: EcommerceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      barcode: ['', Validators.required],
      image: [''],
      categoryId: ['', Validators.required]
    });

    this.productId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductData();
  }

  loadCategories() {
    this.ecommerceService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadProductData() {
    this.ecommerceService.getProductById(this.productId).subscribe(product => {
      this.form.patchValue({
        name: product.name,
        cost: product.cost,
        price: product.price,
        stock: product.stock,
        barcode: product.barcode,
        categoryId: product.categoryId,
      });
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      this.toastr.error('No se puede cargar más de un archivo');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      this.importProducts(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  importProducts(products: any) {
    this.loading = true;
    const requests = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      cost: product.cost,
      price: product.price,
      stock: product.stock,
      barcode: product.barcode,
      categoryId: this.getCategoryIdByName(product.categoryId)
    }));
    
    
  
    this.ecommerceService.createProductsBulk(requests).subscribe(() => {
      this.loading = false;
      this.toastr.success('Productos importados con éxito');
      this.router.navigate(['/admin-products']);
    }, error => {
      this.loading = false;
      this.toastr.error('Error al importar productos');
    });
  }
  getCategoryIdByName(categoryName: string): number {
    const category = this.categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    return category ? category.id : 0;
  }

  updateProduct() {
    if (this.form.invalid) {
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
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.ecommerceService.updateProduct(this.productId, formData).subscribe(() => {
      this.loading = false;
      this.toastr.success('Producto actualizado con éxito');
      this.router.navigate(['/list-products']);
    }, error => {
      this.loading = false;
      this.toastr.error('Error al actualizar el producto');
    });
  }
}
