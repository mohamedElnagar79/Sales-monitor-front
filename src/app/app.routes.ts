import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SalesComponent } from './sales/sales.component';
import { CustomersComponent } from './customers/customers.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { SidebarGuard } from './shared/sidebar/SidebarGuard';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'products',
    canLoad: [SidebarGuard],
    component: ProductsComponent,
  },
  {
    path: 'sales',
    component: SalesComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
