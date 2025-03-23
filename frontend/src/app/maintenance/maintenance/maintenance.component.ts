import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Demande } from 'src/app/demande/demande';
import { MaintenanceService } from '../maintenance.service';
import { UpdateMaintenanceComponent } from '../update-maintenance/update-maintenance.component';
import { MatDividerModule } from '@angular/material/divider';
import { AddDiagnosticComponent } from '../add-diagnostic/add-diagnostic.component';
import { DiagnosticService } from '../diagnostic/diagnostic.service';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    NgxUiLoaderModule

  ],

})
export class MaintenanceComponent implements AfterViewInit {
  displayedColumns: string[] = ['id_demande', 'date_demande', 'type_avarie', 'description', 'date_avarie', 'statut', 'vehicule', 'nom', 'cin', 'telephone', 'email', 'actions'];

  dataSource = new MatTableDataSource<Demande>();
  numparc: any = undefined;

  constructor(private maintenanceService: MaintenanceService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private diagnosticService: DiagnosticService,
    private ngxService: NgxUiLoaderService
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

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
      email: ''
    }

  }

  demandes: Demande[] = [];
  filteredDemandes: Demande[] = [];

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'En attente':
        return 'statut-en-attente';
      case 'En cours de traitement':
        return 'statut-en-cours';
      case 'Accepter':
        return 'statut-accepte';
      case 'Refuser':
        return 'statut-refuse';
      default:
        return '';
    }
  }


  ngAfterViewInit(): void {
    this.maintenanceService.getDemandes().subscribe((data) => {
      console.log('Données récupérées : ', data);
      this.demandes = data;
      //this.filteredDemandes = data; 
      this.dataSource = new MatTableDataSource<Demande>(data);//this.filteredDemandes
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving demand: ', error);
    });
  }

  searchDemandes(input: any) {
    input = input?.toString().trim().toLowerCase();

    this.filteredDemandes = this.demandes.filter(item => item.date_demande?.toLowerCase().includes(input)
      || item.type_avarie?.toLowerCase().includes(input)
      || item.description?.toLowerCase().includes(input)
      || item.date_avarie?.toLowerCase().includes(input)
      || item.heure_avarie?.toLowerCase().includes(input)
      || item.statut?.toLowerCase().includes(input)
      || (item.vehicule?.numparc && item.vehicule.numparc.toString().includes(input))
      || (item.vehicule?.immatricule && item.vehicule.immatricule.toLowerCase().includes(input))
      || (item.vehicule?.modele && item.vehicule.modele.toLowerCase().includes(input))
      || (item.chauffeur?.nom && item.chauffeur.nom.toLowerCase().includes(input))
      || (item.chauffeur?.prenom && item.chauffeur.prenom.toLowerCase().includes(input))
      || (item.chauffeur?.matricule_chauf && item.chauffeur.matricule_chauf.toLowerCase().includes(input))
      || (item.chauffeur?.cin && item.chauffeur.cin.toLowerCase().includes(input))
      || (item.chauffeur?.telephone && item.chauffeur.telephone.toLowerCase().includes(input))
      || (item.chauffeur?.email && item.chauffeur.email.toLowerCase().includes(input))
    );

    this.dataSource = new MatTableDataSource<Demande>(this.filteredDemandes);
  }

  updateStatus(demande: Demande) {
    const dialogRef = this.dialog.open(UpdateMaintenanceComponent, {
      width: '400px',
      data: { ...demande }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.maintenanceService.updateStatus(this.demande).subscribe(() => {
          console.log("Status of request updated successfully!");
          this.snackBar.open("Status of request updated successfully!", "close", { duration: 6000 });
          window.location.reload();
        }, (error) => {
          console.error("Error while updated status of demande", error);
        }
        );
      }
    });

  }

  diagnosticDemande(demande: any) {
    //this.ngxService.start();
    const dialogRef = this.dialog.open(AddDiagnosticComponent, {
      width: '400px',
      data: { id_demande: demande.id_demande}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diagnosticService.createDiagnostic(result).subscribe(() => {
          //this.ngxService.stop();
          console.log("Diagnostic added successfully!");
          this.snackBar.open("Diagnostic added successfully!", "Close", { duration: 5000 });
          //window.location.reload();
        },
          (error) => {
            console.log(error);
           // window.location.reload();
          });
      }
    })
  }

  /*deleteDemande(id_demande: Number){
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if(isConfirmed){
      this.maintenanceService.deleteDemande(id_demande).subscribe(()=>{
        this.demandes = this.demandes.filter(item=> item.id_demande!==id_demande);
        this.snackBar.open('Request deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      },(error)=>{
        console.error("Error while deleting Request:", error);
        
      }
    );
    }
  }*/


}









