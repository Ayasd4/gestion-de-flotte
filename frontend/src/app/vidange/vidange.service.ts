import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vidange } from './vidange';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VidangeService {

  baseUrl: string = "http://localhost:3100/vidanges";

  constructor(private httpClient: HttpClient) { }

  fetchAllVidanges(): Observable<Vidange[]> {
    return this.httpClient.get<Vidange[]>(`${this.baseUrl}`);
  }

  createVidange(data: Vidange) {
    return this.httpClient.post<Vidange>(`${this.baseUrl}`, data);
  }

  updateVidange(data: Vidange) {
    return this.httpClient.put<Vidange>(`${this.baseUrl}/${data.id_vd}`, data);
  }

  deleteVidange(id_vd: number) {
    return this.httpClient.delete<Vidange>(`${this.baseUrl}/${id_vd}`);
  }

  searchVidanges(params: any): Observable<Vidange[]> {
    let httpParams = new HttpParams();

    // Ajouter chaque paramètre de recherche non vide à HttpParams
    for (const key in params) {
      if (params[key] && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    // Envoi de la requête GET avec les paramètres filtrés
    return this.httpClient.get<Vidange[]>(this.baseUrl, { params: httpParams });
  }
}
