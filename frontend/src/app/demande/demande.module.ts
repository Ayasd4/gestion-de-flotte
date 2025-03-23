import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { DemandeComponent } from './demande/demande.component';
import { AddDemandeComponent } from './add-demande/add-demande.component';



@NgModule({
  declarations: [
    HomeComponent,
    DemandeComponent,
    AddDemandeComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DemandeModule { }
