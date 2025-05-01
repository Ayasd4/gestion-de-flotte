import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartModule } from 'angular-highcharts';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-disponibilite',
  templateUrl: './disponibilite.component.html',
  styleUrls: ['./disponibilite.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule
  ]
})
export class DisponibiliteComponent implements OnInit {

  chart!: Chart;

  constructor(private dashboardService: DashboardService) { }
  dispoService: number = 0;
  dispoMaint: number = 0;
  dispoPanne: number = 0;

  ngOnInit(): void {
    this.loadDisponibilites();
  }

  loadDisponibilites() {
    // On attend les 3 appels à l’API avant de créer le graphique
    Promise.all([
      this.dashboardService.getDispoService().toPromise(),
      this.dashboardService.getDispoMaint().toPromise(),
      this.dashboardService.getDispoPanne().toPromise()
    ])
      .then(([resService, resMaint, resPanne]) => {
        this.dispoService = parseFloat(resService.disponibilite.replace('%', ''));
        this.dispoMaint = parseFloat(resMaint.disponibilite.replace('%', ''));
        this.dispoPanne = parseFloat(resPanne.disponibilite.replace('%', ''));

        this.createChart();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des disponibilités :', error);
      });
  }

  createChart() {
    this.chart = new Chart({
      chart: {
        type: 'pie',
        height: 325
      },
      title: {
        text: 'Vehicles Disponibilities'
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              name: 'En Service',
              y: this.dispoService,
              color: '#28a745'
            },
            {
              name: 'En Maintenance',
              y: this.dispoMaint,
              color: '#ffc107'
            },
            {
              name: 'En Panne',
              y: this.dispoPanne,
              color: '#dc3545'
            }
          ]
        }
      ],
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          size: '75%',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: 'black',
              fontSize: '10.5px'
            }
          },
          showInLegend: false
        }
      },
      credits: {
        enabled: false
      }
    });
  }

  

}
