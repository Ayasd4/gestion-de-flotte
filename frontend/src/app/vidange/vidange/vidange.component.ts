import { Component, OnInit, ViewChild } from '@angular/core';
import { Vidange } from '../vidange';
import { CommonModule } from '@angular/common';
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
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VidangeService } from '../vidange.service';
import { NumparcService } from 'src/app/services/numparc.service';
import { VehiculeService } from 'src/app/vehicule/vehicule.service';
import { Vehicule } from 'src/app/vehicule/vehicule';
import { AddVidangeComponent } from '../add-vidange/add-vidange.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vidange',
  templateUrl: './vidange.component.html',
  styleUrls: ['./vidange.component.css'],
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
export class VidangeComponent implements OnInit {

  displayedColumns: string[] = ['id_vd', 'id_vehicule', 'date_vidange', 'km_vidange', 'actions'];
  dataSource = new MatTableDataSource<Vidange>();
  numparc: any = undefined;
  date_vidange: any = undefined;
  km_vidange: any = undefined;

  constructor(private vidangeService: VidangeService,
    private numparcService: NumparcService,
    private vehiculeService: VehiculeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  vidange: Vidange = {
    id_vd: 0,
    vehicule: { 
      idvehicule: 0,
      numparc: this.numparc },
    date_vidange: '',
    km_vidange: this.km_vidange
  }

  vehicules: Vehicule[] = [];
  vidanges: Vidange[] = [];
  filtredVidanges: Vidange[] = [];


  ngOnInit(): void {
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
      console.log('Données récupérer:', data);

      const hiddenIds = JSON.parse(localStorage.getItem('hiddenVidanges') || '[]');

      // Ne pas inclure les ateliers supprimés dans la liste des ateliers visibles
      const visibleVidanges = data.filter(vidange => !hiddenIds.includes(vidange.id_vd));

      this.vidanges = visibleVidanges;
      this.dataSource = new MatTableDataSource<Vidange>(this.vidanges);//this.filteredDemandes
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving oil change: ', error);
    });

    this.loadVehicules();
  }

  searchVidanges(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goBack(){
    this.router.navigate(['/etat']);
  }
  
  /*searchParams: any = {
    numparc: 0,
    date_vidange: '',
    km_vidange: 0
  };

  searchVidanges(): void {
    const filteredParams = Object.fromEntries(
      Object.entries(this.searchParams).filter(([__dirname, value]) => value !== null && value !== undefined && value !== '')
    );

    if (Object.keys(filteredParams).length === 0) {
      this.loadVidanges();
      return;
    }

    this.vidangeService.searchVidanges(filteredParams).subscribe((data) => {
      console.log("Recherche en cours :", data);

      this.filtredVidanges = data;
      this.dataSource.data = data;
    },
      (error) => {
        console.error('Error searching requests:', error);
      }
    );
  }

  resetSearch(): void {
    this.searchParams = {};
    this.loadVidanges();
  }*/

  // Apply quick filter to the table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(): void {
      const dialogRef = this.dialog.open(AddVidangeComponent, {
        width: '400px',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.vidangeService.createVidange(result).subscribe(
            () => {
              console.log('new oil change created successfully!');
              window.location.reload();
            },
            (error) => {
              console.log(error);
              window.location.reload();
            });
        }
      });
    }

    editVidange(vidange: Vidange) {
        const dialogRef = this.dialog.open(AddVidangeComponent, {
          width: '400px',
          data: { ...vidange }, //passer les données de demande
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.vidangeService.updateVidange(result).subscribe(
              () => {
                console.log("oil change updated!", result);
                this.snackBar.open("oil change updated successfully", 'close', { duration: 9000 });
                window.location.reload(); // Rafraîchir après mise à jour
              }, (error) => {
                console.error('Error while updated oil change', error);
              }
            );
          }
        });
      }
    
      deleteVidange(id_vd: number) {
        const isConfirmed = window.confirm("Are you sure you want to delete?");
        if (isConfirmed) {
          const hiddenIds = JSON.parse(localStorage.getItem('hiddenVidanges') || '[]');
          if (!hiddenIds.includes(id_vd)) {
            hiddenIds.push(id_vd);
            localStorage.setItem('hiddenVidanges', JSON.stringify(hiddenIds));
    
            this.vidanges = this.vidanges.filter(item => item.id_vd !== id_vd);
            this.dataSource.data = this.vidanges;
    
            // Afficher un message de confirmation
            this.snackBar.open('Oil change deleted successfully!', 'Close', { duration: 6000 });
          }
        }
      }
    
  
}
