import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Vehicule } from 'src/app/vehicule/vehicule';
import { VehiculeService } from 'src/app/vehicule/vehicule.service';
import { Vidange } from 'src/app/vidange/vidange';
import { VidangeService } from 'src/app/vidange/vidange.service';
import { AddEtatComponent } from '../add-etat/add-etat.component';
import { Etat } from '../etat';
import { EtatService } from '../etat.service';

@Component({
  selector: 'app-etat-vidange',
  templateUrl: './etat-vidange.component.html',
  styleUrls: ['./etat-vidange.component.css'],
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
    MatSnackBarModule,
    MatMenuModule
  ]
})
export class EtatVidangeComponent implements OnInit {

  displayedColumns: string[] = ['id_vidange', 'id_vehicule', 'id_kilometrage', 'date', 'km_derniere_vd', 'km_prochaine_vd', 'reste_km', 'actions'];
  dataSource = new MatTableDataSource<Etat>();
 // searchParams: any = {};
  numparc: any = undefined;
  km_vidange: any = undefined;
  vehiculeId: any = undefined;
  calcul: any = undefined;
  km_prochaine_vd: any = undefined;
  reste_km: any = undefined;

  constructor(private etatService: EtatService,
    private vidangeService: VidangeService,
    private vehiculeService: VehiculeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  etat: Etat = {
    id_vidange: 0,
    vehicule: {
      idvehicule: 0,
      numparc: this.numparc
    },
    kilometrage: {
      id: 0,
      vehiculeId: this.vehiculeId,
      calcul: this.calcul
    },
    km_derniere_vd: {
      km_vidange: this.km_vidange
    },
    km_prochaine_vd: this.km_prochaine_vd,
    reste_km: this.reste_km,
    date: ''
  }

  vehicules: Vehicule[] = [];
  vidanges: Vidange[] = [];
  etats: Etat[] = [];
  filtredEtats: Etat[] = [];


  exportToPdf() {
    this.etatService.generateRapport(this.filterValue).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapport Etat_vidange.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur de génération du PDF :', err);
      }
    });
  }


  ngOnInit(): void {
    this.loadEtats();
  }

  loadEtats(): void {
    this.etatService.fetchAllEtats().subscribe((data) => {
      console.log('Données récupérer:', data);

      const hiddenIds = JSON.parse(localStorage.getItem('hiddenEtats') || '[]');

      // Ne pas inclure les ateliers supprimés dans la liste des ateliers visibles
      const visibleEtats = data.filter(etat => !hiddenIds.includes(etat.id_vidange));

      this.etats = visibleEtats;
      this.dataSource = new MatTableDataSource<Etat>(this.etats);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving oil change: ', error);
    }
    );

    this.loadVehicules();
    this.loadVidanges();

  }

  loadVehicules(): void {
    this.vehiculeService.fetchAllVehicules().subscribe(
      (data) => {
        this.vehicules = data;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  loadVidanges(): void {
    this.vidangeService.fetchAllVidanges().subscribe((data) => {

      this.vidanges = data;

    }, (error) => {
      console.log('Error fetching oil change: ', error);
    });
  }

  filterValue: any ={};
  searchEtats(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToVidange() {
    alert("welcome to oil change page")
    this.router.navigate(['/vidange']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEtatComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.etatService.createEtat(result).subscribe(
          () => {
            console.log('new planning created successfully!');
            window.location.reload();
          },
          (error) => {
            console.log(error);
            window.location.reload();
          });
      }
    });
  }

  editEtat(etat: Etat) {
    const dialogRef = this.dialog.open(AddEtatComponent, {
      width: '400px',
      data: { ...etat },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.etatService.updateEtat(result).subscribe(
          () => {
            console.log("planning updated!", result);
            this.snackBar.open("planning updated successfully", 'close', { duration: 9000 });
            window.location.reload(); // Rafraîchir après mise à jour
          }, (error) => {
            console.error('Error while updated planning', error);
          }
        );
      }
    });
  }

  deleteEtat(id_vidange: number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenEtats') || '[]');
      if (!hiddenIds.includes(id_vidange)) {
        hiddenIds.push(id_vidange);
        localStorage.setItem('hiddenEtats', JSON.stringify(hiddenIds));

        this.etats = this.etats.filter(item => item.id_vidange !== id_vidange);
        this.dataSource.data = this.etats;

        // Afficher un message de confirmation
        this.snackBar.open('Planning deleted successfully!', 'Close', { duration: 6000 });
      }
    }
  }

}
