import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/interfaces/order';
import { OrderService } from 'src/app/services/order.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { SocketService } from 'src/app/services/conexion.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.css']
})
export class AddEditOrderComponent {
  form: FormGroup;
  loading: boolean = false;
  id: number;
  operacion: string = 'Agregar ';
  telefonosAutocompletados: string[];
  telefonoInput = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private _orderService: OrderService,
    private router: Router,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private clienteService: ClienteService,
    private socketService: SocketService
  ) {
    this.form = this.fb.group({
      numerOrden: ['', Validators.required],
      numeroCaja: ['', Validators.required],
      nameClient: ['', Validators.required],
      direction: ['', Validators.required],
      efectivo: ['', Validators.required],
      montoCompra: ['', Validators.required],
      transferenciaPay: ['', Validators.required],
      recharge: ['', Validators.required]
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
    this.telefonosAutocompletados = [];

    this.telefonoInput.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(telefono => this.clienteService.getCliente(Number(telefono)))
    ).subscribe(cliente => {
      if (cliente) {
        this.telefonosAutocompletados = [cliente.telefono];
      } else {
        this.telefonosAutocompletados = [];
      }
    });

    if (this.id !== 0) {
      this.operacion = 'Editar ';
      this.getOrden(this.id);
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

  addOrden() {
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

    if (this.id !== 0) {
      this.loading = true;
      this.id = this.id;
      this._orderService.updateOrden(this.id, orden).subscribe(() => {
        this.loading = false;
        this.toastr.success(`La orden de ${orden.nameClient} fue actualizado con exito`);
        this.router.navigate(['/list-orders']);
      });
    } else {
      this.loading = true;
      this._orderService.saveOrder(orden).subscribe(() => {
        this.loading = false;
        this.toastr.success(`La orden de ${orden.nameClient} fue registrado con exito`);
        this.router.navigate(['/list-orders']);
        
        // Emitir un evento WebSocket para notificar al servidor sobre la nueva orden agregada
        this.socketService.emitOrderAdded(orden);
      });
    }
  }
}
