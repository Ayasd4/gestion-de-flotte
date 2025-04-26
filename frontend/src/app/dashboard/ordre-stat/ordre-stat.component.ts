import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartModule } from 'angular-highcharts';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-ordre-stat',
  templateUrl: './ordre-stat.component.html',
  styleUrls: ['./ordre-stat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule

  ]
})
export class OrdreStatComponent implements OnInit {

  chart!: Chart;

  constructor(private dashboardService: DashboardService) { }
  dispoOuvert: number = 0;
  dispoEnCours: number = 0;
  dispoFerme: number = 0;

  ngOnInit(): void {
    this.loadDisponibilites();
  }

  loadDisponibilites() {
    // On attend les 3 appels à l’API avant de créer le graphique
    Promise.all([
      this.dashboardService.getDispoOuvert().toPromise(),
      this.dashboardService.getDispoEnCours().toPromise(),
      this.dashboardService.getDispoFerme().toPromise()
    ])
      .then(([resOuvert, resEnCours, resFerme]) => {
        this.dispoOuvert = parseFloat(resOuvert.disponibilite.replace('%', ''));
        this.dispoEnCours = parseFloat(resEnCours.disponibilite.replace('%', ''));
        this.dispoFerme = parseFloat(resFerme.disponibilite.replace('%', ''));

        this.createChart();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des disponibilités :', error);
      });
  }

  createChart() {
    const self = this; // pour accéder aux données dans le scope de render()
  
    this.chart = new Chart({
      chart: {
        type: 'pie',
        height: 325,
        events: {
          render() {
            const chart = this,
              series = chart.series[0];
            let customLabel: any = (chart as any).customLabel;
  
            const total = self.dispoOuvert + self.dispoEnCours + self.dispoFerme;
  
            if (!customLabel) {
              (chart as any).customLabel = chart.renderer
                .label(`Total<br/><strong>${total}</strong>`, 0, 0)
                .css({
                  color: '#000',
                  textAlign: 'center'
                })
                .add();
              customLabel = (chart as any).customLabel;
            }
  
            const x = series.center[0] + chart.plotLeft;
            const y = series.center[1] + chart.plotTop - (customLabel.getBBox().height / 2);
  
            customLabel.attr({ x, y });
            customLabel.css({
              fontSize: `${series.center[2] / 12}px`
            });
          }
        }
      },
      title: {
        text: 'Order Disponibilities'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '75%',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.0f}%',
            style: {
              fontSize: '11px'
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Orders',
          data: [
            {
              name: 'Ouvert',
              y: this.dispoOuvert,
              color: '#93C572'
            },
            {
              name: 'En cours',
              y: this.dispoEnCours,
              color: '#89CFF0'
            },
            {
              name: 'Fermé',
              y: this.dispoFerme,
              color: '#99182C'
            }
          ]
        }
      ],
      credits: {
        enabled: false
      }
    });
  }
  

  /*createChart() {
    this.chart = new Chart({
      chart: {
        type: 'pie',
        height: 325
      },
      title: {
        text: 'Order Disponibilities'
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              name: 'Ouvert',
              y: this.dispoOuvert,
              color: '#93C572'
            },
            {
              name: 'En cours',
              y: this.dispoEnCours,
              color: '#89CFF0'
            },
            {
              name: 'Fermé',
              y: this.dispoFerme,
              color: '#99182C' //800000
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
  }*/

}
