import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MY_DATE_FORMATS } from 'src/app/maintenance/add-diagnostic/add-diagnostic.component';
import { Ordre } from '../ordre';
import { OrdreService } from '../ordre.service';
import { AddDemandeComponent } from 'src/app/demande/add-demande/add-demande.component';
import { InfosService } from '../infos.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-ordre',
  templateUrl: './add-ordre.component.html',
  styleUrls: ['./add-ordre.component.css'],
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
export class AddOrdreComponent implements OnInit {

  capacite: any = undefined;
  matricule_techn: any = undefined;
  numparc: any = undefined;
  Disponibles: string[] = ['urgente', 'moyenne', 'faible'];

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
    travaux: {
      id_travaux: 0,
      nom_travail: '',
      type_atelier: ''
    },

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
  diagnosticList: any;
  atelierList: any;
  technicienList: any;
  travauxList: any;

  constructor(private ordreService: OrdreService,
    private infosService: InfosService,
    public dialogRef: MatDialogRef<AddDemandeComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,

  ) {

    //diagnostic 
    this.ordre.diagnostic.description_panne = data.description_panne;
    this.ordre.diagnostic.causes_panne = data.causes_panne;
    this.ordre.diagnostic.actions = data.actions;
    this.ordre.diagnostic.date_diagnostic = data.date_diagnostic;
    this.ordre.diagnostic.heure_diagnostic = data.heure_diagnostic;

    //atelier
    this.ordre.atelier.nom_atelier = data.nom_atelier;
    this.ordre.atelier.telephone = data.telephone;
    this.ordre.atelier.email = data.email;
    this.ordre.atelier.capacite = data.capacite;

    //technicien
    this.ordre.technicien.matricule_techn = data.matricule_techn;
    this.ordre.technicien.nom = data.nom;
    this.ordre.technicien.prenom = data.prenom;
    this.ordre.technicien.telephone_techn = data.telephone_techn;
    this.ordre.technicien.email_techn = data.email_techn;
    this.ordre.technicien.specialite = data.specialite;

    //works
    this.ordre.travaux.nom_travail = data.nom_travail;
    this.ordre.travaux.type_atelier = data.type_atelier;

  }

  //selection
  getDiagnostic() {
    this.infosService.fetchAllDiagnostic().subscribe({
      next: (data) => {
        console.log("List of diagnostic received", data);
        this.diagnosticList = data.map((item: any) => item.description_panne);
      },
      error: (err) => {
        console.error('Error loading diagnostics', err);
      }
    });
  }

  getAtelier() {
    this.infosService.fetchAllAtelier().subscribe({
      next: (data) => {
        console.log("List of workshops received", data);
        this.atelierList = data.map((item: any) => item.nom_atelier);
      },
      error: (err) => {
        console.error('Error loading workshops', err);
      }
    });
  }

  getTechnicien() {
    this.infosService.fetchAllTechnicien().subscribe({
      next: (data) => {
        console.log("List of technician received", data);
        this.technicienList = data.map((item: any) => item.matricule_techn);
      },
      error: (err) => {
        console.error('Error loading technicians', err);
      }
    });
  }

  getTravaux() {
    this.infosService.fetchAllTravaux().subscribe({
      next: (data) => {
        console.log("List of works received", data);

        this.travauxList = data.map((item: any) => item.nom_travail);
      },
      error: (err) => {
        console.error('Error loading works', err);
      }
    });
  }

  //infos
  getDiagnosticInfo() {
    const description_panne = this.ordre.diagnostic.description_panne;
    console.log("Diagnostic sent to the backend:", description_panne); // Vérification

    if (description_panne) {
      this.ordreService.getDiagnosticByPanne(description_panne).subscribe({
        next: (data) => {
          console.log('Diagnostic data retrieved:', data);

          if (data) {

            this.ordre.diagnostic.causes_panne = data.causes_panne;
            this.ordre.diagnostic.actions = data.actions;
            this.ordre.diagnostic.date_diagnostic = data.date_diagnostic;
            this.ordre.diagnostic.heure_diagnostic = data.heure_diagnostic;
            this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

          }
        },
        error: (err) => {
          console.error('Error retrieving diagnostic information', err);
        }
      });
    }
  }

  getAtelierInfo() {
    const nom_atelier = this.ordre.atelier.nom_atelier;
    console.log("Workshop sent to the backend:", nom_atelier); // Vérification

    if (nom_atelier) {
      this.ordreService.getAtelierByNom(nom_atelier).subscribe({
        next: (data) => {
          console.log('Workshop data retrieved:', data);

          if (data) {

            this.ordre.atelier.telephone = data.telephone;
            this.ordre.atelier.email = data.email;
            this.ordre.atelier.capacite = data.capacite;
            this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

          }
        },
        error: (err) => {
          console.error('Error retrieving workshop information', err);
        }
      });
    }
  }

