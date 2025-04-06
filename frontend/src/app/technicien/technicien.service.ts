import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Technicien } from './technicien';

@Injectable({
  providedIn: 'root'
})
export class TechnicienService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/technicien"

  fetchAllTechnicien(): Observable<Technicien[]> {
    return this.httpClient.get<Technicien[]>(`${this.baseUrl}`);
  }

  createTechnicien(formData: FormData): Observable<Technicien> {
    return this.httpClient.post<Technicien>(`${this.baseUrl}`, formData);
  }

  updateTechnicien(id_technicien: number, formData: FormData): Observable<Technicien> {
    return this.httpClient.put<Technicien>(`${this.baseUrl}/${id_technicien}`, formData);
  }

  deleteTechnicien(id_technicien: Number) {
    return this.httpClient.delete<Technicien>(`${this.baseUrl}/${id_technicien}`);
  }
}

