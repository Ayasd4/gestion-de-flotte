import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Intervention } from '../intervention';
import { InterventionService } from '../intervention.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddInterventionComponent } from '../add-intervention/add-intervention.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-intervention',
  templateUrl: './intervention.component.html',
  styleUrls: ['./intervention.component.css'],
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
export class InterventionComponent implements AfterViewInit {

  displayedColumns: string[] = ['id_intervention', 'ordre', 'technicien', 'date_debut', 'date_fin', 'status', 'commentaire', 'actions'];
  dataSource = new MatTableDataSource<Intervention>();
  cout_estime: any = undefined;
  capacite: any = undefined;
  matricule_techn: any = undefined;

  constructor(private interventionService: InterventionService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  intervention: Intervention = {
    id_intervention: 0,
    ordre: {
      id_ordre: 0,
      urgence_panne: '',
      travaux: '',
      material_requis: '',
      planning: '',
      date_ordre: '',
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

  interventions: Intervention[] = [];
  filtredIntervention: Intervention[] = [];

  getStatusClass(status_intervention: string): string {
    switch (status_intervention) {
      case 'Planifier':
        return 'status-planifier';
      case 'Terminer':
        return 'status-terminer';
      case 'Annuler':
        return 'status-annuler';
      default:
        return '';
    }
  }

  ngAfterViewInit(): void {
    this.interventionService.fetchAllInterventions().subscribe((data) => {
      console.log('Données récupérées : ', data);
      this.interventions = data;
      this.dataSource = new MatTableDataSource<Intervention>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving Intervention: ', error);
    }
    );
  }

  searchIntervention(input: any) {
    this.filtredIntervention = this.interventions.filter(item => item.date_debut?.toLowerCase().includes(input.toLowerCase())
      || item.heure_debut?.toLowerCase().includes(input.toLowerCase())
      || item.date_fin?.toLowerCase().includes(input.toLowerCase())
      || item.heure_fin?.toLowerCase().includes(input.toLowerCase())
      || item.status_intervention?.toLowerCase().includes(input.toLowerCase())
      || item.commentaire?.toLowerCase().includes(input.toLowerCase())
    )
    this.dataSource = new MatTableDataSource<Intervention>(this.filtredIntervention);

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddInterventionComponent, {
      width: '600px',
      height: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interventionService.createIntervention(result).subscribe(
          () => {
            console.log('New Intervention created successfully!');
            window.location.reload();
          },
          (error) => {
            console.log(error);
            window.location.reload();
          });
      }
    });
  }

  editIntervention(intervention: Intervention) {
    const dialogRef = this.dialog.open(AddInterventionComponent, {
      width: '600px',
      height: '600px',
      data: { ...intervention }, //passer les données de demande
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interventionService.updateIntervention(result).subscribe(
          () => {
            console.log("Intervention updated!", result);
            this.snackBar.open("Intervention updated successfully", 'close', { duration: 9000 });
            window.location.reload(); // Rafraîchir après mise à jour
          }, (error) => {
            console.error('Error while updating Intervention', error);
          }
        );
      }
    });
  }

  deleteIntervantion(id_intervention: Number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      this.interventionService.deleteIntervention(id_intervention).subscribe(() => {
        this.interventions = this.interventions.filter(item => item.id_intervention !== id_intervention);
        this.snackBar.open('Intervention deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      }, (error) => {
        console.error("Error while deleting Intervention:", error);

      }
      );
    }
  }

}
