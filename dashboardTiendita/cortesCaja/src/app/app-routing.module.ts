import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Componentes
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { ListOrdersComponent } from './componentes/list-orders/list-orders.component';
import { AddEditOrderComponent } from './componentes/add-edit-order/add-edit-order.component';
import { DeliveryOrdersComponent } from './componentes/delivery-orders/delivery-orders.component';
import { OrdersByDateComponent } from './componentes/orders-by-date/orders-by-date.component';
import { CorteCajaComponent } from './componentes/corte-caja/corte-caja.component';
import { AddCorteComponent } from './componentes/add-corte/add-corte.component';
import { AddCategoryComponent } from './componentes/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './componentes/admin-products/admin-products.component';
import { EditProductsComponent } from './componentes/edit-products/edit-products.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'list-orders', component: ListOrdersComponent},
  { path: 'add', component: AddEditOrderComponent},
  { path: 'edit/:id', component: AddEditOrderComponent},
  { path: 'delivery-orders/:nameDelivery', component: DeliveryOrdersComponent },
  { path: 'corte-caja', component: CorteCajaComponent},
  { path: 'addcorte', component: AddCorteComponent},
  { path: 'orders-by-date', component: OrdersByDateComponent },
  { path: 'admin-categories', component: AddCategoryComponent },
  { path: 'admin-products', component: AdminProductsComponent },
  { path: 'edit-product/:id', component: EditProductsComponent },
  { path: '**', redirectTo:'', pathMatch: 'full'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
