import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Demande } from "../demande";
import { DemandeService } from "../demande.service";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { AddDemandeComponent } from "../add-demande/add-demande.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";


@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css'],
  standalone: true,
  imports: [CommonModule,
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
    MatSnackBarModule
  ]
})
export class DemandeComponent implements AfterViewInit {

  displayedColumns: string[] = ['id_demande', 'date_demande', 'type_avarie', 'description', 'date_avarie', 'statut', 'vehicule', 'driver', 'actions'];
  dataSource = new MatTableDataSource<Demande>();
  numparc: any = undefined;

  constructor(private demandeService: DemandeService,
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
    this.demandeService.fetchAllDemandes().subscribe((data) => {
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

  

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDemandeComponent, {
      width: '600px',
      height: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.demandeService.createDemande(result).subscribe(
          () => {
            console.log('new demand created successfully!');
            window.location.reload();
          },
          (error) => {
            console.log(error);
            window.location.reload();
          });
      }
    });
  }

  /*getDemandes(): void {
    this.demandeService.getDemande().subscribe(
      (data: Demande[]) => {
        this.demandes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des demandes', error);
      }
    );
  }*/

  editDemande(demande: Demande) {
    const dialogRef = this.dialog.open(AddDemandeComponent, {
      width: '600px',
      height: '600px',
      data: { ...demande }, //passer les données de demande
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.demandeService.updateDemande(result).subscribe(
          () => {
            console.log("request updated!", result);
            this.snackBar.open("request updated successfully", 'close', { duration: 9000 });
            window.location.reload(); // Rafraîchir après mise à jour
          }, (error) => {
            console.error('Error while updated request', error);
          }
        );
      }
    });
  }

  deleteDemande(id_demande: Number){
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if(isConfirmed){
      this.demandeService.deleteDemande(id_demande).subscribe(()=>{
        this.demandes = this.demandes.filter(item=> item.id_demande!==id_demande);
        this.snackBar.open('Request deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      },(error)=>{
        console.error("Error while deleting Request:", error);
        
      }
    );
    }
  }

}
