import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Atelier } from '../atelier';
import { AtelierService } from '../atelier.service';

@Component({
  selector: 'app-add-atelier',
  templateUrl: './add-atelier.component.html',
  styleUrls: ['./add-atelier.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule
  ]
})
export class AddAtelierComponent implements OnInit {

  nomDisponibles: string[] = ['atelier électrique', 'atelier mécanique', 'atelier moteur', 'atelier tolerie', 'atelier volcanisation', 'atelier préventive'];
  statutsDisponibles: string[] = ['Actif', 'Inactif'];

  capacite: any = undefined;
  selected= "atelier électrique";

  constructor(private atelierService: AtelierService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngxService: NgxUiLoaderService,
    public dialogRef: MatDialogRef<AddAtelierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  atelier: Atelier = {
    id_atelier: 0,
    nom_atelier: '',
    telephone: '',
    email: '',
    capacite: this.capacite,
    statut: ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data) {
      this.atelier = { ...this.data }
    }
  }

  saveAtelier(atelierForm: any) {
    console.log('Données envoyées:', this.atelier);

    if (atelierForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    this.ngxService.start();

    if (this.atelier.id_atelier) {
      this.atelierService.updateAtelier(this.atelier).subscribe(() => {
        console.log('Workshop updated successfully!');
        this.ngxService.stop();
        window.location.reload();
        this.dialogRef.close(this.atelier);
      },
        (error: any) => {
          console.error('Error while updating Workshop:', error);
        }
      );
    } else {
      this.atelierService.createAtelier(this.atelier).subscribe(
        () => {
          this.snackBar.open('Workshop added successfully!', 'close', { duration: 9000 });
          this.ngxService.stop();
          window.location.reload();
          this.dialogRef.close(this.atelier);
        },
        (error: any) => {
          console.error('Error while creation Workshop :', error);
          this.ngxService.stop();

          if (error.status === 400 && error.error.message === 'This Workshop already exists.') {
            this.snackBar.open('This workshop already exists!', 'Close', { duration: 9000 });
          } else {
            this.snackBar.open('An error occurred while adding.', 'Close', { duration: 9000 });
          }

        }
      );
    }
  }

}
