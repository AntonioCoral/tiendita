import { NgModule, isDevMode, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; 




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





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListOrdersComponent,
    AddEditOrderComponent,
    ProgressBarComponent,
    DeliveryOrdersComponent,
    OrdersByDateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }), 
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
