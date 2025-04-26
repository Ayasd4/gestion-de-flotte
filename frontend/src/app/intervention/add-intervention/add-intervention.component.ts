import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Intervention } from '../intervention';
import { InterventionService } from '../intervention.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MY_DATE_FORMATS } from 'src/app/maintenance/add-diagnostic/add-diagnostic.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { InfosService } from 'src/app/ordre/infos.service';
import { OrdreService } from 'src/app/ordre/ordre.service';

@Component({
  selector: 'app-add-intervention',
  templateUrl: './add-intervention.component.html',
  styleUrls: ['./add-intervention.component.css'],
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
    //MatTimepickerModule

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddInterventionComponent implements OnInit {
  matricule_techn: any = undefined;
  capacite: any= undefined;
  selected = "En attente";

  statutsDisponibles: string[] = ['En cours', 'Planifier', 'Terminer', 'Annuler'];

  intervention: Intervention = {
    id_intervention: 0,
    ordre: {
      id_ordre: 0,
      diagnostic: {
        id_diagnostic: 0,
        demande: {
          vehicule: { numparc: 0 }
        },
      },
      nom_travail: '',
      //travaux: { id_travaux: 0, nom_travail: '', type_atelier: '' },
      urgence_panne: '',
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
    },
    technicien: {
      id_technicien: 0,
      nom: '',
      prenom: '',
      matricule_techn: this.matricule_techn,
      email_techn: '',
      specialite: '',
    },
    date_debut: '',
    heure_debut: '',
    date_fin: '',
    heure_fin: '',
    status_intervention: '',
    commentaire: ''
  }
  ordreList: any;
  technicienList: any;
  travauxList: any;

  constructor(private interventionService: InterventionService,
    public dialogRef: MatDialogRef<AddInterventionComponent>,
    private snackBar: MatSnackBar,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private infosService: InfosService,
    private ordreService: OrdreService,
    private cd: ChangeDetectorRef,

  ) {
    /*if (data?.id_ordre) {
      this.intervention.ordre.id_ordre = data.id_ordre;
    }*/
    //ordre
    this.intervention.ordre.nom_travail = data.nom_travail;
    this.intervention.ordre.urgence_panne = data.urgence_panne;
    this.intervention.ordre.planning = data.planning;
    this.intervention.ordre.date_ordre = data.date_ordre;

    //technicien
    this.intervention.technicien.matricule_techn = data.matricule_techn;
    this.intervention.technicien.nom = data.nom;
    this.intervention.technicien.prenom = data.prenom;
    this.intervention.technicien.email_techn = data.email_techn;
    this.intervention.technicien.specialite = data.specialite;

    //travaux
    //this.intervention.ordre.travaux.nom_travail = data.nom_travail;
    //this.intervention.ordre.travaux.type_atelier = data.type_atelier;

  }

  getOrdre() {
    this.interventionService.fetchAllOrdre().subscribe({
      next: (data) => {
        console.log("List of Order received", data);
        this.ordreList = data.map((item: any) => item.travaux);
      },
      error: (err) => {
        console.error('Error loading Order', err);
      }
    });
  }

  getTechnicien() {
    this.interventionService.fetchAllTechnicien().subscribe({
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
  getOrdreInfo() {
    //const nom_travail = this.intervention.ordre.travaux.nom_travail;
    const nom_travail = this.intervention.ordre.nom_travail;

    console.log("Order sent to the backend:", nom_travail); // Vérification

    if (nom_travail) {
      this.interventionService.getOrdreByTravaux(nom_travail).subscribe({
        next: (data) => {
          console.log('Order data retrieved:', data);

          if (data) {
            //this.intervention.ordre.travaux = data.travaux;
            this.intervention.ordre.urgence_panne = data.urgence_panne;
            this.intervention.ordre.planning = data.planning;
            this.intervention.ordre.date_ordre = data.date_ordre;
            this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

          }
        },
        error: (err) => {
          console.error('Error retrieving Order information', err);
        }
      });
    }
  }

  getTechnicienInfo() {
    const matricule_techn = Number(this.intervention.technicien.matricule_techn);
    console.log("Technicien sent to the backend:", matricule_techn); // Vérification

    if (matricule_techn) {
      this.interventionService.getTechnicienByMatricule(matricule_techn).subscribe({
        next: (data) => {
          console.log('Technicien data retrieved:', data);

          if (data) {

            this.intervention.technicien.nom = data.nom;
            this.intervention.technicien.prenom = data.prenom;
            this.intervention.technicien.email_techn = data.email_techn;
            this.intervention.technicien.specialite = data.specialite;
            this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

          }
        },
        error: (err) => {
          console.error('Error retrieving diagnostic information', err);
        }
      });
    }
  }


  getOrdreById() {
    
    if (!this.intervention.ordre || !this.intervention.ordre.id_ordre) {
      console.warn("Order or id_order is undefined. Skipping API call.");
      return;
    }

    const id_ordre = this.intervention.ordre.id_ordre;
    this.interventionService.getOrdreById(id_ordre).subscribe({
      next: (data) => {
        console.log("Order ID data retrieved:", data);
        if (data) {
          this.intervention.ordre = { ...this.intervention, ...data };

          if (data.technicien) {
            this.intervention.technicien = { ...data.technicien };
          }

        }

      }, error: (err) => {
        console.error("Error while retrieved order id:", err);

      },
    });
  }

  getTravauxInfo() {
    const nom_travail = this.intervention.ordre.nom_travail;
    console.log("Works sent to the backend:", nom_travail); // Vérification

    if (nom_travail) {
      this.ordreService.getTravauxByNom(nom_travail).subscribe({
        next: (data) => {
          console.log('Works data retrieved:', data);

          if (data) {

            this.intervention.ordre.urgence_panne = data.urgence_panne;
            this.intervention.ordre.planning = data.planning;
            this.intervention.ordre.date_ordre = data.date_ordre;
            //this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

          }
        },
        error: (err) => {
          console.error('Error retrieving works information', err);
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.data && this.data.id_intervention) {
      this.intervention = { ...this.intervention, ...this.data };

      // Vérifier si les sous-objets existent sinon les initialiser
      this.intervention.ordre = this.intervention.ordre || { nom_travail: '', urgence_panne: '', planning: '', date_ordre: '' };
      this.intervention.technicien = this.intervention.technicien || { nom: '', prenom: '', matricule_techn: this.matricule_techn, email_techn: '', specialite: '' };
      //this.intervention.ordre.travaux = this.intervention.ordre.travaux || { nom_travail: '', type_atelier: '' };

      // Récupérer l'ordre et les informations du technicien uniquement en mode update
      //      if (this.intervention.ordre?.id_ordre) {

      if (this.intervention.ordre?.nom_travail) {
        this.getOrdreInfo();  // Appel pour récupérer les informations de l'ordre
      }

      if (this.intervention.technicien?.matricule_techn) {
        this.getTechnicienInfo();  // Appel pour récupérer les informations du technicien
      }

      console.log(this.data);
    }
    this.getOrdre();
    this.getTechnicien();
    this.getTravaux();

    // Vérification avant d'appeler getOrdreById()
    /*if (this.intervention.ordre && this.intervention.ordre.id_ordre) {
      this.getOrdreById();
    } else {
      console.warn("No Order ID provided, skipping getOrdreById()");
    }*/
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

  formatBackendTime(time: string): string {
    if (!time) return ''; // Check if time exists
    return moment(time, 'HH:mm').format('HH:mm'); // Format to 'HH:mm'
  }

  saveIntervention(interventionForm: any) {
    if (interventionForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 6000 });
      return;
    }

    this.ngxService.start();

    if (!this.intervention || !this.intervention.technicien) {
      this.snackBar.open('intervention and technician are required!', 'Close', { duration: 6000 });
    }

    const interventionToSend = {
      ...this.intervention,

      date_debut: this.formatBackendDate(this.intervention.date_debut),
      date_fin: this.formatBackendDate(this.intervention.date_fin),
      heure_debut: this.formatBackendTime(this.intervention.heure_debut),
      heure_fin: this.formatBackendTime(this.intervention.heure_fin),

    };

    if (this.intervention.id_intervention) {
      console.log("Mode Update, ID =", this.intervention.id_intervention);

      this.interventionService.updateIntervention(interventionToSend).subscribe(
        () => {
          this.ngxService.stop();
          console.log('Intervention updated successfully!');
          this.snackBar.open('Intervention updated successfully!', 'Close', { duration: 6000 });
          this.dialogRef.close(this.intervention);
          window.location.reload();

        }, (error) => {
          console.error('Error while updating Order: ', error);
        }
      );
    } else {
      this.interventionService.createIntervention(interventionToSend).subscribe({
        next: (response) => {
          this.ngxService.stop();

          if (response.ordre && response.technicien) {
            // Associer les ids retournés avec l'objet ordre
            this.intervention.ordre.id_ordre = response.ordre.id_ordre;
            this.intervention.technicien.id_technicien = response.technicien.id_technicien;

            console.log("Intervention created successfully:", response);
            this.snackBar.open('Intervention created successfully!', 'Close', { duration: 5000 });

          }
          window.location.reload();
          this.dialogRef.close();
          //this.router.navigate(['/intervention']);
        },
        error: (error) => {
          console.error("Error while creating Intervention :", error);
          this.snackBar.open('Error while creating Intervention!', 'Close', { duration: 5000 });
        }
      });
    }
  }

}