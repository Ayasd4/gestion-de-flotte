import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Vehicule } from '../vehicule';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { VehiculeService } from '../vehicule.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-vehicule',
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
  templateUrl: './add-vehicule.component.html',
  styleUrls: ['./add-vehicule.component.css']
})
export class AddVehiculeComponent implements OnInit {
  numparc: any = undefined;
  annee: any = undefined;

  vehicule: Vehicule = {
    idvehicule: 0,
    numparc: this.numparc,
    immatricule: '',
    modele: '',
    annee: this.annee,
    etat: ''
  };

  constructor(private vehiculeService: VehiculeService, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddVehiculeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data) {
      this.vehicule = { ...this.data }; // Pré-remplir le formulaire avec les données du véhicule
    }
  }

  saveVehicule(vehiculeForm: any) {
    console.log('Données envoyées:', this.vehicule);

    if (vehiculeForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    if (this.vehicule.idvehicule) {
      // Mettre à jour un véhicule existant
      this.vehiculeService.updateVehicule(this.vehicule).subscribe(() => {
        console.log('Vehicle updated successfully!');
        this.dialogRef.close(this.vehicule);
      },
        (error: any) => {
          console.error('Error while updating vehicle:', error);
        }
      );
    } else {
      // Ajouter un nouveau véhicule
      this.vehiculeService.createVehicule(this.vehicule).subscribe(
        () => {

          this.snackBar.open('Vehicle added successfully!', 'Fermer', { duration: 9000 });
          this.dialogRef.close(this.vehicule);
        },
        (error: any) => {
          console.error('Erreur lors de la création :', error);

          if (error.status === 400 && error.error.message === 'This vehicle already exists.') {
            this.snackBar.open('This vehicle already exists!', 'Close', { duration: 9000 });
          } else {
            this.snackBar.open('An error occurred while adding.', 'Close', { duration: 9000 });
          }
        }
      );
    }
  }

}