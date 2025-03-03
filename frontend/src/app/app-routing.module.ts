import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiculeComponent } from './vehicule/vehicule/vehicule.component';
import { MaintenanceComponent } from './maintenance/maintenance/maintenance.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';

export const routes: Routes = [
 //{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
 {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: {roles: 'chef de direction technique'}},
 { path: 'vehicule', component: VehiculeComponent, canActivate: [authGuard], data: {roles: 'chef de direction technique'} },
 {path: 'maintenance', component: MaintenanceComponent, canActivate: [authGuard], data: {roles: 'chef service maintenance'}},
 //{path:'consommation', component: ConsommationComponent, canActivate: [authGuard], data: {roles: ['']}},
 //{path:'kilometrage', component: KilometrageComponent, canActivate: [authGuard], data: {roles: ['']}},
 {path: 'login', component: LoginComponent},
 {path: '', redirectTo: 'login', pathMatch: 'full'},
 {path: 'forgot-password', component: ForgotPasswordComponent},
 {path: 'change-password', component: ChangePasswordComponent},
 { path: 'login-admin', component: LoginAdminComponent},
 { path: 'dashboardAdmin', component: DashboardAdminComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
