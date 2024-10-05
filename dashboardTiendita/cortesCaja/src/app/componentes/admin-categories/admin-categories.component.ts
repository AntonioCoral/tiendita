
// src/app/components/add-category/add-category.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ICategory } from 'src/app/interfaces/interface';

@Component({
  selector: 'app-add-category',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AddCategoryComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  categories: ICategory[] = [];

  constructor(
    private fb: FormBuilder,
    private EcommerceService: EcommerceService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  addCategory() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.EcommerceService.createCategory(this.form.value).subscribe(() => {
      this.loading = false;
      this.toastr.success('Categoría creada con éxito');
      this.router.navigate(['/admin-categories']);
      this.loadCategories(); //Recarga la lista despues de crear una nueva categoria
    }, error => {
      this.loading = false;
      this.toastr.error('Error al agregar la categoría');
    });
  }

  loadCategories(): void {
    this.EcommerceService.getCategories().subscribe(
      (data: ICategory[]) => {
        this.categories = data;
      },
      (error) => {
        this.toastr.error('Error al cargar las categorías');
      }
    );
  }
  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.EcommerceService.deleteCategory(id).subscribe(() => {
        this.toastr.error('Categoría eliminada con éxito');
        this.loadCategories();  // Recargar la lista después de eliminar
      }, error => {
        this.toastr.error('Error al eliminar la categoría');
      });
    }
  }
}
