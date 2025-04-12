import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ChauffeurService } from '../../chauffeur/chauffeur.service';
import { VehiculeService } from '../../vehicule/vehicule.service';
import { Kilometrage } from '../kilometrage';
import { KilometrageService } from '../kilometrage.service';

@Component({
  selector: 'app-add-kilometrage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-kilometrage.component.html',
  styleUrls: ['./add-kilometrage.component.css']
})
export class AddKilometrageComponent implements OnInit {
  kilometrage: Kilometrage = {
    vehiculeId: 0,
    date: new Date().toISOString().split('T')[0],
    driverId: 0,
    calcul: 0
  };

  vehicles: any[] = [];
  drivers: any[] = [];
  isEdit = false;

  constructor(
    private dialogRef: MatDialogRef<AddKilometrageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private kilometrageService: KilometrageService,
    private vehiculeService: VehiculeService,
    private chauffeurService: ChauffeurService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadDrivers();
    
    if (this.data && this.data.id) {
      this.isEdit = true;
      this.kilometrage = { ...this.data };
    }
  }

  loadVehicles() {
    this.vehiculeService.fetchAllVehicules().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
  }

  loadDrivers() {
    this.chauffeurService.fetchAllChauffeurs().subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
      }
    });
  }

  onSubmit() {
    if (this.isEdit) {
      this.kilometrageService.updateKilometrage(this.kilometrage.id!, this.kilometrage).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating kilometrage:', error);
        }
      });
    } else {
      this.kilometrageService.createKilometrage(this.kilometrage).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating kilometrage:', error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}