import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl: string = "http://localhost:3100/dashboard";
  disponibiliteUrl: string = "http://localhost:3100/disponibilite";
  ordreUrl: string = "http://localhost:3100/ordreStat";
  constructor(private httpClient: HttpClient) { }

  getTotalVehicule(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/vehicules`);
  }

  getTotalChauffeur(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/chauffeur`);
  }

  getTotalTechnicien(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/technicien`);
  }

  getTotalAtelier(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/atelier`);
  }

  getDispoService(): Observable<any> {
    return this.httpClient.get<any>(`${this.disponibiliteUrl}/totalDispoService`);
  }

  getDispoMaint(): Observable<any> {
    return this.httpClient.get<any>(`${this.disponibiliteUrl}/totalDispoMaint`);
  }

  getDispoPanne(): Observable<any> {
    return this.httpClient.get<any>(`${this.disponibiliteUrl}/totalDispoPanne`);
  }

  getDispoOuvert(): Observable<any> {
    return this.httpClient.get<any>(`${this.ordreUrl}/totalDispoOuvert`);
  }

  getDispoEnCours(): Observable<any> {
    return this.httpClient.get<any>(`${this.ordreUrl}/totalDispoEnCours`);
  }

  getDispoFerme(): Observable<any> {
    return this.httpClient.get<any>(`${this.ordreUrl}/totalDispoFerme`);
  }

  statistiquesUrl: string = "http://localhost:3100/statistiques";


  // Consommation par véhicule et par mois
  getTotalConsomationByVehiculeAndMonth(numparc: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.statistiquesUrl}/${numparc}`);
}

  
}
