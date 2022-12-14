import { UsersComponent } from './components/users/users.component';
import { SitesComponent } from './components/sites/sites.component';
import { OrdersComponent } from './components/orders/orders.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AdminOverviewComponent } from './components/admin-overview/admin-overview.component';
import { ChangePasswordRequestComponent } from './components/change-password-request/change-password-request.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminOverviewComponent,
    canActivate: [AuthGuard],
    children: [
      {
          path:'',
          redirectTo: 'dashboard',
          pathMatch: 'full' 
      },
      {
        path: 'myprofile',
        component: MyprofileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sites',
        component: SitesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent

  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'changepasswordrequest',
    component: ChangePasswordRequestComponent
  },
  {
    path: 'changepassword',
    component: ChangePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