/*displayedColumns: string[] = ['id_demande', 'date_demande', 'type_avarie', 'description', 'date_avarie', 'statut', 'vehicule', 'nom', 'cin', 'telephone', 'email', 'actions'];

  dataSource = new MatTableDataSource<Demande>();
  numparc: any = undefined;

  constructor(private maintenanceService: MaintenanceService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

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
      email: ''
    }

  }

  demandes: Demande[] = [];
  filteredDemandes: Demande[] = [];

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'En attente':
        return 'statut-en-attente';
      case 'En cours de traitement':
        return 'statut-en-cours';
      case 'Accepter':
        return 'statut-accepte';
      case 'Refuser':
        return 'statut-refuse';
      default:
        return '';
    }
  }
  

  ngAfterViewInit(): void {
    this.maintenanceService.fetchAllDemandes().subscribe((data) => {
      console.log('Données récupérées : ', data);
      this.demandes = data;
      //this.filteredDemandes = data; 
      this.dataSource = new MatTableDataSource<Demande>(data);//this.filteredDemandes
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving demand: ', error);
    });

    
  }

  searchDemandes(input: any) {
    input = input?.toString().trim().toLowerCase();

    this.filteredDemandes = this.demandes.filter(item => item.date_demande?.toLowerCase().includes(input)
      || item.type_avarie?.toLowerCase().includes(input)
      || item.description?.toLowerCase().includes(input)
      || item.date_avarie?.toLowerCase().includes(input)
      || item.heure_avarie?.toLowerCase().includes(input)
      || item.statut?.toLowerCase().includes(input)
      || (item.vehicule?.numparc && item.vehicule.numparc.toString().includes(input))
      || (item.vehicule?.immatricule && item.vehicule.immatricule.toLowerCase().includes(input))
      || (item.vehicule?.modele && item.vehicule.modele.toLowerCase().includes(input))
      || (item.chauffeur?.nom && item.chauffeur.nom.toLowerCase().includes(input))
      || (item.chauffeur?.prenom && item.chauffeur.prenom.toLowerCase().includes(input))
      || (item.chauffeur?.matricule_chauf && item.chauffeur.matricule_chauf.toLowerCase().includes(input))
      || (item.chauffeur?.cin && item.chauffeur.cin.toLowerCase().includes(input))
      || (item.chauffeur?.telephone && item.chauffeur.telephone.toLowerCase().includes(input))
      || (item.chauffeur?.email && item.chauffeur.email.toLowerCase().includes(input))
    );

    this.dataSource = new MatTableDataSource<Demande>(this.filteredDemandes);
  }

  updateStatus(demande: Demande){
    const dialogRef = this.dialog.open(UpdateMaintenanceComponent,{
      width: '400px',
      data: {...demande}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.maintenanceService.updateStatus(this.demande).subscribe(()=>{
          console.log("Status of request updated successfully!");
          this.snackBar.open("Status of request updated successfully!", "close", {duration: 6000});
          window.location.reload();
        },(error) =>{
          console.error("Error while updated status of demande", error);
        }
      );
      }
    });

  }

  deleteDemande(id_demande: Number){
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if(isConfirmed){
      this.maintenanceService.deleteDemande(id_demande).subscribe(()=>{
        this.demandes = this.demandes.filter(item=> item.id_demande!==id_demande);
        this.snackBar.open('Request deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      },(error)=>{
        console.error("Error while deleted Request:", error);
        
      }
    );
    }
  }


}
*/

