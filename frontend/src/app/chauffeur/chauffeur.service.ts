import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chauffeur } from './chauffeur';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/chauffeur";

  fetchAllChauffeurs(): Observable<Chauffeur[]> {
    return this.httpClient.get<Chauffeur[]>(`${this.baseUrl}`);
  }

  // Modifié pour accepter un FormData
  createChauffeur(formData: FormData): Observable<Chauffeur> {
    return this.httpClient.post<Chauffeur>(`${this.baseUrl}`, formData);
  }

  // Modifié pour accepter un FormData et un id
  updateChauffeur(id_chauf: number, formData: FormData): Observable<Chauffeur> {
    return this.httpClient.put<Chauffeur>(`${this.baseUrl}/${id_chauf}`, formData);
  }

  deleteChauffeur(id_chauf: Number) {
    return this.httpClient.delete<Chauffeur>(`${this.baseUrl}/${id_chauf}`);
  }
}



/**import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chauffeur } from './chauffeur';

@Injectable({
  providedIn: 'root'
})
export class ChauffeurService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string= "http://localhost:3100/chauffeur";

  fetchAllChauffeurs(): Observable<Chauffeur[]>{
    return this.httpClient.get<Chauffeur[]>(`${this.baseUrl}`);
  }

  createChauffeur(formData: FormData){
    return this.httpClient.post<Chauffeur>(`${this.baseUrl}`, formData);
  } 

  updateChauffeur(id_chauf: number, formData: FormData){
    return this.httpClient.put<Chauffeur>(`${this.baseUrl}/${id_chauf}`, formData);
  }

  deleteChauffeur(id_chauf: Number){
    return this.httpClient.delete<Chauffeur>(`${this.baseUrl}/${id_chauf}`);
  }
}
 */