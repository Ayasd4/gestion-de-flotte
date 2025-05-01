import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ChartModule } from 'angular-highcharts';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardService } from '../dashboard/dashboard.service';
import { NumparcService } from '../services/numparc.service';
import { Vehicule } from '../vehicule/vehicule';
import { VehiculeService } from '../vehicule/vehicule.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css'],
  standalone: true,


   imports: [
      CommonModule,
      FormsModule,
      ChartModule,
      MatSelectModule,
      MatFormFieldModule,
      MatDialogModule,
      MatOptionModule,
      ReactiveFormsModule,
      HighchartsChartModule ,
      MatSnackBarModule
    ]
})
export class StatComponent {

 Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  numparc: any = undefined;
  annee: any = undefined;

  //numparc: string = '';
  vehicule: Vehicule = {
    idvehicule: 0,
    numparc: this.numparc,
    immatricule: '',
    modele: '',
    annee: this.annee,
    etat: ''
  };

  vehicules: Vehicule[] = [];
  showChart: boolean = false;
  numparcList: number[] = [];

  constructor(private dashboardService: DashboardService,
    private numparcService: NumparcService,
    private vehiculeService: VehiculeService,
    private snackBar: MatSnackBar

  ) { 
    this.getNumparc();
  }
  ngOnInit(): void {
    this.fetchConsomation();
  
  }

  getNumparc() {
    this.numparcService.fetchAllNumparc().subscribe({
      next: (data) => {
        console.log('List of numparc received:', data);  // Vérifiez si les données sont bien récupérées
        //this.numparcList = data;
        this.numparcList = data.map((item: any) => item.numparc);
      },
      error: (err) => {
        console.error('Error loading numparcs', err);
      }
    });
  }
  fetchConsomation() {
    /*if (!this.numparc) {
      alert('Veuillez entrer un numéro de parc');
      return;
    }*/

    this.dashboardService.getTotalConsomationByVehiculeAndMonth(this.numparc).subscribe({
      next: (data) => {
        const categories = data.map(d => `${d.mois}/${d.annee}`);
        const seriesData = data.map(d => d.total_consommation);

        this.chartOptions = {
          chart: {
            type: 'line'
          },
          title: {
            text: `Consommation de carburant pour ${this.numparc}`
          },
          xAxis: {
            categories: categories
          },
          yAxis: {
            title: {
              text: 'Total Consommation (Litres)'
            }
          },
          series: [{
            name: 'Consommation',
            data: seriesData,
            type: 'line'
          }]
        };

        this.showChart = true;
      },
      error: (err) => {
        //console.error(err);
        this.snackBar.open('vehicule doesnt exist', 'close', {duration: 8000});

       // alert('Erreur lors  la récupération des données');
      }
    });
  }
}
