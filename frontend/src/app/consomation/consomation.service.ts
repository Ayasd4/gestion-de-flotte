import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consomation } from './consomation';

@Injectable({
  providedIn: 'root'
})
export class ConsomationService {

  constructor(private httpClient: HttpClient) {}
  baseUrl: string = "http://localhost:3100/consomation";

  // Get all fuel consumption records
  fetchAllConsomations(): Observable<Consomation[]> {
    return this.httpClient.get<Consomation[]>(`${this.baseUrl}`);
  }

  // Get fuel consumption record by ID
  getConsomationById(idConsomation: number): Observable<Consomation[]> {
    return this.httpClient.get<Consomation[]>(`${this.baseUrl}/${idConsomation}`);
  }

  // Create new fuel consumption record
  createConsomation(data: Consomation): Observable<Consomation> {
    return this.httpClient.post<Consomation>(`${this.baseUrl}`, data);
  }

  // Update fuel consumption record
  updateConsomation(data: Consomation): Observable<Consomation> {
    return this.httpClient.put<Consomation>(`${this.baseUrl}/${data.idConsomation}`, data);
  }

  // Delete fuel consumption record
  deleteConsomation(idConsomation: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${idConsomation}`);
  }

  // Search fuel consumption records by parameters
  searchConsomations(params: any): Observable<Consomation[]> {
    // Build query string from parameters
    const queryParams = Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return this.httpClient.get<Consomation[]>(`${this.baseUrl}?${queryParams}`);
  }

  // Search by numPark specifically
  searchByNumPark(numPark: string): Observable<Consomation[]> {
    return this.httpClient.get<Consomation[]>(`${this.baseUrl}/search/numpark/${numPark}`);
  }
  
  // Export fuel consumption records to PDF
  exportToPdf(params: any): Observable<Blob> {
    // Build query string from parameters
    const queryParams = Object.keys(params)
      .filter(key => params[key] !== null && params[key] !== undefined)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return this.httpClient.get(`${this.baseUrl}/export/pdf?${queryParams}`, {
      responseType: 'blob'
    });
  }
}