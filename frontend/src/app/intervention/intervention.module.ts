import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterventionComponent } from './intervention/intervention.component';
import { AddInterventionComponent } from './add-intervention/add-intervention.component';
import { HomeComponent } from '../home/home.component';

@NgModule({
  declarations: [
    HomeComponent,
    InterventionComponent,
    AddInterventionComponent
  ],
  imports: [
    CommonModule
  ]
})
export class InterventionModule { }
