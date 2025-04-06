import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddOrdreComponent } from 'src/app/ordre/add-ordre/add-ordre.component';
import { Ordre } from 'src/app/ordre/ordre';
import { OrdreService } from 'src/app/ordre/ordre.service';
import { UpdateOrdersComponent } from '../update-orders/update-orders.component';
import { AddInterventionComponent } from '../add-intervention/add-intervention.component';
import { InterventionService } from '../intervention.service';
import { Router } from '@angular/router';
import { AtelierService } from 'src/app/atelier/atelier.service';
import { DiagnosticService } from 'src/app/maintenance/diagnostic/diagnostic.service';
import { TechnicienService } from 'src/app/technicien/technicien.service';
import { Atelier } from 'src/app/atelier/atelier';
import { Diagnostic } from 'src/app/maintenance/diagnostic/diagnostic';
import { Technicien } from 'src/app/technicien/technicien';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
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
export class OrdersComponent implements AfterViewInit {


  displayedColumns: string[] = ['id_ordre', 'diagnostic', 'urgence_panne', 'travaux', 'material_requis', 'planning', 'date_ordre', 'status', 'atelier', 'technicien', 'actions'];
  dataSource = new MatTableDataSource<Ordre>();
  cout_estime: any = undefined;
  capacite: any = undefined;
  matricule_techn: any = undefined;
  numparc: any = undefined;

  constructor(private ordreService: OrdreService,
    private interventionService: InterventionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private diagnosticService: DiagnosticService,
    private technicienService: TechnicienService,
    private atelierService: AtelierService
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

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
    travaux: '',
    material_requis: '',
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
  techniciens: Technicien[] = [];
  ateliers: Atelier[] = [];
  ordres: Ordre[] = [];
  filtredOrdres: Ordre[] = [];

  getEmergencyClass(urgence_panne: string): string {
    switch (urgence_panne) {
      case 'critique':
        return 'urgence_panne-critique';
      case 'moyenne':
        return 'urgence_panne-moyenne';
      case 'faible':
        return 'urgence_panne-faible';
      default:
        return '';
    }
    this.loadDiagnostic();
    this.loadTechnicien();
    this.loadAtelier();
    this.loadOrdre();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Planifier':
        return 'status-planifier';
      case 'Terminer':
        return 'status-terminer';
      case 'En cours':
        return 'status-en-cours';
      case 'En attente':
        return 'status-en-attente';
      default:
        return '';
    }
  }

  ngAfterViewInit(): void {
    this.ordreService.fetchAllOrders().subscribe((data) => {
      console.log('Données récupérées : ', data);
      this.ordres = data;
      this.dataSource = new MatTableDataSource<Ordre>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving Order: ', error);
    }
    );
  }

  loadOrdre(): void {
    this.ordreService.fetchAllOrders().subscribe(
      (data) => {
        this.ordres = data;
        this.filtredOrdres = data;
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.snackBar.open('Error fetching orders, please try again later.', 'Close', { duration: 5000 });
      }
    );
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

  searchParams: any = {
    date_diagnostic: '',
    date_ordre: '',
    status: '',
    nom_atelier: '',
    nom: '',
    prenom: '',
    matricule_techn: 0,

  }

  searchOrdre(): void {
    const filteredParams = Object.fromEntries(
      Object.entries(this.searchParams).filter(([__dirname, value]) => value !== null && value !== undefined && value !== '')
    );

    if (Object.keys(filteredParams).length === 0) {
      this.loadOrdre();
      return;
    }

    this.ordreService.searchOrdre(filteredParams).subscribe((data) => {
      this.filtredOrdres = data;
      this.dataSource.data = data;
    },
      (error) => {
        console.error('Error searching Order:', error);
      }
    );
  }

  // Reset search form
  resetSearch(): void {
    this.searchParams = {};
    this.loadOrdre();
  }

  // Apply quick filter to the table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editStatus(ordre: Ordre) {
    const dialogRef = this.dialog.open(UpdateOrdersComponent, {
      width: '400px',
      data: { ...ordre }, //passer les données de demande
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordreService.updateStatus(this.ordre).subscribe(
          () => {
            console.log("Status of Order updated successfully!");
            this.snackBar.open("Status of Order updated successfully!", "close", { duration: 6000 });
            window.location.reload();
          }, (error) => {
            console.error("Error while Order status of demande", error);
          }
        );
      }
    });
  }

  interventionOrdre(ordre: any) {
    //this.ngxService.start();
    const dialogRef = this.dialog.open(AddInterventionComponent, {
      width: '600px',
      height: '600px',
      //data: { id_ordre: ordre.id_ordre}
      data: { ...ordre }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interventionService.createIntervention(result).subscribe(() => {
          //this.ngxService.stop();
          console.log("Intervention added successfully!");
          this.snackBar.open("Intervention added successfully!", "Close", { duration: 5000 });
          //this.router.navigate(['/intervention']);
          //window.location.reload();
        },
          (error) => {
            console.log(error);
            // window.location.reload();
          });
      }
    })
  }

}
