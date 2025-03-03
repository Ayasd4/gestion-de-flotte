import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicule } from './vehicule';

@Injectable({
  providedIn: 'root',
  
})
export class VehiculeService {

  constructor(private httpClient:HttpClient) {}
    baseUrl: string= "/vehicules"; 


    fetchAllVehicules():Observable<Vehicule[]>{
      return this.httpClient.get<Vehicule[]>(`${this.baseUrl}`);
    }

    createVehicule(data: Vehicule){
      return this.httpClient.post<Vehicule>(`${this.baseUrl}`, data);
    }

    updateVehicule(data: Vehicule){
      return this.httpClient.put<Vehicule>(`${this.baseUrl}/${data.idvehicule}`, data);
    }    

    deleteVehicule(idvehicule: Number){
      return this.httpClient.delete<Vehicule>(`${this.baseUrl}/${idvehicule}`);
    }
}
