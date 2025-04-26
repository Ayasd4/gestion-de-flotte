import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Ordre } from "./ordre";
import { Travaux } from "./travaux";

@Injectable({
  providedIn: 'root'
})
export class OrdreService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/ordre";
  apiUrl: string = "http://localhost:3100/travaux"

  fetchAllOrders(): Observable<Ordre[]> {
    return this.httpClient.get<Ordre[]>(`${this.baseUrl}`);
  }

  fetchOrdreById(id_ordre: number){
    return this.httpClient.get<Ordre[]>(`${this.baseUrl}/${id_ordre}`)

  }

  fetchTravaux(): Observable<Travaux[]> {
    return this.httpClient.get<Travaux[]>(`${this.apiUrl}`);
  }

  createOrder(data: Ordre) {
    return this.httpClient.post<Ordre>(`${this.baseUrl}`, data);
  }

  updateOrder(data: Ordre) {
    return this.httpClient.put<Ordre>(`${this.baseUrl}/${data.id_ordre}`, data);
  }

  updateStatus(data: Ordre) {
    return this.httpClient.put<Ordre>(`${this.baseUrl}/status/${data.id_ordre}`, data);
  }

  deleteOrder(id_ordre: Number) {
    return this.httpClient.delete<Ordre>(`${this.baseUrl}/${id_ordre}`);
  }

  getDiagnosticByPanne(description_panne: string) {
    return this.httpClient.get<any>(`${this.baseUrl}/diagnostic/${description_panne}`);
  }

  getAtelierByNom(nom_atelier: string) {
    return this.httpClient.get<any>(`${this.baseUrl}/atelier/${nom_atelier}`);

  }

  getTechnicienByMatricule(matricule_techn: Number) {
    return this.httpClient.get<any>(`${this.baseUrl}/technicien/${matricule_techn}`);

  }

  getTravauxByNom(nom_travail: string) {
    return this.httpClient.get<any>(`${this.baseUrl}/travaux/${nom_travail}`);

  }

  // Recherche des demandes avec des paramètres filtrés
  searchOrdre(params: any): Observable<Ordre[]> {
    let httpParams = new HttpParams();

    // Ajouter chaque paramètre de recherche non vide à HttpParams
    for (const key in params) {
      if (params[key] && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    // Envoi de la requête GET avec les paramètres filtrés
    return this.httpClient.get<Ordre[]>(this.baseUrl, { params: httpParams });
  }

  //Un Blob (objet binaire) est un type de données qui représente un fichier brut comme (pdf, image, word, vidéo...)
  generatePdfOrdre(id_ordre: number): Observable<Blob> {
    return this.httpClient.get<Blob>(`${this.baseUrl}/generatePdf/${id_ordre}`, { responseType: 'blob' as 'json' }); //pour recevoir le fichier
  }

  generateRapport(params: any): Observable<Blob> {
    
    // Build query string from parameters
    const queryParams = Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return this.httpClient.get(`${this.baseUrl}/generateRapport?${queryParams}`, {
      responseType: 'blob'
    });
  }

}
