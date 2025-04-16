import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Chauffeur } from '../chauffeur';
import { ChauffeurService } from '../chauffeur.service';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-chauffeur',
  templateUrl: './add-chauffeur.component.html',
  styleUrls: ['./add-chauffeur.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    RouterModule,
    FileUploaderComponent
  ],
})
export class AddChauffeurComponent implements OnInit {

  chauffeur: Chauffeur = {
    id_chauf: 0,
    nom: '',
    prenom: '',
    matricule_chauf: '',
    cin: '',
    telephone: '',
    email: '',
    image: ''
  };

  chauffeurForm: FormGroup;
  imageFile: File | null = null;
  submitted: boolean = false;
  isPhotoError = false;
  uploadError = '';

  constructor(
    private chauffeurService: ChauffeurService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddChauffeurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.chauffeurForm = this.fb.group({
      image: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.chauffeur = { ...this.data };
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChauffeur(chauffeurForm: any) {
    this.submitted = true;

    if (chauffeurForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    if (this.chauffeurForm.get('image')?.invalid) {
      this.isPhotoError = true;
      return;
    }

    const image = this.chauffeurForm.get('image')?.value;
    this.uploadError = '';

    const formData = new FormData();
    formData.append('nom', this.chauffeur.nom);
    formData.append('prenom', this.chauffeur.prenom);
    formData.append('matricule_chauf', this.chauffeur.matricule_chauf);
    formData.append('cin', this.chauffeur.cin);
    formData.append('telephone', this.chauffeur.telephone);
    formData.append('email', this.chauffeur.email);
    formData.append('image', image);

    // Si tu veux stocker le nom de l'image dans l'objet chauffeur
    this.chauffeur.image = image.name;

    if (this.chauffeur.id_chauf) {
      this.chauffeurService.updateChauffeur(this.chauffeur.id_chauf, formData).subscribe(() => {
        this.dialogRef.close(this.chauffeur);
      }, error => {
        console.error('Error while updating Driver:', error);
      });
    } else {
      this.chauffeurService.createChauffeur(formData).subscribe(() => {

        this.snackBar.open('Driver added successfully!', 'close', { duration: 9000 });
        this.dialogRef.close(this.chauffeur);
      }, (error: any) => {
        console.error('Error while creating Driver:', error);

        if (error?.error?.message === 'This Driver already exists.') {
          this.snackBar.open('This driver already exists.', 'Close', { duration: 9000 });
        } else {
          this.snackBar.open('An error occurred while adding the driver.', 'Close', { duration: 9000 });
        }
      }
    );
    }
  }

  onFileSelect(file: File) {
    this.chauffeurForm.patchValue({ image: file });
    this.chauffeurForm.get('image')?.updateValueAndValidity();
    this.chauffeur.image = file.name;
  }


}
