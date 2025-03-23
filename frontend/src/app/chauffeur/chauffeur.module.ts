import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { ChauffeurComponent } from './chauffeur/chauffeur.component';
import { AddChauffeurComponent } from './add-chauffeur/add-chauffeur.component';



@NgModule({
  declarations: [
    HomeComponent,
    ChauffeurComponent,
    AddChauffeurComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ChauffeurModule { }
