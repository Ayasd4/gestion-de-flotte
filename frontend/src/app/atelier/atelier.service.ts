import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Atelier } from './atelier';

@Injectable({
  providedIn: 'root'
})
export class AtelierService {
  items: any;

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/atelier";

  fetchAllAtelier(): Observable<Atelier[]> {
    return this.httpClient.get<Atelier[]>(`${this.baseUrl}`);
  }

  createAtelier(data: Atelier) {
    return this.httpClient.post<Atelier>(`${this.baseUrl}`, data);
  }

  updateAtelier(data: Atelier) {
    return this.httpClient.put<Atelier>(`${this.baseUrl}/${data.id_atelier}`, data);
  }

  deleteAtelier(id_atelier: Number) {
    return this.httpClient.delete<Atelier>(`${this.baseUrl}/${id_atelier}`);
  }

  /*supprimerLocalement(id_atelier: number): void {
    this.items = this.items.filter(item => item.id_atelier !== id_atelier);
  }*/

}
