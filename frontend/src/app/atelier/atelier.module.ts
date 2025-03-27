import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtelierComponent } from './atelier/atelier.component';
import { HomeComponent } from 'src/app/home/home.component';



@NgModule({
  declarations: [
    HomeComponent,
    AtelierComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AtelierModule { }
