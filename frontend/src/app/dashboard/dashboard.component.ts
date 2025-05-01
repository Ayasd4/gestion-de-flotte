import { Component, Input, OnInit } from '@angular/core';
import { TopWidgetsComponent } from './top-widgets/top-widgets.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { DisponibiliteComponent } from './disponibilite/disponibilite.component';
import { OrdreStatComponent } from './ordre-stat/ordre-stat.component';
import { ConsommationStatComponent } from './consommation-stat/consommation-stat.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    TopWidgetsComponent,
    DisponibiliteComponent,
    OrdreStatComponent,
    ConsommationStatComponent
  ]
})

export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }


}
