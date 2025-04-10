import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Technicien } from '../technicien';
import { TechnicienService } from '../technicien.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AddTechnicienComponent } from '../add-technicien/add-technicien.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-technicien',
  templateUrl: './technicien.component.html',
  styleUrls: ['./technicien.component.css'],
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
export class TechnicienComponent implements OnInit {
  displayedColumns: string[] = ['id_technicien', 'nom', 'prenom', 'matricule_techn', 'cin', 'telephone_techn', 'email_techn', 'specialite', 'date_embauche', 'actions'];
  dataSource = new MatTableDataSource<Technicien>();
  matricule_techn: any = undefined;

  constructor(private technicienService: TechnicienService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngxService: NgxUiLoaderService
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  technicien: Technicien = {
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

  techniciens: Technicien[] = [];
  filtredTechniciens: Technicien[] = [];

  ngOnInit(): void {
    this.loadTechniciens();
  }

  loadTechniciens(): void {
    this.technicienService.fetchAllTechnicien().subscribe((data) => {
      //console.log('Données récupérées : ', data);
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenTechniciens') || '[]');

      // Ne pas inclure les ateliers supprimés dans la liste des ateliers visibles
      const visibleTechniciens = data.filter(technicien => !hiddenIds.includes(technicien.id_technicien));

      this.techniciens = visibleTechniciens;
      this.dataSource = new MatTableDataSource<Technicien>(this.techniciens);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving Workshops: ', error);
    });
  }

  searchTechnicien(input: any) {
    this.filtredTechniciens = this.techniciens.filter(item => item.nom?.toLowerCase().includes(input.toLowerCase())
      || item.prenom?.toLowerCase().includes(input.toLowerCase())
      || item.matricule_techn?.toString().includes(input)
      || item.cin?.toLowerCase().includes(input.toLowerCase())
      || item.telephone_techn?.toLowerCase().includes(input.toLowerCase())
      || item.email_techn?.toLowerCase().includes(input.toLowerCase())
      || item.specialite?.toLowerCase().includes(input.toLowerCase())
      || item.date_embauche?.toLowerCase().includes(input.toLowerCase())

    )
    this.dataSource = new MatTableDataSource<Technicien>(this.filtredTechniciens);

  }

  extractImageName(imagePath: string): string {
    // Pour traiter les cas comme "uploads\\image.jpg" ou juste "image.jpg"
    return imagePath.split('\\').pop() || imagePath;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddTechnicienComponent, {
      width: '600px',
      height: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.technicienService.createTechnicien(result).subscribe(
          () => {
            console.log("Technician added successfully!");
            this.snackBar.open("Technician added successfully!", "Close", { duration: 5000 });
          },
          (error) => {
            console.log(error);
            window.location.reload();
          });
      }
    })
  }

  updateTechnicien(technicien: Technicien) {
    const dialogRef = this.dialog.open(AddTechnicienComponent, {
      width: '600px',
      height: '600px',
      data: { ...technicien }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const formData = new FormData();
        formData.append('nom', result.nom);
        formData.append('prenom', result.prenom);
        formData.append('matricule_techn', result.matricule_techn);
        formData.append('cin', result.cin);
        formData.append('telephone_techn', result.telephone_techn);
        formData.append('email_techn', result.email_techn);
        formData.append('specialite', result.specialite);
        formData.append('date_embauche', result.date_embauche);
        formData.append('image', result.image);

        this.technicienService.updateTechnicien(this.technicien.id_technicien, formData).subscribe(() => {
          console.log("Technician updated successfully!");
          this.snackBar.open("Technician updated successfully!", "Close", { duration: 5000 });
          window.location.reload();
        },
          (error) => {
            console.log("Error while updated Technician :", error);
            window.location.reload();
          });
      }
    })
  }

  deleteTechnicien(id_technicien: Number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      /*this.technicienService.deleteTechnicien(id_technicien).subscribe(() => {
        this.techniciens = this.techniciens.filter(item => item.id_technicien !== id_technicien);
        this.snackBar.open(' Technician successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      }, (error) => {
        console.error("Error while deleting Technician:", error);
      }
      );*/

      const hiddenIds = JSON.parse(localStorage.getItem('hiddenTechniciens') || '[]');
      if (!hiddenIds.includes(id_technicien)) {
        hiddenIds.push(id_technicien);
        localStorage.setItem('hiddenTechniciens', JSON.stringify(hiddenIds));

        this.techniciens = this.techniciens.filter(item => item.id_technicien !== id_technicien);
        this.dataSource.data = this.techniciens;

        // Afficher un message de confirmation
        this.snackBar.open('Technician deleted successfully!', 'Close', { duration: 6000 });
      }
    }
  }

  
}