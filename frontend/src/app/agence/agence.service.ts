import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Agence {
  id_agence: number;
  nom: string;
  adress: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgenceService {
  constructor(private httpClient: HttpClient) {}
  baseUrl: string = "http://localhost:3100/agence";

  fetchAllAgences(): Observable<Agence[]> {
    return this.httpClient.get<Agence[]>(`${this.baseUrl}`);
  }

  getAgenceById(id_agence: number): Observable<Agence> {
    return this.httpClient.get<Agence>(`${this.baseUrl}/${id_agence}`);
  }
}