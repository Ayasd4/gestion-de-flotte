import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Diagnostic } from './diagnostic';
import { DiagnosticService } from './diagnostic.service';
import { AddDiagnosticComponent } from '../add-diagnostic/add-diagnostic.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.css'],
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
    MatListModule,
    MatCardModule
  ]
})
export class DiagnosticComponent implements OnInit {

  displayedColumns: string[] = ['id_diagnostic', 'id_demande', 'description_panne', 'causes_panne', 'actions_panne', 'date_diagnostic', 'heure_diagnostic', 'Actions'];
  dataSource = new MatTableDataSource<Diagnostic>();
  numparc: any = undefined;

  constructor(private diagnosticService: DiagnosticService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  diagnostic: Diagnostic = {
    id_diagnostic: 0,
    demande: {
      id_demande: 0, 
    },
    description_panne: '',
    causes_panne: '',
    actions: '',
    date_diagnostic: '',
    heure_diagnostic: ''
  }

  diagnostics: Diagnostic[] = [];
  filtredDiagnostic: Diagnostic[] = [];

  ngOnInit(): void {
    this.diagnosticService.fetchAllDiagnostic().subscribe((data) => {
      console.log("data", data);  // Vérifiez la structure de la réponse API

      this.diagnostics = data;
      this.dataSource = new MatTableDataSource<Diagnostic>(data);//this.filteredDemandes
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error)=>{
      console.error('Error while retriving Diagnostic:', error);
      
    });
  }

  searchDiagnostic(input: any){
    input = input?.toString().trim().toLowerCase();

    this.filtredDiagnostic = this.diagnostics.filter(item => item.description_panne?.toLowerCase().includes(input)
    || item.causes_panne?.toLowerCase().includes(input)
    || item.actions?.toLowerCase().includes(input)
    || item.date_diagnostic?.toLowerCase().includes(input)
    || item.heure_diagnostic?.toLowerCase().includes(input)
  );

  this.dataSource = new MatTableDataSource<Diagnostic>(this.filtredDiagnostic);

  }

  editDiagnostic(diagnostic: Diagnostic){
    const dialogRef = this.dialog.open(AddDiagnosticComponent, {
      width: "400px",
      data: {...diagnostic}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result) {
        this.diagnosticService.updateDiagnostic(this.diagnostic).subscribe(()=>{
          console.log("Diagnostic updated successfully!");
            this.snackBar.open("Diagnostic updated successfully!", "close", { duration: 6000 });
            window.location.reload();
        }, (error) => {
          console.error("Error while updating Diagnostic", error);
          this.snackBar.open("Error while updating Diagnostic!", "close", { duration: 6000 });

        }
      );
      }
    })
  }  

  deleteDiagnostic(id_diagnostic: Number){
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if(isConfirmed){
      this.diagnosticService.deleteDiagnostic(id_diagnostic).subscribe(()=>{
        this.diagnostics = this.diagnostics.filter(item=> item.id_diagnostic !== id_diagnostic);
        this.snackBar.open('Diagnostic deleted successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      },(error)=>{
        console.error("Error while deleting Diagnostic:", error);
      }
    );
    }
  }

}
