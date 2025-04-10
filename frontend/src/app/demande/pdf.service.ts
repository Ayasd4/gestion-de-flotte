import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = 'http://localhost:3100/demandes/generatePdf';


  //Un Blob (objet binaire) est un type de données qui représente un fichier brut comme (pdf, image, word, vidéo...)
  generatePdf(id_demande: number): Observable<Blob> {
    return this.httpClient.get<Blob>(`${this.baseUrl}/${id_demande}`, { responseType: 'blob' as 'json' }); //pour recevoir le fichier
  }
  
}
