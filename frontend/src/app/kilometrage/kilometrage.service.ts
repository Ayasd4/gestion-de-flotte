import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kilometrage } from './kilometrage';

@Injectable({
  providedIn: 'root'
})
export class KilometrageService {
  private apiUrl = 'http://localhost:3100/kilometrage';

  constructor(private http: HttpClient) { }

  // Get all kilometrage records
  getKilometrages(): Observable<Kilometrage[]> {
    return this.http.get<Kilometrage[]>(this.apiUrl);
  }

  // Get kilometrage by ID
  getKilometrageById(id: number): Observable<Kilometrage[]> {
    return this.http.get<Kilometrage[]>(`${this.apiUrl}/${id}`);
  }

  // Create new kilometrage record
  createKilometrage(kilometrage: Kilometrage): Observable<any> {
    return this.http.post(this.apiUrl, kilometrage);
  }

  // Update kilometrage record
  updateKilometrage(id: number, kilometrage: Kilometrage): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, kilometrage);
  }

  // Delete kilometrage record
  deleteKilometrage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get total kilometrage for a specific vehicle
  getVehicleTotal(vehiculeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehicle/${vehiculeId}`);
  }
}