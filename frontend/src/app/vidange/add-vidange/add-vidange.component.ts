import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Vehicule } from 'src/app/vehicule/vehicule';
import { Vidange } from '../vidange';
import { VidangeService } from '../vidange.service';
import { NumparcService } from 'src/app/services/numparc.service';
import * as moment from 'moment';

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
  selector: 'app-add-vidange',
  templateUrl: './add-vidange.component.html',
  styleUrls: ['./add-vidange.component.css'],
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
export class AddVidangeComponent implements OnInit {
  numparc: any = undefined;
  date_vidange: any = undefined;
  km_vidange: any = undefined;
  numparcList: number[] = [];


  vidange: Vidange = {
    id_vd: 0,
    vehicule: {
      idvehicule: 0,
      numparc: this.numparc
    },
    date_vidange: '',
    km_vidange: this.km_vidange
  }

  vidanges: Vidange[] = [];

  constructor(private vidangeService: VidangeService,
    private numparcService: NumparcService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddVidangeComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,

  ) {
    this.vidange.vehicule.numparc = data.numparc;

    this.vidange.date_vidange = data.date_vidange;
    this.vidange.km_vidange = data.km_vidange;

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

  ngOnInit(): void {
    if (this.data) {
      this.vidange = { ...this.vidange, ...this.data };

      this.vidange.vehicule = this.vidange.vehicule || { numparc: '' };

      console.log(this.vidange);
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

  saveVidange(vidangeForm: any) {

    if (vidangeForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    if (!this.vidange.vehicule.numparc) {
      this.snackBar.open('Vehicle are required!', 'Close', { duration: 9000 });
      return;
    }

    const demandeToSend = {
      ...this.vidange,

      date_vidange: this.formatBackendDate(this.vidange.date_vidange)
    };

    console.log('Données envoyées:', demandeToSend);

    if (this.vidange.id_vd) {
      this.vidangeService.updateVidange(demandeToSend).subscribe(() => {
        console.log('oil change updated successfully!');
        this.snackBar.open('Oil change updated successfully!', 'Close', { duration: 9000 });
        this.dialogRef.close(this.vidange);
        window.location.reload();

      }, (error) => {
        console.error('Error while updating oil change: ', error);
      }
      );
    } else {
      this.vidangeService.createVidange(demandeToSend).subscribe({
        next: (response) => {
          if (response.vehicule) {
            this.vidange.vehicule.idvehicule = response.vehicule.idvehicule;
          }
          console.log("Oil change created successfully:", response);
          this.snackBar.open('Oil change created successfully!', 'Close', { duration: 5000 });
          this.dialogRef.close();
          window.location.reload();
        },
        
        error: (error) => {
          console.error("Error while creating oil change :", error);
          this.snackBar.open('Error while creating oil change!', 'Close', { duration: 5000 });
        }
      });
    }
  }

}
