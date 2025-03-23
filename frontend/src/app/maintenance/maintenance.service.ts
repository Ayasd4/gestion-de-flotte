import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Demande } from '../demande/demande';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private httpClient: HttpClient) { }
  
    baseUrl: string = "http://localhost:3100/getDemandes";
    apiUrl: string = "http://localhost:3100/updateStatus";
  
    getDemandes(): Observable<Demande[]> {
      return this.httpClient.get<Demande[]>(`${this.baseUrl}`);
    }

    deleteDemande(id_demande: Number){
      return this.httpClient.delete<Demande>(`${this.baseUrl}/${id_demande}`)
    }

    updateStatus(data: Demande){
      return this.httpClient.put<Demande>(`${this.apiUrl}/${data.id_demande}`,data);
    }
}
