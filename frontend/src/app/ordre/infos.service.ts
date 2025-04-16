import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfosService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/infos";

  fetchAllDiagnostic(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/diagnostic`);
  }

  fetchAllAtelier(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/atelier`);
  }

  fetchAllTechnicien(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/technicien`);
  }

  fetchAllTravaux(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/travaux`);
  }
}
