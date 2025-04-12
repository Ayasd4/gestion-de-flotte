import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddKilometrageComponent } from '../add-kilometrage/add-kilometrage.component';
import { Kilometrage } from '../kilometrage';
import { KilometrageService } from '../kilometrage.service';

@Component({
  selector: 'app-kilometrage',
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
    MatPaginatorModule
  ],
  templateUrl: './kilometrage.component.html',
  styleUrls: ['./kilometrage.component.css']
})
export class KilometrageComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'vehicule', 'date', 'driver', 'calcul', 'actions'];
  dataSource = new MatTableDataSource<Kilometrage>();

  constructor(private kilometrageService: KilometrageService, public dialog: MatDialog) {}

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadKilometrages();
  }

  loadKilometrages() {
    this.kilometrageService.getKilometrages().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error loading kilometrage data:', error);
      }
    });
  }

  searchKilometrage(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(kilometrage?: Kilometrage) {
    const dialogRef = this.dialog.open(AddKilometrageComponent, {
      width: '500px',
      data: kilometrage || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadKilometrages();
      }
    });
  }

  editKilometrage(kilometrage: Kilometrage) {
    this.openDialog(kilometrage);
  }

  deleteKilometrage(id: number) {
    if (confirm('Are you sure you want to delete this kilometrage record?')) {
      this.kilometrageService.deleteKilometrage(id).subscribe({
        next: () => {
          this.loadKilometrages();
        },
        error: (error) => {
          console.error('Error deleting kilometrage:', error);
        }
      });
    }
  }
}