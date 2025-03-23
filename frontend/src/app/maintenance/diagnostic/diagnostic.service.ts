import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnostic } from './diagnostic';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {

  constructor(private httpClient: HttpClient) { }

  baseUrl= "http://localhost:3100/diagnostic";
  Url= "http://localhost:3100/getDemandeById";

  fetchAllDiagnostic(): Observable<Diagnostic[]>{
    return this.httpClient.get<Diagnostic[]>(`${this.baseUrl}`);
  }

  createDiagnostic(data: Diagnostic){
    return this.httpClient.post<Diagnostic>(`${this.baseUrl}`, data);
  }

  updateDiagnostic(data: Diagnostic){
    return this.httpClient.put<Diagnostic>(`${this.baseUrl}/${data.id_diagnostic}`, data);
  }

  deleteDiagnostic(id_diagnostic: Number){
    return this.httpClient.delete<Diagnostic>(`${this.baseUrl}/${id_diagnostic}`);
  }

  getDemandeById(id_demande: Number): Observable<any>{
    return this.httpClient.get<any>(`${this.Url}/${id_demande}`);
  }

}
