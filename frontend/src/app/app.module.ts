import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AddVehiculeComponent } from './vehicule/add-vehicule/add-vehicule.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { MatSelectModule } from '@angular/material/select';
import { DemandeComponent } from './demande/demande/demande.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MY_DATE_FORMATS } from './demande/add-demande/add-demande.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ChauffeurComponent } from './chauffeur/chauffeur/chauffeur.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { AddAtelierComponent } from './atelier/add-atelier/add-atelier.component';
import { TechnicienComponent } from './technicien/technicien/technicien.component';
import { AddTechnicienComponent } from './technicien/add-technicien/add-technicien.component';
import { InterventionComponent } from './intervention/intervention/intervention.component';
import { AddInterventionComponent } from './intervention/add-intervention/add-intervention.component';
import { CreateComponent } from './dasboard-admin/create/create.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    DashboardComponent,
    AddVehiculeComponent,
    ToolBarComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    LoginAdminComponent,
    DashboardAdminComponent,
    DemandeComponent,
    ChauffeurComponent,
    AddAtelierComponent,
    TechnicienComponent,
    AddTechnicienComponent,
    InterventionComponent,
    AddInterventionComponent,
    CreateComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgxUiLoaderModule.forRoot({ fgsType: 'square-jelly-box' }),
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatTooltipModule,
    MatListModule,
    MatCardModule,
    //MatTimepickerModule,

  ],

  providers: [//provideNativeDateAdapter(),
  { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
  { provide: DateAdapter, useClass: NativeDateAdapter }, // Fournir un adaptateur de date natif
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
