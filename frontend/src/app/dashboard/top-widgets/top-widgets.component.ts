import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBus,
  faCar,
  faTools,
  faUserGear,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-top-widgets',
  templateUrl: './top-widgets.component.html',
  styleUrls: ['./top-widgets.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class TopWidgetsComponent implements OnInit {

  totalVehicles: number = 0;
  totalDrivers: number = 0;
  totalTechnicians: number = 0;
  totalAteliers: number = 0;

  faBus = faBus;
  faCar = faCar;
  faUserTie = faUserTie;
  faTools = faTools;
  faUserGear = faUserGear;
  /*faLocation = faLocation;
  faShop = faShop;
  faBoxes = faBoxes;
  faMoneyBill = faMoneyBill;*/

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadTotalVehicules();
    this.loadTotalDrivers();
    this.loadTotalTechnicians();
    this.loadTotalAteliers();
  }

  loadTotalVehicules() {
    this.dashboardService.getTotalVehicule().subscribe({
      next: (response) => {
        this.totalVehicles = response.total;
      },
      error: (error) => {
        console.error('Error while load number of vehicule:', error);
      }
    })
  }

  loadTotalDrivers() {
    this.dashboardService.getTotalChauffeur().subscribe({
      next: (response) => {
        this.totalDrivers = response.total;
      },
      error: (error) => {
        console.error('Error while load number of Drivers:', error);
      }
    })
  }

  loadTotalTechnicians() {
    this.dashboardService.getTotalTechnicien().subscribe({
      next: (response) => {
        this.totalTechnicians = response.total;
      },
      error: (error) => {
        console.error('Error while load number of Technicians:', error);
      }
    })
  }

  loadTotalAteliers() {
    this.dashboardService.getTotalAtelier().subscribe({
      next: (response) => {
        this.totalAteliers = response.total;
      },
      error: (error) => {
        console.error('Error while load number of Workshops:', error);
      }
    })
  }

}