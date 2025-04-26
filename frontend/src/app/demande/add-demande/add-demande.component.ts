import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { DemandeService } from '../demande.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Demande } from '../demande';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import * as moment from 'moment';
import { NumparcService } from 'src/app/services/numparc.service';
import { MatStepperModule } from '@angular/material/stepper';

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
  selector: 'app-add-demande',
  templateUrl: './add-demande.component.html',
  styleUrls: ['./add-demande.component.css'],
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

    //MatTimepickerModule

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDemandeComponent implements OnInit {
  numparc: any = undefined;
  //form = FormGroup;
  numparcList: number[] = [];
  nameList: number[] = [];
  id_demande: number = 1;
  isDataLoaded: boolean = false;


  selected = "En attente";
  //  vehiculeInfo: any = null; // Stocke les infos du véhicule sélectionné


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

  selectedVehicule: any;
  selectedChauffeur: any;
  dateAvarie: any;
  dateDemande: any;
  heureAvarie: any;
  typeAvarie: any;
  description: any;

  vehicule: any;
  chauffeur: any;
  //demandeForm: FormGroup;

  constructor(private demandeService: DemandeService,
    private numparcService: NumparcService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDemandeComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,

  ) {

    //vehicule
    this.demande.vehicule.numparc = data.numparc;
    this.demande.vehicule.immatricule = data.immatricule;
    this.demande.vehicule.modele = data.modele;

    //chauffeur
    this.demande.chauffeur.nom = data.nom;
    this.demande.chauffeur.prenom = data.prenom;
    this.demande.chauffeur.matricule_chauf = data.matricule_chauf;
    this.demande.chauffeur.cin = data.cin;
    this.demande.chauffeur.telephone = data.telephone;
    this.demande.chauffeur.email = data.email;
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

  getName() {
    this.numparcService.fetchAllName().subscribe({
      next: (data) => {
        console.log('Liste des nom reçue:', data);  // Vérifiez si les données sont bien récupérées
        //this.numparcList = data;
        this.nameList = data.map((item: any) => item.nom);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des nom', err);
      }
    });
  }

  getVehiculeInfo() {
    const numparc = Number(this.demande.vehicule.numparc);
    console.log("Numparc sent to the backend :", numparc); // Vérification

    if (numparc) {
      this.demandeService.getVehiculeByNumparc(numparc.toString()).subscribe({
        next: (data) => {
          console.log('Vehicle data retrieved:', data);

          if (data) {
            this.demande.vehicule.numparc = data.numparc;
            this.demande.vehicule.immatricule = data.immatricule;
            this.demande.vehicule.modele = data.modele;
            this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

          }
        },
        error: (err) => {
          console.error('Error retrieving vehicle information', err);
        }
      });
    }
  }

  getChauffeurInfo() {
    const nom = this.demande.chauffeur.nom;
    if (!nom) return;

    this.demandeService.getChauffeurByNom(nom).subscribe({
      next: (data) => {
        console.log('Données du chauffeur récupérées:', data);
        if (data) {
          this.demande.chauffeur.nom = data.nom;
          this.demande.chauffeur.prenom = data.prenom;
          this.demande.chauffeur.matricule_chauf = data.matricule_chauf;
          this.demande.chauffeur.cin = data.cin;
          this.demande.chauffeur.telephone = data.telephone;
          this.demande.chauffeur.email = data.email;
          this.cd.markForCheck(); // pour que l'UI se mette à jour avec OnPush

        }
      },
      error: (err) => {
        console.error('Erreur de récupération du chauffeur', err);
      }
    });
    this.cd.detectChanges();

  }


  ngOnInit(): void {

    if (this.data) {
      this.demande = { ...this.demande,...this.data }; // Pré-remplir le formulaire avec les données du demande

      // Vérifier si les sous-objets existent sinon les initialiser
      this.demande.vehicule = this.demande.vehicule || { numparc: '', immatricule: '', modele: '' };
      this.demande.chauffeur = this.demande.chauffeur || { nom: '', prenom: '', matricule_chauf: '', cin: '', telephone: '', email: '' };


      console.log(this.demande);
    }
    this.getNumparc();
    this.getName();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  formatBackendDate(date: Date | string): string {
    if (!date) return ''; // Vérifie la validité de la date
    if (date instanceof Date && isNaN(date.getTime())) return ''; // Vérifie si la date est valide
    return moment(new Date(date)).format('YYYY/MM/DD'); // Formate au format 'YYYY/MM/DD'
  }



  saveDemande(demandeForm: any) {

    if (demandeForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }
    
    //ajouter
    //this.dialogRef.close(this.demandeForm.getRawValue());


    if (!this.demande.vehicule.numparc || !this.demande.chauffeur.nom) {
      this.snackBar.open('Vehicle and driver are required!', 'Close', { duration: 9000 });
      return;
    }

    // Lors de l'envoi des données, tu formates les dates
    const demandeToSend = {
      ...this.demande,

      date_demande: this.formatBackendDate(this.demande.date_demande),
      date_avarie: this.formatBackendDate(this.demande.date_avarie),
    };


    console.log('Données envoyées:', demandeToSend);

    if (this.demande.id_demande) {
      console.log("Mode Update, ID =", this.demande.id_demande);

      this.demandeService.updateDemande(demandeToSend).subscribe(
        () => {
          console.log('Request updated successfully!');
          this.snackBar.open('Request updated successfully!', 'Close', { duration: 9000 });
          this.dialogRef.close(this.demande);
          window.location.reload();

        }, (error) => {
          console.error('Error while updating request: ', error);
        }
      );
    } else {
      console.log("Mode création");
      this.demandeService.createDemande(demandeToSend).subscribe({
        next: (response) => {
          if (response.vehicule && response.chauffeur) {

            // Associer les ids retournés avec l'objet demande
            this.demande.vehicule.idvehicule = response.vehicule.idvehicule;
            this.demande.chauffeur.id_chauf = response.chauffeur.id_chauf;
          }
          console.log("Request created successfully:", response);
          this.snackBar.open('Request created successfully!', 'Close', { duration: 9000 });
          this.dialogRef.close();
          window.location.reload();
        },
        error: (error) => {
          console.error("Error while creating Request :", error);
          this.snackBar.open('Error while creating Request!', 'Close', { duration: 9000 });
        }
      });
    }
  }

}