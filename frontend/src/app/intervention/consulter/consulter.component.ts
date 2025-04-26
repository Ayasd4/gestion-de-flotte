import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Atelier } from 'src/app/atelier/atelier';
import { Demande } from 'src/app/demande/demande';
import { Diagnostic } from 'src/app/maintenance/diagnostic/diagnostic';
import { Ordre } from 'src/app/ordre/ordre';
import { Travaux } from 'src/app/ordre/travaux';
import { Technicien } from 'src/app/technicien/technicien';
import { Intervention } from '../intervention';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MY_DATE_FORMATS } from 'src/app/maintenance/add-diagnostic/add-diagnostic.component';
import { InfosService } from 'src/app/ordre/infos.service';
import { OrdreService } from 'src/app/ordre/ordre.service';
import { AddInterventionComponent } from '../add-intervention/add-intervention.component';
import { InterventionService } from '../intervention.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableDataSource } from '@angular/material/table';
import { AtelierService } from 'src/app/atelier/atelier.service';
import { DemandeService } from 'src/app/demande/demande.service';
import { DiagnosticService } from 'src/app/maintenance/diagnostic/diagnostic.service';
import { TechnicienService } from 'src/app/technicien/technicien.service';

@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrls: ['./consulter.component.css'],
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
    ScrollingModule
  ],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsulterComponent implements OnInit {
  //dataSource = new MatTableDataSource<Ordre>();

  cout_estime: any = undefined;
  capacite: any = undefined;
  matricule_techn: any = undefined;
  numparc: any = undefined;

  constructor(private interventionService: InterventionService,
    public dialogRef: MatDialogRef<AddInterventionComponent>,
    private snackBar: MatSnackBar,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any, //{ ordres: any[], interventions: any[] }
    private infosService: InfosService,
    private ordreService: OrdreService,
    private diagnosticService: DiagnosticService,
    private atelierService: AtelierService,
    private demandeService: DemandeService,
    private technicienService: TechnicienService,
    private cd: ChangeDetectorRef,

  ) {
    this.ordre.travaux.nom_travail = data.nom_travail;
    this.ordre.urgence_panne = data.urgence_panne;
    this.ordre.planning = data.planning;
    this.ordre.date_ordre = data.date_ordre;

    //numparc
    this.ordre.diagnostic.demande.vehicule.numparc = data.numparc;

    //atelier
    this.ordre.atelier.nom_atelier = data.nom_atelier;
    this.ordre.atelier.telephone = data.telephone;
    this.ordre.atelier.email = data.email;
    this.ordre.atelier.capacite = data.capacite;

    //technicien
    this.ordre.technicien.nom = data.nom;
    this.ordre.technicien.prenom = data.prenom;
    this.ordre.technicien.matricule_techn = data.matricule_techn;
    this.ordre.technicien.telephone_techn = data.telephone_techn;
    this.ordre.technicien.email_techn = data.email_techn;
    this.ordre.technicien.specialite = data.specialite;

    //works
    //this.intervention.ordre.nom_travail = data.nom_travail;

  }

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
      heure_diagnostic: '',
    },
    urgence_panne: '',
    travaux: { id_travaux: 0, nom_travail: '', type_atelier: '' },
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


  diagnostics: Diagnostic[] = [];
  ateliers: Atelier[] = [];
  travaux: Travaux[] = [];
  techniciens: Technicien[] = [];
  ordres: Ordre[] = [];
  demandes: Demande[] = [];
  interventions: Intervention[] = [];

  ngOnInit(): void {
    this.ordre = this.data.ordre; // on utilise directement l’ordre passé
    console.log("Ordre à consulter :", this.ordre);
     //this.ordre = this.ordre || { nom_travail: '', urgence_panne: '', planning: '', date_ordre: '' };
    //this.ordre.technicien = this.ordre.technicien || { nom: '', prenom: '', matricule_techn: this.matricule_techn, email_techn: '', specialite: '' };
    //this.loadAOrdresById();
    this.loadTechnicien();
    this.loadDiagnostic();
    this.loadAtelier();
    this.loadTravaux();
    this.loadDemande();
  }


  loadDiagnostic(): void {
    this.diagnosticService.fetchAllDiagnostic().subscribe(
      (data) => {
        this.diagnostics = data;
      },
      (error) => {
        console.error('Error fetching Diagnostic:', error);
      }
    );
  }

  loadAtelier(): void {
    this.atelierService.fetchAllAtelier().subscribe(
      (data) => {
        this.ateliers = data;
      },
      (error) => {
        console.error('Error fetching workshops:', error);
      }
    );
  }

  loadTechnicien(): void {
    this.technicienService.fetchAllTechnicien().subscribe(
      (data) => {
        this.techniciens = data;
      },
      (error) => {
        console.error('Error fetching technician:', error);
      }
    );
  }

  loadDemande(): void {
    this.demandeService.fetchAllDemandes().subscribe(
      (data) => {
        this.demandes = data;
      },
      (error) => {
        console.error('Error fetching technician:', error);
      }
    );
  }

  loadTravaux(): void {
    this.ordreService.fetchTravaux().subscribe(
      (data) => {
        this.travaux = data;
      },
      (error) => {
        console.error('Error fetching Works:', error);
      }
    );
  }

  /*loadAllOrdres() {
    this.ordreService.fetchAllOrders().subscribe({
      next: (data) => {
        this.ordres = data;
        this.cd.detectChanges(); // Nécessaire à cause du ChangeDetectionStrategy.OnPush
        console.log("Ordres chargés :", this.ordres);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des ordres :", err);
      }
    });
  }*/

  /*getOrdreById(id_ordre: Number) {
    this.interventionService.getOrdreById(id_ordre).subscribe({
      next: (data) => {
        console.log("Order ID data retrieved:", data);
        if (data) {
          this.ordre = { ...this.ordre, ...data };
          if (data.technicien) {
            this.ordre.technicien = { ...data.technicien };
          }

        }

      }, error: (err) => {
        console.error("Error while retrieved order id:", err);

      },
    });
  }*/

  /*loadAOrdresById() {
    //const id_ordre = this.ordre.id_ordre;
    this.interventionService.getOrdreById(this.ordre.id_ordre).subscribe({
      next: (data) => {
        console.log("Order ID data retrieved:", data);
        if (data) {
          this.ordre = { ...this.ordre, ...data };
          if (data.technicien) {
            this.ordre.technicien = { ...data.technicien };
          }

        }

      }, error: (err) => {
        console.error("Error while retrieved order id:", err);

      },
    });
  }*/

}
