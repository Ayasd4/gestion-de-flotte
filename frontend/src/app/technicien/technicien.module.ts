import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTechnicienComponent } from './add-technicien/add-technicien.component';
import { FileUploaderComponent } from '../chauffeur/file-uploader/file-uploader.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddTechnicienComponent,
    FileUploaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FileUploaderComponent
  ]
})
export class TechnicienModule { }
