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

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  chauffeur: Chauffeur = {
    id_chauf: 0,
    nom: '',
    prenom: '',
    matricule_chauf: '',
    cin: '',
    telephone: '',
    email: '',
    image: ''
  }

  imageFile: File | null = null;
  imagePreview: string | null = null;
  uploadError: string | null = null;
  submitted = false;
  chauffeurForm!: FormGroup;
  isPhotoError: boolean = false;
  constructor(private chauffeurService: ChauffeurService, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddChauffeurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.chauffeurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      matricule_chauf: ['', Validators.required],
      cin: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', Validators.required],
      image: ['', Validators.required],
      // Ajoute d'autres champs ici si nécessaire
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  @ViewChild('fileUploader', { static: false }) fileUploader!: ElementRef<HTMLElement>;


  triggerClick() {
    let fileElement: HTMLElement = this.fileUploader.nativeElement;
    fileElement.click();
  }

  /*onFileSelect(event: any) {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    if (file) {
      this.chauffeurForm.patchValue({ photo: file });
      this.chauffeurForm.get('photo')?.updateValueAndValidity();
    }
  }*/
  selectedFileName: string = 'Aucun fichier choisi';


  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

    ngOnInit(): void {
      if(this.data) {
      this.chauffeur = { ...this.data }
    }

  }

  saveChauffeur(chauffeurForm: any) {
    console.log('Données envoyées:', this.chauffeur);

    this.submitted = true; // Ajout de cette ligne

    if (chauffeurForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    /*if (!this.imageFile) {
      this.uploadError = "Photo is required";
      return;
    }*/

    if (this.chauffeurForm.get('image')?.invalid) {
      this.isPhotoError = true;
    }

    this.uploadError = '';
    const formData = new FormData();
    formData.append('nom', this.chauffeur.nom);
    formData.append('prenom', this.chauffeur.prenom);
    formData.append('matricule_chauf', this.chauffeur.matricule_chauf);
    formData.append('cin', this.chauffeur.cin);
    formData.append('telephone', this.chauffeur.telephone);
    formData.append('email', this.chauffeur.email);
    formData.append('image', this.chauffeurForm.get('image')?.value); // Ajout du fichier image

    /*const imageBlob = this.fileInput.nativeElement.files[0];
    const file = new FormData();
    file.set('file', imageBlob)*/

    if (this.chauffeur.id_chauf) {
      this.chauffeurService.updateChauffeur(this.chauffeur).subscribe(() => {
        console.log('Driver updated successfully!');
        this.dialogRef.close(this.chauffeur);
      },
        (error: any) => {
          console.error('Error while updated Driver:', error);
        }
      );
    } else {
      this.chauffeurService.createChauffeur(this.chauffeur).subscribe(
        () => {
          this.snackBar.open('Driver added successfully!', 'close', { duration: 9000 });
          this.dialogRef.close(this.chauffeur);
        },
        (error: any) => {
          console.error('Error while creation Driver :', error);
        }
      );
    }
  }

}
