import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { VehiculeService } from 'src/app/vehicule/vehicule.service';
import { VidangeService } from 'src/app/vidange/vidange.service';
import { Etat } from '../etat';
import { EtatService } from '../etat.service';
import { NumparcService } from 'src/app/services/numparc.service';
import { AddVidangeComponent } from 'src/app/vidange/add-vidange/add-vidange.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD', // Le format pour l'entrée
  },
  display: {
    dateInput: 'YYYY/MM/DD', // Le format pour l'affichage
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-etat',
  templateUrl: './add-etat.component.html',
  styleUrls: ['./add-etat.component.css'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter }, // Fournir un adaptateur de date natif
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEtatComponent implements OnInit {

  numparc: any = undefined;
  km_vidange: any = undefined;
  vehiculeId: any = undefined;
  calcul: any = undefined;
  km_prochaine_vd: any = undefined;
  reste_km: any = undefined;
  numparcList: number[] = [];

  etat: Etat = {
    id_vidange: 0,
    vehicule: {
      idvehicule: 0,
      numparc: this.numparc
    },
    kilometrage: {
      id: 0,
      vehiculeId: this.vehiculeId,
      calcul: this.calcul
    },
    km_derniere_vd: {
      km_vidange: this.km_vidange
    },
    km_prochaine_vd: this.km_prochaine_vd,
    reste_km: this.reste_km,
    date: ''
  }

  etats: Etat[] = [];

  constructor(private etatService: EtatService,
    private numparcService: NumparcService,
    public dialogRef: MatDialogRef<AddEtatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {

    //vehicule
    this.etat.vehicule.numparc = data.numparc;

    //kilometrage
    this.etat.kilometrage.vehiculeId = data.vehiculeId;
    this.etat.kilometrage.calcul = data.calcul;

    //vidange
    this.etat.km_derniere_vd.km_vidange = data.km_vidange;

    //etat
    this.etat.km_prochaine_vd = data.km_prochaine_vd;
    this.etat.reste_km = data.reste_km;
    this.etat.date = data.date;

  }

  getNumparc() {
    this.numparcService.fetchAllNumparc().subscribe({
      next: (data) => {
        console.log('List of numparc received:', data);  // Vérifiez si les données sont bien récupérées
        //this.numparcList = data;
        this.numparcList = data.map((item: any) => item.numparc);
      },
      error: (err) => {
        console.error('Error loading numparcs', err);
      }
    });
  }

  getKilometrageByNumparc() {
    const numparc = this.etat.vehicule.numparc;
    this.etatService.fetchKilometrageByNumparc(numparc).subscribe({
      next: (data) => {
        console.log('kilométrage récupérer:', this.etat.kilometrage);

        if (data) {
          this.etat.kilometrage.calcul = data.calcul;
          this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du kilométrage :', err);
      }
    })
  }

  ngOnInit(): void {
    if (this.data) {
      this.etat = { ...this.etat, ...this.data };

      this.etat.vehicule = this.etat.vehicule || { numparc: '' };
      this.etat.kilometrage = this.etat.kilometrage || { vehiculeId: this.vehiculeId, calcul: this.vehiculeId };
      this.etat.km_derniere_vd = this.etat.km_derniere_vd || { km_vidange: this.km_vidange };

      console.log(this.etat);
    }

    this.getNumparc();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formatBackendDate(date: Date | string): string {
    if (!date) return ''; // Vérifie la validité de la date
    if (date instanceof Date && isNaN(date.getTime())) return ''; // Vérifie si la date est valide
    return moment(new Date(date)).format('YYYY/MM/DD'); // Formate au format 'YYYY/MM/DD'
  }

  saveEtat(etatForm: any) {

    if (etatForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    /*if (!this.etat.vehicule.numparc || !this.etat.kilometrage.calcul) {
      this.snackBar.open('Vehicle or km are required!', 'Close', { duration: 9000 });
      return;
    }*/

    const etatToSend = {
      ...this.etat,

      date: this.formatBackendDate(this.etat.date)
    };

    console.log('Données envoyées:', etatToSend);


    if (this.etat.id_vidange) {
      this.etatService.updateEtat(etatToSend).subscribe(() => {

        console.log('planning updated successfully!');
        this.snackBar.open('planning updated successfully!', 'Close', { duration: 9000 });
        this.dialogRef.close(this.etat);
        window.location.reload();

      }, (error) => {
        console.error('Error while updating planning: ', error);
      }
      );
    } else {
      this.etatService.createEtat(etatToSend).subscribe({
        next: (response) => {
          if (response.vehicule && response.kilometrage) {

            // Associer les ids retournés avec l'objet etat
            this.etat.vehicule.idvehicule = response.vehicule.idvehicule;
            this.etat.kilometrage.id = response.kilometrage.id;

          }
          console.log("planning created successfully:", response);
          this.snackBar.open('planning created successfully!', 'Close', { duration: 9000 });
          this.dialogRef.close();
          window.location.reload();
        },

        error: (error) => {
          console.error("Error while creating planning :", error);

          if (error.status === 400 && error.error?.error === "Matching mileage not found!") {
            this.snackBar.open('Matching mileage not found for this vehicle!', 'Close', { duration: 9000 });
          } else {
            this.snackBar.open('Error while creating planning!', 'close', { duration: 9000 });
          }
        }
      });
    }
  }

}
