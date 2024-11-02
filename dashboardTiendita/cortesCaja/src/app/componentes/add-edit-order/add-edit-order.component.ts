import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
import { SocketService } from 'src/app/services/conexion.service';
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
  showQuantity: boolean = false;  // Controla si se debe mostrar el campo de cantidad
  selectedItem: string = '';

  constructor (
    private fb: FormBuilder,
    private _orderService: OrderService,
    private router: Router,
    private toastr: ToastrService,
    private socketService: SocketService,
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
      recharge: [''],
      montoServicio: [{ value: '', disabled: true }],
      bebidas: this.fb.array([]),  // FormArray de bebidas
      itemOrder: ['']
    });
    this.id = Number(aRouter.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    // Suscríbete a los parámetros de la URL
  this.aRouter.queryParams.subscribe(params => {
    console.log("Parámetros recibidos:", params);  // Para depuración

    // Asigna los valores obtenidos de los parámetros al formulario
    this.form.patchValue({
      nameClient: params['nombre'] || '',
      direction: params['direction'] || ''
     
    });

    console.log("Datos del formulario después de asignar parámetros:", this.form.value);  // Verificar datos en formulario
  });
    if (this.id != 0) {
      this.operacion = 'Editar ';
      this.getOrden(this.id);
    } else {
      // Generar número de orden aleatorio
      this.generateRandomOrderNumber();
      console.log("Datos del cliente:", this.form.value);

    }
  }

  get bebidas(): FormArray {
    return this.form.get('bebidas') as FormArray;
  }

  agregarBebida(): void {
    const bebidaForm = this.fb.group({
      nombre: [''],
      cantidad: [{ value: '', disabled: true }]
    });
    this.bebidas.push(bebidaForm);
  }

  onBebidaChange(index: number): void {
    const bebidaControl = this.bebidas.at(index).get('nombre');
    const cantidadControl = this.bebidas.at(index).get('cantidad');

    if (bebidaControl?.value === '') {
      cantidadControl?.disable();
      cantidadControl?.setValue('');
    } else {
      cantidadControl?.enable();
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
        recharge: data.recharge,
        montoServicio: data.montoServicio || '',
        itemOrder: data.itemOrder,
        bebidas: []  // Reset the array, you'll need to load bebidas dynamically if needed
      });
    });
  }
  

  onItemChange(event: Event): void {
    const selectedItem = (event.target as HTMLSelectElement).value;
    this.selectedItem = selectedItem;

    if (selectedItem === 'none') {
      this.showQuantity = false;
      this.form.get('itemQuantity')?.setValue('');  // Limpiar cantidad
      this.form.get('itemQuantity')?.disable();  // Deshabilitar campo de cantidad
    } else {
      this.showQuantity = true;
      this.form.get('itemQuantity')?.enable();  // Habilitar campo de cantidad
    }
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
    if (!this.form.value.numerOrden) {
        this.generateRandomOrderNumber();
        return;
    }

    // Concatenar bebidas en itemOrder
    const bebidasConcatenadas = this.form.value.bebidas
      .filter((bebida: any) => bebida.nombre !== '') // Solo tomar bebidas seleccionadas
      .map((bebida: any) => `${bebida.nombre} cantidad: ${bebida.cantidad}`)
      .join(', ');

    const orden: Order = {
        numerOrden: this.form.value.numerOrden,
        numeroCaja: this.form.value.numeroCaja,
        nameClient: this.form.value.nameClient,
        direction: this.form.value.direction,
        efectivo: this.form.value.efectivo,
        montoCompra: this.form.value.montoCompra,
        transferenciaPay: this.form.value.transferenciaPay,
        recharge: this.form.value.recharge,
        montoServicio: this.form.value.montoServicio,
        itemOrder: bebidasConcatenadas  // Guardar bebidas concatenadas
    };

    const today = moment().format('YYYY-MM-DD');

    if (this.id !== 0) {
        this.loading = true;
        this._orderService.updateOrden(this.id, orden).subscribe(() => {
            this.loading = false;
            this.toastr.success(`La orden de ${orden.nameClient} fue actualizada con éxito`);
            this.socketService.onOrderUpdated();
            this.router.navigate(['/list-orders'], { state: { scrollPosition: history.state.scrollPosition || 0 } });
        });
    } else {
        this.loading = true;
        this._orderService.getLastOrderNumber(today).subscribe(({ lastOrderNumber }) => {
            orden.numerOrden = lastOrderNumber + 1;
            this._orderService.saveOrder(orden).subscribe(() => {
                this.loading = false;
                this.toastr.success(`La orden de ${orden.nameClient} fue registrada con éxito`);
                this.socketService.emitOrderAdded(orden);
                this.router.navigate(['/list-orders'], { state: { scrollPosition: history.state.scrollPosition || 0 } });
            });
        });
    }
  }
  onServiceTypeChange(event: Event): void {
    const selectedService = (event.target as HTMLSelectElement).value;
    const montoServicioControl = this.form.get('montoServicio');
  
    if (selectedService === '') {
      montoServicioControl?.setValue('');
      montoServicioControl?.disable();
    } else {
      montoServicioControl?.enable();
    }
  }
  
  
  
}
