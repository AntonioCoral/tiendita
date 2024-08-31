
// src/app/components/add-category/add-category.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AddCategoryComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

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

  ngOnInit(): void {}

  addCategory() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.EcommerceService.createCategory(this.form.value).subscribe(() => {
      this.loading = false;
      this.toastr.success('Categoría agregada con éxito');
      this.router.navigate(['/list-categories']);
    }, error => {
      this.loading = false;
      this.toastr.error('Error al agregar la categoría');
    });
  }
}
