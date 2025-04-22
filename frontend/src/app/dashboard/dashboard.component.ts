import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    BaseChartDirective,
    MatGridListModule
  ],

})
export class DashboardComponent {
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Ordres de travail par mois',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };

  chartType: 'bar' = 'bar';

}
