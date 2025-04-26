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
import { Consomation } from '../consomation';

import { Chauffeur } from 'src/app/chauffeur/chauffeur';
import { ChauffeurService } from 'src/app/chauffeur/chauffeur.service';
import { Vehicule } from 'src/app/vehicule/vehicule';
import { VehiculeService } from 'src/app/vehicule/vehicule.service';
import { Agence, AgenceService } from '../../agence/agence.service';

@Component({
  selector: 'app-add-consomation',
  templateUrl: './add-consomation.component.html',
  styleUrls: ['./add-consomation.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ]
})
export class AddConsomationComponent implements OnInit {
  consomation: Consomation = {
    numPark: 0,
    QteCarb: 0,
    indexkilo: 0,
    dateDebut: '',
    idChaff: 0,
    idVehicule: 0,
    idAgence: 0
  };
  isEditMode = false;
  dialogTitle = 'Add New Fuel Consumption Record';

  vehicules: Vehicule[] = [];
  chauffeurs: Chauffeur[] = [];
  agences: Agence[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddConsomationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vehiculeService: VehiculeService,
    private chauffeurService: ChauffeurService,
    private agenceService: AgenceService
  ) {}

  ngOnInit(): void {
    // Load reference data
    this.loadVehicules();
    this.loadChauffeurs();
    this.loadAgences();
    
    // Check if we're in edit mode
    if (this.data && this.data.idConsomation) {
      this.isEditMode = true;
      this.dialogTitle = 'Edit Fuel Consumption Record';
      this.consomation = { ...this.data };
      
      // Convert date strings to proper format for date inputs
      if (this.consomation.dateDebut) {
        this.consomation.dateDebut = this.formatDateForInput(this.consomation.dateDebut);
      }
    
    }
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

  loadChauffeurs(): void {
    this.chauffeurService.fetchAllChauffeurs().subscribe(
      (data) => {
        this.chauffeurs = data;
      },
      (error) => {
        console.error('Error fetching drivers:', error);
      }
    );
  }

  loadAgences(): void {
    this.agenceService.fetchAllAgences().subscribe(
      (data) => {
        this.agences = data;
      },
      (error) => {
        console.error('Error fetching agencies:', error);
      }
    );
  }

  onSubmit(): void {
    this.dialogRef.close(this.consomation);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Helper method to format dates for input fields
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}