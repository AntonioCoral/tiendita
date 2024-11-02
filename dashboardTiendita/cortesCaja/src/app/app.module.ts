import { NgModule, isDevMode, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; 
import { HashLocationStrategy, LocationStrategy } from '@angular/common';





import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Modulos
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ToastrModule } from 'ngx-toastr';



//Components

import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginComponent } from './componentes/login/login.component';
import { ListOrdersComponent } from './componentes/list-orders/list-orders.component';
import { AddEditOrderComponent } from './componentes/add-edit-order/add-edit-order.component';
import { ProgressBarComponent } from './shared/progress-bar/progress-bar.component';
import { DatePipe } from '@angular/common';
import { DeliveryOrdersComponent } from './componentes/delivery-orders/delivery-orders.component';
import { OrdersByDateComponent } from './componentes/orders-by-date/orders-by-date.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { CorteCajaComponent } from './componentes/corte-caja/corte-caja.component';
import { AddCorteComponent } from './componentes/add-corte/add-corte.component';
import { ClientesComponent } from './componentes/clientes/clientes.component';
import { AddCategoryComponent } from './componentes/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './componentes/admin-products/admin-products.component';
import { EditProductsComponent } from './componentes/edit-products/edit-products.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListOrdersComponent,
    AddEditOrderComponent,
    ProgressBarComponent,
    NavbarComponent,
    DeliveryOrdersComponent,
    OrdersByDateComponent,
    CorteCajaComponent,
    AddCorteComponent,
    ClientesComponent,
    AddCategoryComponent,
    AdminProductsComponent,
    EditProductsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true, // Activa la barra de progreso si la otra aplicación la tiene
      progressAnimation: 'increasing', // Puedes cambiar a 'decreasing' según tu preferencia
    }), 
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
  ],
  providers: [DatePipe, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
