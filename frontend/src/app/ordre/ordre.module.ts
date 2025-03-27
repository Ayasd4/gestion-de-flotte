import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdreComponent } from './ordre/ordre.component';
import { AddOrdreComponent } from './add-ordre/add-ordre.component';



@NgModule({
  declarations: [
    OrdreComponent,
    AddOrdreComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OrdreModule { }
