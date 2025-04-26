import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OrdreService } from '../ordre.service';
import { Ordre } from '../ordre';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AddOrdreComponent } from '../add-ordre/add-ordre.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DiagnosticComponent } from 'src/app/maintenance/diagnostic/diagnostic.component';
import { Technicien } from 'src/app/technicien/technicien';
import { Atelier } from 'src/app/atelier/atelier';
import { Diagnostic } from 'src/app/maintenance/diagnostic/diagnostic';
import { TechnicienService } from 'src/app/technicien/technicien.service';
import { AtelierService } from 'src/app/atelier/atelier.service';
import { DiagnosticService } from 'src/app/maintenance/diagnostic/diagnostic.service';
import { MatMenuModule } from '@angular/material/menu';
import { Travaux } from '../travaux';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Vehicule } from 'src/app/vehicule/vehicule';
import { VehiculeService } from 'src/app/vehicule/vehicule.service';

@Component({
  selector: 'app-ordre',
  templateUrl: './ordre.component.html',
  styleUrls: ['./ordre.component.css'],
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
export class OrdreComponent implements OnInit {

  displayedColumns: string[] = ['id_ordre', 'Vehicle', 'urgence_panne', 'travaux', 'planning', 'date_ordre', 'status', 'atelier', 'technicien', 'actions'];
  dataSource = new MatTableDataSource<Ordre>();
  cout_estime: any = undefined;
  capacite: any = undefined;
  matricule_techn: any = undefined;
  numparc: any = undefined;

  constructor(private ordreService: OrdreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private diagnosticService: DiagnosticService,
    private technicienService: TechnicienService,
    private atelierService: AtelierService,
    private vehiculeService: VehiculeService
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ordre: Ordre = {
    id_ordre: 0,
    diagnostic: {
      id_diagnostic: 0,
      demande: {
        id_demande: 0,
        type_avarie: '',
        description: '',
        vehicule: { numparc: this.numparc }
      },
      description_panne: '',
      causes_panne: '',
      actions: '',
      date_diagnostic: '',
      heure_diagnostic: ''
    },
    urgence_panne: '',
    travaux: { id_travaux: 0, nom_travail: '', type_atelier: '' },
    planning: '',
    date_ordre: '',
    status: '',
    atelier: {
      id_atelier: 0,
      nom_atelier: '',
      telephone: '',
      email: '',
      capacite: this.capacite,
      statut: ''
    },
    technicien: {
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
  }

  diagnostics: Diagnostic[] = [];
  techniciens: Technicien[] = [];
  ateliers: Atelier[] = [];
  ordres: Ordre[] = [];
  travaux: Travaux[] = [];
  vehicules: Vehicule[] = [];
  filtredOrdres: Ordre[] = [];
  selectedAtelierForPDF: Atelier | null = null;

  exportToPdf() {
    this.ordreService.generateRapport(this.searchParams).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapport_ordre_travail.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur de génération du PDF :', err);
      }
    });
  }

  getEmergencyClass(urgence_panne: string): string {
    switch (urgence_panne) {
      case 'urgente':
        return 'urgence_panne-urgent';
      case 'moyenne':
        return 'urgence_panne-moyenne';
      case 'faible':
        return 'urgence_panne-faible';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ouvert':
        return 'status-ouvert';
      case 'En cours':
        return 'status-en-cours';
      case 'Fermé':
        return 'status-ferme';
      default:
        return '';
    }
  }

  ngOnInit(): void {
    this.loadOrdre();
  }

  loadOrdre(): void {
    this.ordreService.fetchAllOrders().subscribe((data) => {
      console.log('Données récupérées : ', data);

      const hiddenIds = JSON.parse(localStorage.getItem('hiddenOrdres') || '[]');

      // Ne pas inclure les ateliers supprimés dans la liste des ateliers visibles
      const visibleOrdres = data.filter(ordre => !hiddenIds.includes(ordre.id_ordre));

      this.ordres = visibleOrdres;
      this.dataSource = new MatTableDataSource<Ordre>(this.ordres);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving Order: ', error);
    });
    //let numparc = this.ordre.diagnostic.demande.vehicule.numparc;
    this.loadDiagnostic();
    this.loadTechnicien();
    this.loadAtelier();
    this.loadTravaux();
    this.loadVehicule();

  }

  /*loadOrdre(): void {
    this.ordreService.fetchAllOrders().subscribe(
      (data) => {
        this.ordres = data;
        this.filtredOrdres = data;
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.snackBar.open('Error fetching orders, please try again later.', 'Close', { duration: 5000 });
      }
    );
  }*/

  loadDiagnostic(): void {
    this.diagnosticService.fetchAllDiagnostic().subscribe(
      (data) => {
        this.diagnostics = data;
      },
      (error) => {
        console.error('Error fetching Diagnostic:', error);
      }
    );
  }

  loadTechnicien(): void {
    this.technicienService.fetchAllTechnicien().subscribe(
      (data) => {
        this.techniciens = data;
      },
      (error) => {
        console.error('Error fetching technician:', error);
      }
    );
  }

  loadAtelier(): void {
    this.atelierService.fetchAllAtelier().subscribe(
      (data) => {
        this.ateliers = data;
      },
      (error) => {
        console.error('Error fetching workshops:', error);
      }
    );
  }

  loadTravaux(): void {
    this.ordreService.fetchTravaux().subscribe(
      (data) => {
        this.travaux = data;
      },
      (error) => {
        console.error('Error fetching Works:', error);
      }
    );
  }

  loadVehicule(): void {
    this.vehiculeService.fetchAllVehicules().subscribe(
      (data) => {
        this.vehicules = data;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  searchParams: any = {}

  searchOrdre(): void {
    const filteredParams = Object.fromEntries(
      Object.entries(this.searchParams).filter(([__dirname, value]) => value !== null && value !== undefined && value !== '')
    );

    if (Object.keys(filteredParams).length === 0) {
      this.loadOrdre();
      return;
    }

    this.ordreService.searchOrdre(filteredParams).subscribe((data) => {
      this.filtredOrdres = data;
      this.dataSource.data = data;
    },
      (error) => {
        console.error('Error searching Order:', error);
      }
    );
  }

  // Reset search form
  resetSearch(): void {
    this.searchParams = {};
    this.loadOrdre();
  }

  // Apply quick filter to the table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /*searchOrder(input: any) {
    this.filtredOrdres = this.ordres.filter(item => item.urgence_panne?.toLowerCase().includes(input.toLowerCase())
      || item.travaux?.toLowerCase().includes(input.toLowerCase())
      || item.material_requis?.toLowerCase().includes(input.toLowerCase())
      || item.planning?.toLowerCase().includes(input.toLowerCase())
      || item.date_ordre?.toLowerCase().includes(input.toLowerCase())
      || item.status?.toLowerCase().includes(input.toLowerCase())
    )
    this.dataSource = new MatTableDataSource<Ordre>(this.filtredOrdres);
  }*/

  openDialog(): void {
    const dialogRef = this.dialog.open(AddOrdreComponent, {
      width: '600px',
      height: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ordreService.createOrder(result).subscribe(
          () => {
            console.log('new order created successfully!');
            window.location.reload();
          },
          (error) => {
            console.log(error);
            window.location.reload();
          });
      }
    });
  }

  editOrder(ordre: Ordre) {
    const dialogRef = this.dialog.open(AddOrdreComponent, {
      width: '600px',
      height: '600px',
      data: { ...ordre }, //passer les données de demande
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Payload to update:", result);

        this.ordreService.updateOrder(result).subscribe(
          () => {
            console.log("Order updated!", result);
            this.snackBar.open("Order updated successfully", 'close', { duration: 9000 });
            window.location.reload(); // Rafraîchir après mise à jour
          }, (error) => {
            console.error('Error while updating Order', error);
          }
        );
      }
    });
  }

  deleteOrder(id_ordre: Number) {

    /*this.ordreService.deleteOrder(id_ordre).subscribe(() => {
      this.ordres = this.ordres.filter(item => item.id_ordre !== id_ordre);
      this.snackBar.open('Order deleted successfully!', 'Close', { duration: 6000 });
      window.location.reload();
    }, (error) => {
      console.error("Error while deleting Request:", error);

    }
    );*/
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenOrdres') || '[]');
      if (!hiddenIds.includes(id_ordre)) {
        hiddenIds.push(id_ordre);
        localStorage.setItem('hiddenOrdres', JSON.stringify(hiddenIds));

        this.ordres = this.ordres.filter(item => item.id_ordre !== id_ordre);
        this.dataSource.data = this.ordres;

        // Afficher un message de confirmation
        this.snackBar.open('Order deleted successfully!', 'Close', { duration: 6000 });
      }
    }
  }

  //exprt to pdf
  generatePdf(id_ordre: number) {
    this.ordreService.generatePdfOrdre(id_ordre).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob); //Création d'un objet URL pour le blob :
      const a = document.createElement('a'); //Crée un élément <a> de manière dynamique.
      a.href = url; //Définit l'URL du fichier PDF pour le lien.
      a.download = 'document.pdf'; //nom du fichier télécharger
      a.click(); //Simule un clic sur le lien, ce qui lance le téléchargement du fichier.
      window.URL.revokeObjectURL(url); // libérer la mémoire
    })

  }

}









