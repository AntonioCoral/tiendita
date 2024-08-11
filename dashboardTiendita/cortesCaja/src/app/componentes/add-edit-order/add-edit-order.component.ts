import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.css']
})
export class AddEditOrderComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar ';

  constructor (
    private fb: FormBuilder,
    private _orderService: OrderService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute
  ) {
    this.form = this.fb.group({
      numerOrden: ['', Validators.required],
      numeroCaja: ['', Validators.required],
      nameClient: ['', Validators.required],
      direction: ['', Validators.required],
      efectivo: ['', Validators.required],
      montoCompra: ['', Validators.required],
      transferenciaPay: [''],
      recharge: ['']
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.aRouter.queryParams.subscribe(params => {
      if (params['nombre'] && params['direction']) {
        this.form.patchValue({
          nameClient: params['nombre'],
          direction: params['direction']
        });
      }
    });

    if (this.id != 0) {
      this.operacion = 'Editar ';
      this.getOrden(this.id);
    } else {
      // Generar número de orden aleatorio
      this.generateRandomOrderNumber();
    }
  }
  

  getOrden(id: number) {
    this.loading = true;
    this._orderService.getOrder(id).subscribe((data: Order) => {
      this.loading = false;
      this.form.setValue({
        numerOrden: data.numerOrden,
        numeroCaja: data.numeroCaja,
        nameClient: data.nameClient,
        direction: data.direction,
        efectivo: data.efectivo,
        montoCompra: data.montoCompra,
        transferenciaPay: data.transferenciaPay,
        recharge: data.recharge
      });
    });
  }
  generateRandomOrderNumber() {
    const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    this._orderService.checkOrderNumberExists(randomOrderNumber).subscribe(exists => {
      if (exists) {
        // Si el número de orden ya existe, generar otro
        this.generateRandomOrderNumber();
      } else {
        this.form.patchValue({ numerOrden: randomOrderNumber });
      }
    });
  }

  addOrden() {
    // Asegúrate de que el número de orden esté generado antes de agregar la orden
    if (!this.form.value.numerOrden) {
      this.generateRandomOrderNumber();
      return;
    }
    const orden: Order = {
      numerOrden: this.form.value.numerOrden,
      numeroCaja: this.form.value.numeroCaja,
      nameClient: this.form.value.nameClient,
      direction: this.form.value.direction,
      efectivo: this.form.value.efectivo,
      montoCompra: this.form.value.montoCompra,
      transferenciaPay: this.form.value.transferenciaPay,
      recharge: this.form.value.recharge
    };

    const today = moment().format('YYYY-MM-DD');

    if (this.id !== 0) {
      this.loading = true;
      this._orderService.updateOrden(this.id, orden).subscribe(() => {
        this.loading = false;
        this.toastr.success(`La orden de ${orden.nameClient} fue actualizada con éxito`);
        this.router.navigate(['/list-orders']);
      });
    } else {
      this.loading = true;
      this._orderService.getLastOrderNumber(today).subscribe(({ lastOrderNumber }) => {
        orden.numerOrden = lastOrderNumber + 1;
        this._orderService.saveOrder(orden).subscribe(() => {
          this.loading = false;
          this.toastr.success(`La orden de ${orden.nameClient} fue registrada con éxito`);
          this.router.navigate(['/list-orders']);
        });
      });
    }
  }
}
