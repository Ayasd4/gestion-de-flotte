
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // Permettre l'accès à /forgot-password sans authentification
  if (state.url === '/forgot-password') {
    return true;
  }

  /*if (state.url === '/login-admin') {
    return true;
  }*/

  const user = authService.getUser(); // récupérer l'utilisateur connecté
  console.log('Utilisateur connecté:', user);

  /*if (!authService.isLoggedIn() && state.url !== '/forgot-password') {
    router.navigate(['/login']);
    return false;
  }*/

  if (!authService.isLoggedIn() || !user || !user.roles) {// || !user.role
    router.navigate(['/login']); // Rediriger si l'utilisateur n'est pas connecté
    return false;
  }

  // Vérifier si la route a une restriction de rôle
  const requiredRoles: string[] = route.data?.['roles'];
  console.log('Rôles requis:', requiredRoles); // Vérifiez ici les rôles requis pour la route

  //if (requiredRoles && user.roles !== requiredRoles) {
  if (requiredRoles && !requiredRoles.includes(user.roles)) {
    router.navigate(['/login']); // Rediriger si l'utilisateur n'a pas le bon rôle
    return false;
  }
  
  return true;
};





/*import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // L'utilisateur est authentifié
  } else {
    router.navigate(['/login']); // Redirection vers la page de connexion
    return false;
  }
};/




/*
if (requiredRoles && !requiredRoles.includes(user.role)) {
    router.navigate(['/login']); // Rediriger si l'utilisateur n'a pas le bon rôle
    return false;
  }
*/







/*  import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
 
const authService = inject(AuthService);
const router = inject(Router);

const user = authService.getUser(); // récupérer l'utilisateur connecté
console.log('Utilisateur connecté:', user);

if (!user || !user.roles) {// || !user.role
  router.navigate(['/login']); // Rediriger si l'utilisateur n'est pas connecté
  return false;
}

// Vérifier si la route a une restriction de rôle
const requiredRoles: string[] = route.data?.['roles'];
console.log('Rôles requis:', requiredRoles); // Vérifiez ici les rôles requis pour la route

if (requiredRoles && user.roles !== requiredRoles) {
  router.navigate(['/login']); // Rediriger si l'utilisateur n'a pas le bon rôle
  return false;
}

return true;
}; */