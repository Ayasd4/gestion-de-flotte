import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Intervention } from './intervention';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/intervention";

   fetchAllInterventions(): Observable<Intervention[]>{
      return this.httpClient.get<Intervention[]>(`${this.baseUrl}`);
    }
  
    createIntervention(data: Intervention){
      return this.httpClient.post<Intervention>(`${this.baseUrl}`, data);
    }
  
    updateIntervention(data: Intervention){
      return this.httpClient.put<Intervention>(`${this.baseUrl}/${data.id_intervention}`, data);
    }
  
    deleteIntervention(id_intervention: Number){
      return this.httpClient.delete<Intervention>(`${this.baseUrl}/${id_intervention}`);
    }
  
  
    getOrdreByTravaux(travaux: string){
      return this.httpClient.get<any>(`${this.baseUrl}/ordre/${travaux}`);
  
    }
    
    getTechnicienByMatricule(matricule_techn: Number){
      return this.httpClient.get<any>(`${this.baseUrl}/technicien/${matricule_techn}`);
  
    }


  ApiUrl: string = "http://localhost:3100/infosIntervention";

  fetchAllOrdre(): Observable<any> {
    return this.httpClient.get(`${this.ApiUrl}/Ordre`);
  }

  fetchAllTechnicien(): Observable<any> {
    return this.httpClient.get(`${this.ApiUrl}/technicien`);
  }


}
