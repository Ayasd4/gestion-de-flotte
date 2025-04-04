import { Component, Inject, OnInit } from '@angular/core';
import { Demande } from 'src/app/demande/demande';
import { MaintenanceService } from '../maintenance.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-maintenance',
  templateUrl: './update-maintenance.component.html',
  styleUrls: ['./update-maintenance.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,

  ],
})
export class UpdateMaintenanceComponent implements OnInit {

  statutsDisponibles: string[] = ['En attente', 'En cours de traitement', 'Accepter', 'Refuser'];

  numparc: any = undefined;

  demande: Demande = {
    id_demande: 0,
    date_demande: '',
    type_avarie: '',
    description: '',
    date_avarie: '',
    heure_avarie: '',
    statut: '',
    vehicule: {
      idvehicule: 0,
      numparc: this.numparc,
      immatricule: '',
      modele: '',
      annee: 0,
      etat: ''
    },
    chauffeur: {
      id_chauf: 0,
      nom: '',
      prenom: '',
      matricule_chauf: '',
      cin: '',
      telephone: '',
      email: '',
      image: ''
    }
  }

  constructor(private maintenanceService: MaintenanceService,
    public dialogRef: MatDialogRef<UpdateMaintenanceComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.demande = { ...this.data }; // Pré-remplir le formulaire avec les données du demande

      console.log(this.demande);
    }
  }

  saveDemande(demandeForm: any) {
    if (demandeForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 6000 });
      return;
    }

    if (this.demande.id_demande) {
      this.maintenanceService.updateStatus(this.demande).subscribe(() => {
        console.log('Status of request updated successfully!');
        this.snackBar.open('Status of request updated successfully!', 'Close', { duration: 9000 });
        this.dialogRef.close(this.demande);
      },(error)=>{
        console.error('Error while updating status of request: ', error);
        this.snackBar.open('Error while updating status of request!', 'Close', { duration: 9000 });
      }
    );
    }
  }

}
