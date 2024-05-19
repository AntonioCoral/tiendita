import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Componentes
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { ListOrdersComponent } from './componentes/list-orders/list-orders.component';
import { AddEditOrderComponent } from './componentes/add-edit-order/add-edit-order.component';


const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'list-orders', component: ListOrdersComponent},
  { path: 'add', component: AddEditOrderComponent},
  { path: 'edit/:id', component: AddEditOrderComponent},
  { path: '**', redirectTo:'', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
