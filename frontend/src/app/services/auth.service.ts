import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Définir un type pour la réponse d'authentification
interface AuthResponse {
  token: string;
  user: any; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = "/authentification";

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userSubject: any;
  //adminSubject: any;
  

  constructor(private httpClient: HttpClient) {
    this.userSubject = new BehaviorSubject<any>(null);
    const userData = localStorage.getItem('user');
    //const adminData = localStorage.getItem('admin');
    if (userData) {
      this.userSubject.next(JSON.parse(userData)); // Charger l'utilisateur existant au démarrage
    }
    
    /*if(adminData){
      this.adminSubject.next(JSON.parse(adminData));
    }*/
   }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<AuthResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      
      tap((response) => {
        if (response && response.token && response.user) {
          

          console.log('User conected:', response.user); // Vérifiez ici si le rôle est présent dans l'objet `user`
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));          
          this.isLoggedInSubject.next(true); // Met à jour l'état
          window.location.reload();
        } else {
          throw new Error("Invalid response from server");
        }
      })
    );

  }


  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/forgotPassword`, { email });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token'); // Récupération du token stocké dans localStorage
    
    if (!token) {
      throw new Error('Token manquant ! L’utilisateur doit se reconnecter.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); //const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.post(`${this.baseUrl}/changePassword`, { oldPassword, newPassword }, {headers});
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false); // Met à jour l'état
    this.userSubject.next(null); // Met à jour l'utilisateur déconnecté
    window.location.reload()
  }

  /*logoutAdmin() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this.isLoggedInSubject.next(false); 
    this.adminSubject.next(null); // Met à jour l'admin déconnecté
  }*/

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Vérifie si le token existe
    
  }

  setLoggedIn(status: boolean) {
    this.isLoggedInSubject.next(status);
  }

  getUser(): any {
    const userData = localStorage.getItem('user');
    console.log('Utilisateur récupéré du localStorage:', userData); //  déboguer
    
    if(userData){
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /*getUser(): any {
    const userData = localStorage.getItem('user');
    console.log('Utilisateur récupéré du localStorage:', userData); //  déboguer
    return userData ? JSON.parse(userData) : null;
  }*/

  /*getAdmin(): any{
    const adminData = localStorage.getItem('admin');
    console.log('Admin récupéré du localStorage:', adminData); 
    return adminData ? JSON.parse(adminData) : null;

  }
*/

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user)); //Stocker l'utilisateur après connexion
  }

  /*saveAdmin(admin: any) {
    localStorage.setItem('admi', JSON.stringify(admin)); //Stocker l'admin après connexion
  }*/
}






/*import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Définir un type pour la réponse d'authentification
interface AuthResponse {
  token: string;
  user: any; // Remplacer `any` par un type plus spécifique si nécessaire
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = "/authentification";

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();


  //private user: any = null;

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response && response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isLoggedInSubject.next(true); // 🔹 Met à jour l'état
        } else {
          throw new Error("Invalid response from server");
        }
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/forgotPassword`, { email });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/changePassword`, { oldPassword, newPassword });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false); // 🔹 Met à jour l'état

  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Vérifie si le token existe
  }

  setLoggedIn(status: boolean) {
    this.isLoggedInSubject.next(status);
  }


  getUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user)); //Stocker l'utilisateur après connexion
  }
}*/


  /*saveToken(token: string){
    localStorage.setItem('token', token); // Stocke le token dans le localStorage
  }*/




