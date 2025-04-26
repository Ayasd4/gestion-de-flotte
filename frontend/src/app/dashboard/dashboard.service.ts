import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  baseUrl: string = "http://localhost:3100/dashboard";

  constructor(private httpClient: HttpClient) { }

  getTotalVehicule(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/vehicules`);
  }

  getTotalChauffeur(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/chauffeur`);
  }

  getTotalTechnicien(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/technicien`);
  }

  getTotalAtelier(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/atelier`);
  }

  Url: string = "http://localhost:3100/disponibilite";

  getDispoService(): Observable<any>{
    return this.httpClient.get<any>(`${this.Url}/totalDispoService`);
  }

  getDispoMaint(): Observable<any>{
    return this.httpClient.get<any>(`${this.Url}/totalDispoMaint`);
  }

  getDispoPanne(): Observable<any>{
    return this.httpClient.get<any>(`${this.Url}/totalDispoPanne`);
  }

  ordreUrl: string = "http://localhost:3100/ordreStat";

  getDispoOuvert(): Observable<any>{
    return this.httpClient.get<any>(`${this.ordreUrl}/totalDispoOuvert`);
  }

  getDispoEnCours(): Observable<any>{
    return this.httpClient.get<any>(`${this.ordreUrl}/totalDispoEnCours`);
  }

  getDispoFerme(): Observable<any>{
    return this.httpClient.get<any>(`${this.ordreUrl}/totalDispoFerme`);
  }

  
}
