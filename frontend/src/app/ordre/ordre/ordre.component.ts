import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { OrdreService } from '../ordre.service';
import { Ordre } from '../ordre';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddOrdreComponent } from '../add-ordre/add-ordre.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DiagnosticComponent } from 'src/app/maintenance/diagnostic/diagnostic.component';

@Component({
  selector: 'app-ordre',
  templateUrl: './ordre.component.html',
  styleUrls: ['./ordre.component.css'],
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
export class OrdreComponent implements AfterViewInit {

  displayedColumns: string[] = ['id_ordre', 'diagnostic', 'urgence_panne', 'travaux', 'material_requis', 'planning', 'date_ordre', 'status', 'atelier', 'technicien', 'actions'];
  dataSource = new MatTableDataSource<Ordre>();
  cout_estime: any = undefined;
  capacite: any = undefined;
  matricule_techn: any = undefined;

  constructor(private ordreService: OrdreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  ordre: Ordre = {
    id_ordre: 0,
    diagnostic: {
      id_diagnostic: 0,
      demande: {
        id_demande: 0,
      },
      description_panne: '',
      causes_panne: '',
      actions: '',
      date_diagnostic: '',
      heure_diagnostic: ''
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
    }
  }

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

  searchOrder(input: any) {
    this.filtredOrdres = this.ordres.filter(item => item.urgence_panne?.toLowerCase().includes(input.toLowerCase())
      || item.travaux?.toLowerCase().includes(input.toLowerCase())
      || item.material_requis?.toLowerCase().includes(input.toLowerCase())
      || item.planning?.toLowerCase().includes(input.toLowerCase())
      || item.date_ordre?.toLowerCase().includes(input.toLowerCase())
      || item.status?.toLowerCase().includes(input.toLowerCase())
    )
    this.dataSource = new MatTableDataSource<Ordre>(this.filtredOrdres);

  }



  openDialog(): void {
    const dialogRef = this.dialog.open(AddOrdreComponent, {
      width: '600px',
      height: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordreService.createOrder(result).subscribe(
          () => {
            console.log('new order created successfully!');
            window.location.reload();
          },
          (error) => {
            console.log(error);
            window.location.reload();
          });
      }
    });
  }

  editOrder(ordre: Ordre) {
    const dialogRef = this.dialog.open(AddOrdreComponent, {
      width: '600px',
      height: '600px',
      data: { ...ordre }, //passer les données de demande
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordreService.updateOrder(result).subscribe(
          () => {
            console.log("Order updated!", result);
            this.snackBar.open("Order updated successfully", 'close', { duration: 9000 });
            window.location.reload(); // Rafraîchir après mise à jour
          }, (error) => {
            console.error('Error while updating Order', error);
          }
        );
      }
    });
  }

  deleteOrder(id_ordre: Number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      this.ordreService.deleteOrder(id_ordre).subscribe(() => {
        this.ordres = this.ordres.filter(item => item.id_ordre !== id_ordre);
        this.snackBar.open('Request deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      }, (error) => {
        console.error("Error while deleting Request:", error);

      }
      );
    }
  }


}
