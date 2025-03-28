import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiculeComponent } from './vehicule/vehicule/vehicule.component';
import { MaintenanceComponent } from './maintenance/maintenance/maintenance.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DemandeComponent } from './demande/demande/demande.component';
import { ChauffeurComponent } from './chauffeur/chauffeur/chauffeur.component';
import { DiagnosticComponent } from './maintenance/diagnostic/diagnostic.component';
import { AtelierComponent } from './atelier/atelier/atelier.component';
import { OrdreComponent } from './ordre/ordre/ordre.component';
import { TechnicienComponent } from './technicien/technicien/technicien.component';
import { InterventionComponent } from './intervention/intervention/intervention.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { roles: 'chef de direction technique' } },
  { path: 'vehicule', component: VehiculeComponent, canActivate: [authGuard], data: { roles: 'chef de direction technique' } },
  { path: 'chauffeur', component: ChauffeurComponent, canActivate: [authGuard], data: { roles: 'chef de direction technique' } },
  { path: 'atelier', component: AtelierComponent, canActivate: [authGuard], data: { roles: 'chef de direction technique' } },
  { path: 'technicien', component: TechnicienComponent, canActivate: [authGuard], data: { roles: 'chef de direction technique' } },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [authGuard], data: { roles: 'chef service maintenance' } },
  { path: 'diagnostic', component: DiagnosticComponent, canActivate: [authGuard], data: { roles: 'chef service maintenance' } },
  { path: 'ordre', component: OrdreComponent, canActivate: [authGuard], data: { roles: 'chef service maintenance' } },
  { path: 'intervention', component: InterventionComponent, canActivate: [authGuard], data: { roles: 'Responsable maintenance' } },
  { path: 'demande', component: DemandeComponent, canActivate: [authGuard], data: { roles: 'chef d’agence' } },
  //{path:'consommation', component: ConsommationComponent, canActivate: [authGuard], data: {roles: ['']}},
  //{path:'kilometrage', component: KilometrageComponent, canActivate: [authGuard], data: {roles: ['']}},
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'login-admin', component: LoginAdminComponent },
  { path: 'dashboardAdmin', component: DashboardAdminComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
