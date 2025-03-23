import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Chauffeur } from '../chauffeur';
import { ChauffeurService } from '../chauffeur.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddChauffeurComponent } from '../add-chauffeur/add-chauffeur.component';

@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css'],
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
    MatSnackBarModule,
    MatTooltipModule
  ]
})
export class ChauffeurComponent implements AfterViewInit {

  displayedColumns: string[] = ['id_chauf', 'nom', 'prenom', 'matricule_chauf', 'cin', 'telephone', 'email', 'actions'];
  dataSource = new MatTableDataSource<Chauffeur>();

  constructor(private chauffeurService: ChauffeurService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  chauffeur: Chauffeur = {
    id_chauf: 0,
    nom: '',
    prenom: '',
    matricule_chauf: '',
    cin: '',
    telephone: '',
    email: ''
  }

  chauffeurs: Chauffeur[] = [];
  filtredChauffeurs: Chauffeur[] = [];

  ngAfterViewInit(): void {
    this.chauffeurService.fetchAllChauffeurs().subscribe((data) => {
      this.chauffeurs = data;
      this.dataSource = new MatTableDataSource<Chauffeur>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.error('Error while recovery Driver:', error);
    });
  }

  searchChauffeur(input: any) {
    this.filtredChauffeurs = this.chauffeurs.filter(item => item.nom.toLowerCase().includes(input.toLowerCase())
      || item.prenom.toLowerCase().includes(input.toLowerCase())
      || item.matricule_chauf.toLowerCase().includes(input.toLowerCase())
      || item.cin.toLowerCase().includes(input.toLowerCase())
      || item.telephone.toLowerCase().includes(input.toLowerCase())
      || item.email.toLowerCase().includes(input.toLowerCase()))

    this.dataSource = new MatTableDataSource<Chauffeur>(this.filtredChauffeurs);

  }

  openDialog() {
    const dialogRef = this.dialog.open(AddChauffeurComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chauffeurService.createChauffeur(result).subscribe(() => {
          console.log('New Driver created successfully!');
          window.location.reload();
        },
          (error) => {
            console.log(error);
            window.location.reload();
          }
        );
      }
    });
  }

  editChauffeur(Chauffeur: Chauffeur) {
    const dialogRef = this.dialog.open(AddChauffeurComponent, {
      width: '400px',
      data: { ...Chauffeur }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chauffeurService.updateChauffeur(result).subscribe(
          () => {
            console.log('Driver updated successfully!');
            window.location.reload();
          },
          (error) => {
            console.error("Error while updated driver :", error);
            window.location.reload();
          }
        );
      }
    })
  }

  deleteChauffeur(id_chauf: Number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if(isConfirmed){
      this.chauffeurService.deleteChauffeur(id_chauf).subscribe((data)=>{
        this.chauffeurs = this.chauffeurs.filter(item => item.id_chauf !== id_chauf);
        this.snackBar.open('driver deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      }, (error) => {
        console.error("Error while deleted driver :", error);
      }
    );
    }
  }

}

