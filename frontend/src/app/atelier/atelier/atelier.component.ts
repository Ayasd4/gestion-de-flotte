import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { Atelier } from '../atelier';
import { AtelierService } from '../atelier.service';
import { AddAtelierComponent } from '../add-atelier/add-atelier.component';

@Component({
  selector: 'app-atelier',
  templateUrl: './atelier.component.html',
  styleUrls: ['./atelier.component.css'],
  standalone: true,
  imports: [
    CommonModule,
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
    MatSnackBarModule,
    MatTooltipModule,
    MatCardModule,
    MatListModule
  ],
})
export class AtelierComponent implements AfterViewInit {

  displayedColumns: string[] = ['id_atelier', 'nom', 'telephone', 'email', 'capacite', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Atelier>();

  //dataSource = new MatTableDataSource<any>([]);
  capacite: any = undefined;

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'Actif':
        return 'statut-actif';
      case 'Inactif':
        return 'statut-inactif';
      default:
        return '';
    }
  }
  
  constructor(private atelierService: AtelierService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngxService: NgxUiLoaderService
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  atelier: Atelier = {
    id_atelier: 0,
    nom_atelier: '',
    telephone: '',
    email: '',
    capacite: this.capacite,
    statut: ''
  }

  ateliers: Atelier[] = [];
  filteredAteliers: Atelier[] = [];

  /*//this.filteredDemandes = data; 

      this.ateliers = data.map((ateliers: any) => ({
        ...ateliers,
      }));
      this.dataSource.data = this.ateliers; */
      
  ngAfterViewInit(): void {
    this.atelierService.fetchAllAtelier().subscribe((data) => {
      //console.log('Données récupérées : ', data);
      this.ateliers = data;
      this.dataSource = new MatTableDataSource<Atelier>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving Workshops: ', error);
    });
  }

  searchAtelier(input: any) {
    this.filteredAteliers = this.ateliers.filter(item => item.nom_atelier?.toLowerCase().includes(input.toLowerCase())
      || item.telephone?.toLowerCase().includes(input.toLowerCase())
      || item.email?.toLowerCase().includes(input.toLowerCase())
      || item.capacite?.toString().includes(input)
      || item.statut?.toLowerCase().includes(input.toLowerCase())
    )
    this.dataSource = new MatTableDataSource<Atelier>(this.filteredAteliers);

  }

  
  openDialog() {
    const dialogRef = this.dialog.open(AddAtelierComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atelierService.createAtelier(result).subscribe(
          () => {
            //this.ngxService.stop();
            console.log("Workshop added successfully!");
            this.snackBar.open("Workshop added successfully!", "Close", { duration: 5000 });
            //window.location.reload();
          },
          (error) => {
            console.log(error);
            // window.location.reload();
          });
      }
    })
  }

  updateAtelier(atelier: Atelier) {
    const dialogRef = this.dialog.open(AddAtelierComponent, {
      width: '400px',
      data: { ...atelier }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.atelierService.updateAtelier(result).subscribe(() => {
          //this.ngxService.stop();
          console.log("Workshop updated successfully!");
          this.snackBar.open("Workshop updated successfully!", "Close", { duration: 5000 });
          //window.location.reload();
        },
          (error) => {
            console.log("Error while updated workshop :", error);
            // window.location.reload();
          });
      }
    })
  }

  deleteAtelier(id_atelier: Number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      this.atelierService.deleteAtelier(id_atelier).subscribe(() => {
        this.ateliers = this.ateliers.filter(item => item.id_atelier !== id_atelier);
        this.snackBar.open('Workshop deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      }, (error) => {
        console.error("Error while deleting workshop:", error);
      }
      );
    }
  }


}
