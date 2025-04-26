import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Etat } from './etat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtatService {
  baseUrl: string = "http://localhost:3100/etatVidange";
  apiUrl: string = "http://localhost:3100/kilometrage";

  constructor(private httpClient: HttpClient) { }

  fetchAllEtats(): Observable<Etat[]> {
    return this.httpClient.get<Etat[]>(`${this.baseUrl}`);
  }

  createEtat(data: Etat) {
    return this.httpClient.post<Etat>(`${this.baseUrl}`, data);
  }

  updateEtat(data: Etat) {
    return this.httpClient.put<Etat>(`${this.baseUrl}/${data.id_vidange}`, data);
  }

  deleteEtat(id_vidange: number) {
    return this.httpClient.delete<Etat>(`${this.baseUrl}/${id_vidange}`);
  }

  fetchKilometrageByNumparc(numparc: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/vehicule/${numparc}`);
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


