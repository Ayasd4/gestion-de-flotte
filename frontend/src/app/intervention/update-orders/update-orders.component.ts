import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddOrdreComponent } from 'src/app/ordre/add-ordre/add-ordre.component';
import { Ordre } from 'src/app/ordre/ordre';
import { OrdreService } from 'src/app/ordre/ordre.service';

@Component({
  selector: 'app-update-orders',
  templateUrl: './update-orders.component.html',
  styleUrls: ['./update-orders.component.css'],
  standalone: true,
  imports: [CommonModule,
      FormsModule,
      MatDialogModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatSelectModule,
      MatOptionModule,
      MatSnackBarModule,

  ]
})
export class UpdateOrdersComponent implements OnInit {

  statutsDisponibles: string[] = ['Ouvert', 'En cours', 'Fermé'];

  cout_estime: any = undefined;
  capacite: any = undefined;
  matricule_techn: any = undefined;
  numparc: any= undefined;

  constructor(private ordreService: OrdreService,
    public dialogRef: MatDialogRef<UpdateOrdersComponent>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ordre: Ordre = {
    id_ordre: 0,
    diagnostic: {
      id_diagnostic: 0,
      demande: {
        id_demande: 0,
        type_avarie: '',
        description: '',
        vehicule: { numparc: this.numparc }
      },
      description_panne: '',
      causes_panne: '',
      actions: '',
      date_diagnostic: '',
      heure_diagnostic: ''
    },
    urgence_panne: '',
    travaux: {id_travaux: 0, nom_travail: '', type_atelier: ''},
    planning: '',
    date_ordre: '',
    status: '',
    atelier: {
      id_atelier: 0,
      nom_atelier: '',
      telephone: '',
      email: '',
      capacite: this.capacite,
      statut: ''
    },
    technicien: {
      id_technicien: 0,
      nom: '',
      prenom: '',
      matricule_techn: this.matricule_techn,
      cin: '',
      telephone_techn: '',
      email_techn: '',
      specialite: '',
      date_embauche: '',
      image: ''
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ouvert':
        return 'status-ouvert';
      case 'En cours':
        return 'status-en-cours';
      case 'Fermé':
        return 'status-ferme';
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.ordre = { ...this.data }; // Pré-remplir le formulaire avec les données du demande

      console.log(this.ordre);
    }
  }

  saveOrdre(ordreForm: any) {
    if (ordreForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 6000 });
      return;
    }

    if (this.ordre.id_ordre) {
      this.ordreService.updateStatus(this.ordre).subscribe(() => {
        console.log('Status of Order updated successfully!');
        this.snackBar.open('Status of Order updated successfully!', 'Close', { duration: 9000 });
        this.dialogRef.close(this.ordre);
      }, (error) => {
        console.error('Error while updating status of Order: ', error);
        this.snackBar.open('Error while updating status of Order!', 'Close', { duration: 9000 });
      }
      );
    }
  }

}
