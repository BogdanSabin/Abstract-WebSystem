import { ChangePasswordRequestComponent } from './components/change-password-request/change-password-request.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
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
