import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VidangeComponent } from './vidange/vidange.component';
import { AddVidangeComponent } from './add-vidange/add-vidange.component';
import { HomeComponent } from '../home/home.component';



@NgModule({
  declarations: [
    HomeComponent,
    VidangeComponent,
    AddVidangeComponent

  ],
  imports: [
    CommonModule
  ]
})
export class VidangeModule { }
