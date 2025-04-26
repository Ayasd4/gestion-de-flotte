import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterventionComponent } from './intervention/intervention.component';
import { AddInterventionComponent } from './add-intervention/add-intervention.component';
import { HomeComponent } from '../home/home.component';
import { ConsulterComponent } from './consulter/consulter.component';

@NgModule({
  declarations: [
    HomeComponent,
    InterventionComponent,
    AddInterventionComponent,
    ConsulterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class InterventionModule { }
