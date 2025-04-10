import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Intervention } from './intervention';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  getAllOrdres() {
    throw new Error('Method not implemented.');
  }
  getAllTechniciens() {
    throw new Error('Method not implemented.');
  }
  addIntervention(interventionData: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/intervention";
  Url = "http://localhost:3100/getOrdreById";

  fetchAllInterventions(): Observable<Intervention[]> {
    return this.httpClient.get<Intervention[]>(`${this.baseUrl}`);
  }

  createIntervention(data: Intervention) {
    return this.httpClient.post<Intervention>(`${this.baseUrl}`, data);
  }

  updateIntervention(data: Intervention) {
    return this.httpClient.put<Intervention>(`${this.baseUrl}/${data.id_intervention}`, data);
  }

  deleteIntervention(id_intervention: Number) {
    return this.httpClient.delete<Intervention>(`${this.baseUrl}/${id_intervention}`);
  }


  getOrdreByTravaux(travaux: string) {
    return this.httpClient.get<any>(`${this.baseUrl}/ordre/${travaux}`);

  }

  getTechnicienByMatricule(matricule_techn: Number) {
    return this.httpClient.get<any>(`${this.baseUrl}/technicien/${matricule_techn}`);

  }

  getOrdreById(id_ordre: Number): Observable<any> {
    return this.httpClient.get<any>(`${this.Url}/${id_ordre}`);
  }

  //Un Blob (objet binaire) est un type de données qui représente un fichier brut comme (pdf, image, word, vidéo...)
  generatePdfIntervention(id_intervention: number): Observable<Blob> {
    return this.httpClient.get<Blob>(`${this.baseUrl}/generatePdf/${id_intervention}`, { responseType: 'blob' as 'json' }); //pour recevoir le fichier
  }


  ApiUrl: string = "http://localhost:3100/infosIntervention";

  fetchAllOrdre(): Observable<any> {
    return this.httpClient.get(`${this.ApiUrl}/Ordre`);
  }

  fetchAllTechnicien(): Observable<any> {
    return this.httpClient.get(`${this.ApiUrl}/technicien`);
  }

  // Recherche des demandes avec des paramètres filtrés
  searchIntervention(params: any): Observable<Intervention[]> {
    let httpParams = new HttpParams();

    // Ajouter chaque paramètre de recherche non vide à HttpParams
    for (const key in params) {
      if (params[key] && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    // Envoi de la requête GET avec les paramètres filtrés
    return this.httpClient.get<Intervention[]>(this.baseUrl, { params: httpParams });
  }

}
