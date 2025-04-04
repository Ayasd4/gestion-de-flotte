import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ordre } from './ordre';

@Injectable({
  providedIn: 'root'
})
export class OrdreService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/ordre";


  fetchAllOrders(): Observable<Ordre[]>{
    return this.httpClient.get<Ordre[]>(`${this.baseUrl}`);
  }

  createOrder(data: Ordre){
    return this.httpClient.post<Ordre>(`${this.baseUrl}`, data);
  }

  updateOrder(data: Ordre){
    return this.httpClient.put<Ordre>(`${this.baseUrl}/${data.id_ordre}`, data);
  }

  updateStatus(data: Ordre){
    return this.httpClient.put<Ordre>(`${this.baseUrl}/status/${data.id_ordre}`, data);
  }

  deleteOrder(id_ordre: Number){
    return this.httpClient.delete<Ordre>(`${this.baseUrl}/${id_ordre}`);
  }

  getDiagnosticByPanne(description_panne: string){
    return this.httpClient.get<any>(`${this.baseUrl}/diagnostic/${description_panne}`);
  }

  getAtelierByNom(nom_atelier: string){
    return this.httpClient.get<any>(`${this.baseUrl}/atelier/${nom_atelier}`);

  }
  
  getTechnicienByMatricule(matricule_techn: Number){
    return this.httpClient.get<any>(`${this.baseUrl}/technicien/${matricule_techn}`);

  }
}