/*
 // Update displayed columns based on selected agency
  get currentDisplayedColumns(): string[] {
    if (this.selectedAtelierForPDF) {
      // Remove 'agence' column when an agency is selected
      return this.displayedColumns.filter(col => col !== 'atelier');
    }
    return this.displayedColumns;
  }

  // Export current filtered data to PDF
  /*exportToPdf(): void {
    // Show loading indicator or message
    // Use the same search parameters that are currently applied
    this.ordreService.generateRapport(this.searchParams)
      .subscribe({
        next: (blob: Blob) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);

          // Create a link element
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ordre.pdf';

          // Append to the document body, click it, and remove it
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Release the URL object
          window.URL.revokeObjectURL(url);
          const displayedData = this.dataSource.filteredData;
          
        },
        error: (error) => {
          console.error('Error downloading report:', error);
          // Show error message to user
          alert('Failed to download PDF report. Please try again.');
        }
      });
  }

      filters = {
        id_ordre: 0,
        id_diagnostic: 0,
        id_travaux: 0,
        id_atelier: 0,
        id_technicien: 0,
        numparc: this.numparc,
        nom_atelier: '',
        matricule_techn: this.matricule_techn,
        date_ordre: '',
        status: ''
      };

      /*generateRapport() {
    this.ordreService.generateRapport(this.ordre).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapport_ordre_travail.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        console.error('Error generating report', err);
        alert('An error occurred while downloading the report.');
      }
    });
  }*/
