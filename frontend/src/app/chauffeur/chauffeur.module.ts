import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { ChauffeurComponent } from './chauffeur/chauffeur.component';
import { AddChauffeurComponent } from './add-chauffeur/add-chauffeur.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AddChauffeurComponent,
    FileUploaderComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FileUploaderComponent
  ]
})
export class ChauffeurModule { }