  getTechnicienInfo() {
    const matricule_techn = Number(this.ordre.technicien.matricule_techn);
    console.log("Technicien sent to the backend:", matricule_techn); // Vérification

    if (matricule_techn) {
      this.ordreService.getTechnicienByMatricule(matricule_techn).subscribe({
        next: (data) => {
          console.log('Technicien data retrieved:', data);

          if (data) {

            this.ordre.technicien.nom = data.nom;
            this.ordre.technicien.prenom = data.prenom;
            this.ordre.technicien.telephone_techn = data.telephone_techn;
            this.ordre.technicien.email_techn = data.email_techn;
            this.ordre.technicien.specialite = data.specialite;
            this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

          }
        },
        error: (err) => {
          console.error('Error retrieving diagnostic information', err);
        }
      });
    }
  }

  getTravauxInfo() {
    const nom_travail = this.ordre.travaux.nom_travail;
    console.log("Works sent to the backend:", nom_travail); // Vérification

    if (nom_travail) {
      this.ordreService.getTravauxByNom(nom_travail).subscribe({
        next: (data) => {
          console.log('Works data retrieved:', data);

          if (data) {

            this.ordre.travaux.nom_travail = data.nom_travail;
            this.ordre.travaux.type_atelier = data.type_atelier;
          }
        },
        error: (err) => {
          console.error('Error retrieving works information', err);
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.ordre = { ...this.ordre, ...this.data };

      // Vérifier si les sous-objets existent sinon les initialiser
      this.ordre.diagnostic = this.ordre.diagnostic || { description_panne: '', causes_panne: '', actions: '', date_diagnostic: '', heure_diagnostic: '' };
      this.ordre.atelier = this.ordre.atelier || { nom_atelier: '', telephone: '', email: '', capacite: this.capacite, statut: '' };
      this.ordre.technicien = this.ordre.technicien || { nom: '', prenom: '', matricule_techn: this.matricule_techn, cin: '', telephone_techn: '', email_techn: '', specialite: '', date_embauche: '' };
      this.ordre.travaux = this.ordre.travaux || { nom_travail: '', type_atelier: '' };

      console.log(this.data);
    }
    this.getDiagnostic();
    this.getAtelier();
    this.getTechnicien();
    this.getTravaux();

  }

  //lorsqu'un utilisateur clique sur un bouton "Annuler" dans une boîte de dialogue pour la fermer sans valider une action.
  onNoClick(): void {
    this.dialogRef.close();
  }

  formatBackendDate(date: Date | string): string {
    if (!date) return ''; // Vérifie la validité de la date
    if (date instanceof Date && isNaN(date.getTime())) return ''; // Vérifie si la date est valide
    return moment(new Date(date)).format('YYYY/MM/DD'); // Formate au format 'YYYY/MM/DD'
  }

  saveOrder(ordreForm: any) {
    if (ordreForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 6000 });
      return;
    }

    if (!this.ordre.diagnostic || !this.ordre.atelier || !this.ordre.technicien || !this.ordre.travaux) {
      this.snackBar.open('Diagnosti, workshop, technician and works are required!', 'Close', { duration: 6000 });
    }

    const ordreToSend = {
      ...this.ordre,

      date_ordre: this.formatBackendDate(this.ordre.date_ordre),
    };

    if (this.ordre.id_ordre) {
      console.log("Mode Update, ID =", this.ordre.id_ordre);

      this.ordreService.updateOrder(ordreToSend).subscribe(
        () => {
          console.log('Order updated successfully!');
          this.snackBar.open('Order updated successfully!', 'Close', { duration: 6000 });
          this.dialogRef.close(this.ordre);
          window.location.reload();

        }, (error) => {
          console.error('Error while updating Order: ', error);
        }
      );
    } else {
      this.ordreService.createOrder(ordreToSend).subscribe({
        next: (response) => {
          if (response.diagnostic && response.atelier && response.technicien && response.travaux) {

            // Associer les ids retournés avec l'objet ordre
            this.ordre.diagnostic.id_diagnostic = response.diagnostic.id_diagnostic;
            this.ordre.atelier.id_atelier = response.atelier.id_atelier;
            this.ordre.technicien.id_technicien = response.technicien.id_technicien;
            this.ordre.travaux.nom_travail = response.travaux.nom_travail;

          }
          console.log("Order created successfully:", response);
          this.snackBar.open('Order created successfully!', 'Close', { duration: 5000 });
          this.dialogRef.close();
          window.location.reload();
        },
        error: (error) => {
          console.error("Error while creating Order :", error);
          this.snackBar.open('Error while creating Order!', 'Close', { duration: 5000 });
        }
      });
    }

  }

}
