import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = "/authentification";

  //private user: any = null;

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, { email, password });
  }

  forgotPassword(email: string): Observable<any>{
    return this.httpClient.post(`${this.baseUrl}/forgotPassword`, {email});
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any>{
    return this.httpClient.post(`${this.baseUrl}/changePassword`, {oldPassword, newPassword});
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Vérifie si le token existe
  }

  getUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  saveUser(user: any){
    localStorage.setItem('user', JSON.stringify(user)); //Stocker l'utilisateur après connexion
  }

  /*saveToken(token: string){
    localStorage.setItem('token', token); // Stocke le token dans le localStorage
  }*/



}
