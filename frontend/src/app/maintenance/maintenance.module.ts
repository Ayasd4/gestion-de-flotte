import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { UpdateMaintenanceComponent } from './update-maintenance/update-maintenance.component';
import { DiagnosticComponent } from './diagnostic/diagnostic.component';
import { AddDiagnosticComponent } from './add-diagnostic/add-diagnostic.component';


@NgModule({
  declarations: [
    HomeComponent,
    MaintenanceComponent,
    UpdateMaintenanceComponent,
    DiagnosticComponent,
    AddDiagnosticComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MaintenanceModule { }
