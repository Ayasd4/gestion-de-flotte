import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtatVidangeComponent } from './etat-vidange/etat-vidange.component';
import { AddEtatComponent } from './add-etat/add-etat.component';
import { HomeComponent } from '../home/home.component';



@NgModule({
  declarations: [
    HomeComponent,
    EtatVidangeComponent,
    AddEtatComponent
  ],
  imports: [
    CommonModule
  ]
})
export class EtatModule { }
