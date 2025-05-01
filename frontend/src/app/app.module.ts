import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ChartModule } from "angular-highcharts";
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AddAtelierComponent } from "./atelier/add-atelier/add-atelier.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ChauffeurModule } from "./chauffeur/chauffeur.module";
import { ChauffeurComponent } from "./chauffeur/chauffeur/chauffeur.component";
import { FileUploaderComponent } from "./chauffeur/file-uploader/file-uploader.component";
import { AddConsomationComponent } from "./consomation/add-consomation/add-consomation.component";
import { ConsomationModule } from "./consomation/consomation.module";
import { ConsomationComponent } from "./consomation/consomation/consomation.component";
import { CreateUserDialogComponent } from "./dashboard-admin/create-user-dialog/create-user-dialog.component";
import { DashboardAdminComponent } from "./dashboard-admin/dashboard-admin.component";
import { ConsommationStatComponent } from "./dashboard/consommation-stat/consommation-stat.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DisponibiliteComponent } from "./dashboard/disponibilite/disponibilite.component";
import { OrdreStatComponent } from "./dashboard/ordre-stat/ordre-stat.component";
import { TopWidgetsComponent } from "./dashboard/top-widgets/top-widgets.component";
import { DemandeComponent } from "./demande/demande/demande.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { AddInterventionComponent } from "./intervention/add-intervention/add-intervention.component";
import { InterventionComponent } from "./intervention/intervention/intervention.component";
import { OrdersComponent } from "./intervention/orders/orders.component";
import { UpdateOrdersComponent } from "./intervention/update-orders/update-orders.component";
import { AddKilometrageComponent } from "./kilometrage/add-kilometrage/add-kilometrage.component";
import { KilometrageModule } from "./kilometrage/kilometrage.module";
import { KilometrageComponent } from "./kilometrage/kilometrage/kilometrage.component";
import { LoginAdminComponent } from "./login-admin/login-admin.component";
import { MY_DATE_FORMATS } from "./maintenance/add-diagnostic/add-diagnostic.component";
import { LoginComponent } from "./pages/login/login.component";
import { AddTechnicienComponent } from "./technicien/add-technicien/add-technicien.component";
import { TechnicienComponent } from "./technicien/technicien/technicien.component";
import { ToolBarComponent } from "./tool-bar/tool-bar.component";
import { AddVehiculeComponent } from "./vehicule/add-vehicule/add-vehicule.component";
import { AddVidangeComponent } from "./vidange/add-vidange/add-vidange.component";
import { StatComponent } from './stat/stat.component';



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
    OrdersComponent,
    UpdateOrdersComponent,
    FileUploaderComponent,
    CreateUserDialogComponent,
    ConsomationComponent,
    AddConsomationComponent,
    KilometrageComponent,
    AddKilometrageComponent,
    AddVidangeComponent,
    TopWidgetsComponent,
    DisponibiliteComponent,
    OrdreStatComponent,
    ConsommationStatComponent,
    StatComponent,
 
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
    ChauffeurModule,
    ConsomationModule,
    KilometrageModule,
    ChartModule,
    HighchartsChartModule,

  ],

  providers: [//provideNativeDateAdapter(),
  { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
  { provide: DateAdapter, useClass: NativeDateAdapter }, // Fournir un adaptateur de date natif
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
