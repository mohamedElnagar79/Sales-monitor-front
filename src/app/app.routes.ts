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
import { TokenGuard } from './guards/token.guard';
import { AdminGuard } from './guards/admin.guard';
import { TransactionsComponent } from './transactions/transactions.component';
import { OutgoingComponent } from './outgoing/outgoing.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'products',
    canActivate: [TokenGuard, AdminGuard],
    component: ProductsComponent,
  },
  {
    path: 'outgoing',
    canActivate: [TokenGuard],
    component: OutgoingComponent,
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [TokenGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [TokenGuard],
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [TokenGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [TokenGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [TokenGuard],
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [TokenGuard],
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
