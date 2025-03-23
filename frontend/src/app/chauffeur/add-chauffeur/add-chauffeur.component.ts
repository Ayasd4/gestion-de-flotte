import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Chauffeur } from '../chauffeur';
import { ChauffeurService } from '../chauffeur.service';

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
    MatSnackBarModule
  ],
})
export class AddChauffeurComponent implements OnInit{

  chauffeur: Chauffeur = {
    id_chauf: 0,
    nom: '',
    prenom: '',
    matricule_chauf: '',
    cin: '',
    telephone: '',
    email: ''
  }

  constructor(private chauffeurService: ChauffeurService, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddChauffeurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if(this.data) {
      this.chauffeur = {...this.data}
    }
  }

  saveChauffeur(chauffeurForm: any){
    console.log('Données envoyées:', this.chauffeur);

    if (chauffeurForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    if(this.chauffeur.id_chauf){
      this.chauffeurService.updateChauffeur(this.chauffeur).subscribe(()=>{
        console.log('Driver updated successfully!');
        this.dialogRef.close(this.chauffeur);
      },
      (error: any) => {
        console.error('Error while updated Driver:', error);
      }
    );
    }else{
      this.chauffeurService.createChauffeur(this.chauffeur).subscribe(
        () => {
          this.snackBar.open('Driver added successfully!', 'Fermer', { duration: 9000 });
          this.dialogRef.close(this.chauffeur);
        },
        (error: any) => {
          console.error('Error while creation Driver :', error);
        }
      );
    }
  }

}
