import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Demande } from './demande';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "/demandes";

  fetchAllDemandes(): Observable<Demande[]> {
    return this.httpClient.get<Demande[]>(`${this.baseUrl}`);
  }

  createDemande(data: Demande) {
    return this.httpClient.post<Demande>(`${this.baseUrl}`, data);
  }

  getVehiculeByNumparc(numparc: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/vehicule/${numparc}`);
  }

  getChauffeurByNom(nom: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/chauffeur/${nom}`);
  }

  updateDemande(data: Demande) {
    return this.httpClient.put<Demande>(`${this.baseUrl}/${data.id_demande}`, data);
  }

  getDemande(id_demande: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id_demande}`);
  }

  deleteDemande(id_demande: Number) {
    return this.httpClient.delete<Demande>(`${this.baseUrl}/${id_demande}`)
  }

  /*searchDemandes(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}`);
  }*/

  // Recherche des demandes avec des paramètres filtrés
  searchDemandes(params: any): Observable<Demande[]> {
    let httpParams = new HttpParams();

    // Ajouter chaque paramètre de recherche non vide à HttpParams
    for (const key in params) {
      if (params[key] && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    // Envoi de la requête GET avec les paramètres filtrés
    return this.httpClient.get<Demande[]>(this.baseUrl, { params: httpParams });
  }

  

}
