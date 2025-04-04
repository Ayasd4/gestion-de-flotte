import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatNativeDateModule, DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Diagnostic } from '../diagnostic/diagnostic';
import { DiagnosticService } from '../diagnostic/diagnostic.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  selector: 'app-add-diagnostic',
  templateUrl: './add-diagnostic.component.html',
  styleUrls: ['./add-diagnostic.component.css'],
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
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDiagnosticComponent implements OnInit {
  numparc: any = undefined;

  heureDiagnostic = new FormControl();

  diagnostic: Diagnostic = {
    id_diagnostic: 0,
    demande: {
      id_demande: 0,
      type_avarie: '',
      description: '',
      vehicule: {
        numparc: this.numparc
      }
    },
    description_panne: '',
    causes_panne: '',
    actions: '',
    date_diagnostic: '',
    heure_diagnostic: ''
  }

  constructor(private diagnosticService: DiagnosticService,
    public dialogRef: MatDialogRef<AddDiagnosticComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {
    if (data?.id_demande) {
      this.diagnostic.demande.id_demande = data.id_demande;
      this.diagnostic.demande.vehicule.numparc = data.numparc;

    }
    /*if (data && data.id_demande) {
      this.diagnostic.demande.id_demande = data.id_demande;
    }*/
  }

  getDemandeById() {

    if (!this.diagnostic.demande || !this.diagnostic.demande.id_demande) {
      console.warn("demande or id_demande is undefined. Skipping API call.");
      return;
    }

    const id_demande = this.diagnostic.demande.id_demande;
    this.diagnosticService.getDemandeById(id_demande).subscribe({
      next: (data) => {
        console.log("Request ID data retrieved:", data);
        if (data) {
          //this.diagnostic.demande.id_demande = data.id_demande;
          this.diagnostic.demande = { ...this.diagnostic.demande, ...data };

          // Vérifie et assigne numparc
          if (data.vehicule?.numparc) {
            this.diagnostic.demande.vehicule.numparc = data.vehicule.numparc;
          }
        }

      }, error: (err) => {
        console.error("Error while retrieved request id:", err);

      },
    });
  }


  ngOnInit(): void {
    if (this.data) {
      // Pré-remplir le formulaire avec les données de diagnostic
      //this.diagnostic = { ...this.data };
      this.diagnostic = { ...this.diagnostic, ...this.data };

      // Vérifie si vehicule est défini avant d'accéder à numparc
      if (this.data.demande?.vehicule?.numparc) {
        this.diagnostic.demande.vehicule.numparc = this.data.demande.vehicule.numparc;
      }

      console.log('Diagnostic Object:', this.diagnostic);

    }
    // Vérification avant d'appeler getDemandeById()
    if (this.diagnostic.demande && this.diagnostic.demande.id_demande) {
      this.getDemandeById();
    } else {
      console.warn("No demande ID provided, skipping getDemandeById()");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formatBackendDate(date: Date | string): string {
    if (!date) return ''; // Vérifie la validité de la date
    if (date instanceof Date && isNaN(date.getTime())) return ''; // Vérifie si la date est valide
    return moment(new Date(date)).format('YYYY/MM/DD'); // Formate au format 'YYYY/MM/DD'
  }

  formatBackendTime(time: string): string {
    if (!time) return ''; // Check if time exists
    return moment(time, 'HH:mm').format('HH:mm'); // Format to 'HH:mm'
  }

  saveDiagnostic(diagnosticForm: any) {

    if (diagnosticForm.invalid) {
      this.snackBar.open("All fields must be filled out!", "Close", { duration: 6000 });
      return;
    }

    this.ngxService.start();

    const diagnosticToSend = {
      ...this.diagnostic,

      date_diagnostic: this.formatBackendDate(this.diagnostic.date_diagnostic),
      heure_diagnostic: this.formatBackendTime(this.diagnostic.heure_diagnostic) // Format the time here

    };

    console.log('Données envoyées:', diagnosticToSend);

    if (this.diagnostic.id_diagnostic) {
      this.diagnosticService.updateDiagnostic(diagnosticToSend).subscribe(() => {
        this.ngxService.stop();
        console.log('Diagnostic updated successfully!');
        //window.location.reload();
        this.dialogRef.close(this.diagnostic);
        //this.router.navigate(['/diagnostic']);
      },
        (error: any) => {
          console.error('Error while updating Diagnostic:', error);
        }
      );
    } else {
      this.diagnosticService.createDiagnostic(diagnosticToSend).subscribe({
        next: (response) => {
          this.ngxService.stop();

          if (response.demande && response.demande.id_demande) {
            //this.diagnostic.demande.id_demande = response.demande.id_demande;
            console.log("Diagnostic created successfully!", response);
            this.snackBar.open("Diagnostic added successfully!", "Close", { duration: 5000 });
            //window.location.reload();
          }
          this.dialogRef.close();
          this.router.navigate(['/diagnostic']);
        },
        error: (error) => {
          console.error("error while creating diagnostic:", error);
          this.snackBar.open('Error while creating Diagnostic!', 'Close', { duration: 5000 });
        }
      });
    }
  }

}
