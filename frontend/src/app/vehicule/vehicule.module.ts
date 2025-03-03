import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { VehiculeComponent } from './vehicule/vehicule.component';



@NgModule({
  declarations: [
    HomeComponent,
    VehiculeComponent,
    //AddVehiculeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class VehiculeModule { }
