import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Agence, AgenceService } from 'src/app/agence/agence.service';
import { Chauffeur } from 'src/app/chauffeur/chauffeur';
import { ChauffeurService } from 'src/app/chauffeur/chauffeur.service';
import { Vehicule } from 'src/app/vehicule/vehicule';
import { VehiculeService } from 'src/app/vehicule/vehicule.service';
import { AddConsomationComponent } from '../add-consomation/add-consomation.component';
import { Consomation } from '../consomation';
import { ConsomationService } from '../consomation.service';

@Component({
  selector: 'app-consomation',
  templateUrl: './consomation.component.html',
  styleUrls: ['./consomation.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe
  ]
})
export class ConsomationComponent implements OnInit, AfterViewInit {
  constructor(
    private consomationService: ConsomationService,
    private vehiculeService: VehiculeService,
    private chauffeurService: ChauffeurService,
    private agenceService: AgenceService,
    private dialog: MatDialog,
    private snackbar:MatSnackBar,
    private router: Router
  ) {}
  filisble: boolean = false; 
  ngOnInit(): void {
    // Load your data if the role matches
    this.loadConsomations();
    this.loadVehicules();
    this.loadChauffeurs();
    this.loadAgences();
   
  }

  

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  // Export current filtered data to PDF
  exportToPdf(): void {
    // Show loading indicator or message
    // Use the same search parameters that are currently applied
    this.consomationService.exportToPdf(this.searchParams)
      .subscribe({
        next: (blob: Blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
          
          // Create a link element
          const a = document.createElement('a');
          a.href = url;
          a.download = 'fuel-consumption-report.pdf';
          
          // Append to the document body, click it, and remove it
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Release the URL object
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading PDF:', error);
          // Show error message to user
          alert('Failed to download PDF report. Please try again.');
        }
      });
  }
  displayedColumns: string[] = [
    'idConsomation', 
    'numPark', 
    'QteCarb', 
    'indexkilo', 
    'dateDebut', 
    'ImmatChauffeur',
    'chauffeur', 
    'agence', 
    'calcul',
    'actions'
  ];
  dataSource = new MatTableDataSource<Consomation>();
  consomations: Consomation[] = [];
  filteredConsomations: Consomation[] = [];
  searchParams: any = {};
  vehicules: Vehicule[] = [];
  chauffeurs: Chauffeur[] = [];
  agences: Agence[] = [];
  selectedAgencyForPDF: Agence | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Update displayed columns based on selected agency
  get currentDisplayedColumns(): string[] {
    if (this.selectedAgencyForPDF) {
      // Remove 'agence' column when an agency is selected
      return this.displayedColumns.filter(col => col !== 'agence');
    }
    return this.displayedColumns;
  }

  // Load all consomations from the service
  loadConsomations(): void {
    this.consomationService.fetchAllConsomations().subscribe(
      (data) => {
        this.consomations = data;
        this.filteredConsomations = data;
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching consomations:', error);
      }
    );
  }

  // Load all vehicles from the service
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

  // Load all drivers from the service
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

  // Load all agencies from the service
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

  // Open dialog to add or edit a consomation
  openDialog(): void {
    const dialogRef = this.dialog.open(AddConsomationComponent, {
      width: '800px',
      height:'600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consomationService.createConsomation(result).subscribe(
          () => {
            this.snackbar.open('Request created successfully!','close',{ duration:9000});

            this.loadConsomations();
          },
          (error) => {
            this.snackbar.open('Error creating consomation!','close',{ duration:9000});

            console.error('Error creating consomation:', error);
          }
        );
      }
    });
  }

  // Edit an existing consomation
  editConsomation(consomation: Consomation): void {
    const dialogRef = this.dialog.open(AddConsomationComponent, {
      width: '800px',
      data: { ...consomation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consomationService.updateConsomation(result).subscribe(
          () => {
            this.snackbar.open('Request updated successfully!','close',{ duration:9000});
            //this.loadConsomations();
            window.location.reload();
          },
          (error) => {
            this.snackbar.open('Error updating consomation!','close',{ duration:9000});
            console.error('Error updating consomation:', error);
          }
        );
      }
    });
  }

  // Delete a consomation
  deleteConsomation(idConsomation: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.consomationService.deleteConsomation(idConsomation).subscribe(
        () => {
          this.snackbar.open('consomation deleted successfully!','close',{ duration:9000});
          this.loadConsomations();
        },
        (error) => {
          this.snackbar.open('Error deleting consomation!','close',{ duration:9000});
          console.error('Error deleting consomation:', error);
        }
      );
    }
  }

  // Search consomations based on form parameters
  searchConsomation(): void {
    // Filter out null/undefined/empty values
    const filteredParams = Object.fromEntries(
      Object.entries(this.searchParams)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );

    if (Object.keys(filteredParams).length === 0) {
      this.loadConsomations();
      return;
    }

    this.consomationService.searchConsomations(filteredParams).subscribe(
      (data) => {
        this.filteredConsomations = data;
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error searching consomations:', error);
      }
    );
  }

  // Reset search form
  resetSearch(): void {
    this.searchParams = {};
    this.loadConsomations();
  }

  // Apply quick filter to the table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Export data to PDF
  exportToPDF(): void {
    const doc = new jsPDF();
    
    // Set title
    let title = 'Fuel Consumption Report';
    if (this.selectedAgencyForPDF) {
      title += ` - ${this.selectedAgencyForPDF.nom}`;
    }
    
    // Filter data if agency is selected
    let dataToExport = [...this.dataSource.data];
    if (this.selectedAgencyForPDF) {
      dataToExport = dataToExport.filter(item => 
        item.idAgence === this.selectedAgencyForPDF?.id_agence
      );
    }
    
    // Define columns for PDF
    const columns = [
      { header: 'ID', dataKey: 'idConsomation' },
      { header: 'Park #', dataKey: 'numPark' },
      { header: 'Fuel Qty', dataKey: 'QteCarb' },
      { header: 'KM Index', dataKey: 'indexkilo' },
      { header: 'Start Date', dataKey: 'dateDebut' },
      { header: 'Driver', dataKey: 'chauffeur' },
      { header: 'Driver Matricule', dataKey: 'ImmatChauffeur' },
      { header: 'L/100km', dataKey: 'calcul' }
    ];
    
    // If showing all agencies, add agency column
    if (!this.selectedAgencyForPDF) {
      columns.splice(8, 0, { header: 'Agency', dataKey: 'agence' });
    }
    
    // Format data for PDF
    const formattedData = dataToExport.map(item => {
      const row: any = {
        idConsomation: item.idConsomation,
        numPark: item.numPark,
        QteCarb: item.QteCarb,
        indexkilo: item.indexkilo,
        dateDebut: new Date(item.dateDebut).toLocaleDateString(),
        chauffeur: `${item.chauffeur_nom} ${item.chauffeur_prenom}`,
        ImmatChauffeur: item.chauffeur_matricule,
        calcul: ((item.QteCarb / item.indexkilo) * 100).toFixed(2)
      };
      
      if (!this.selectedAgencyForPDF) {
        row.agence = item.agence_nom;
      }
      
      return row;
    });
    
    // Add title to PDF
    doc.text(title, 14, 20);
    
    // Add current date
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Generated on: ${currentDate}`, 14, 30);
    
    // Add table to PDF
    autoTable(doc, {
      columns: columns,
      body: formattedData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Save PDF
    doc.save('fuel-consumption-report.pdf');
  }
}