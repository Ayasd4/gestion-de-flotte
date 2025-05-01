import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  userRole: string = '';  // Variable pour stocker le rôle de l'utilisateur

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private ngxService: NgxUiLoaderService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  /*goToForgotPage(){
    this.router.navigate(['/forgot-password']);
  }*/

  login() {

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.ngxService.start();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {


        console.log('Réponse de connexion:', response); // Inspecte la réponse

        if (response && response.token && response.user) {
          // Sauvegarder le token et l'utilisateur dans le localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          console.log("Utilisateur stocké dans localStorage:", localStorage.getItem('user')); // 🛠️ Vérifier le stockage
          console.log("Token stocké dans localStorage:", localStorage.getItem('token'));

          this.authService.setLoggedIn(true);

          this.ngxService.stop();

          // Redirection en fonction du rôle
          const userRole = response.user.roles;

          if (userRole === 'chef de direction technique') {
            this.router.navigate(['/dashboard']);
            this.router.navigate(['/vehicule']);
            this.router.navigate(['/chauffeur']);
            this.router.navigate(['/atelier']);


          } else if (userRole === 'chef service maintenance') {
            this.router.navigate(['/maintenance']);
            this.router.navigate(['/diagnostic']);

          } else if (userRole === 'Responsable maintenance') {
            this.router.navigate(['/orders']);
            this.router.navigate(['/intervention']);
          } else if (userRole === 'chef d’agence') {
            this.router.navigate(['/demande']);

          }

          else if (userRole === 'Chef service maîtrise de l\'énergie') {
            this.router.navigate(['/etat']);
            this.router.navigate(['/vidange']);

            this.router.navigate(['/stat']);
          }

          else if (userRole === 'Agent de saisie maîtrise de l\'énergie') {
            this.router.navigate(['/consomation']);
            this.router.navigate(['/kilometrage']);

          }
          /*else if (userRole === '') {
            this.router.navigate(['/forgot-password']);

          }*/

          else {
            this.router.navigate(['/login']); // Rôle non reconnu
          }


        } else {
          this.errorMessage = 'Invalid credentials';
          console.error('Réponse non valide');
        }

      },
      error: (error) => {
        this.ngxService.stop();
        console.error('Login error', error);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }



}




/*
  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.ngxService.start();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.ngxService.stop();

        console.log('Réponse de connexion:', response); // Inspecte la réponse

        if (response && response.token && response.user) {
          // Sauvegarder le token et l'utilisateur dans le localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.authService.isLoggedInSubject.next(true); // 🔹 Met à jour l'état de connexion


          // Sauvegarde du token et de l'utilisateur
          //this.authService.saveToken(response.token);
          //this.authService.saveUser(response.user);

          // Redirection en fonction du rôle
          const userRole = response.user.roles; //const userRole = response.user.roles;
          if (userRole === 'chef de direction technique') {
            this.router.navigate(['/dashboard']);
            this.router.navigate(['/vehicule']);
          } /*else if (userRole === 'chef de direction technique') {
            this.router.navigate(['/vehicule']);
          } else if (userRole === 'chef service maintenance') {
            this.router.navigate(['/maintenance']);
          } else if (userRole === 'agent de saisie maîtrise de l\'énergie') {
            this.router.navigate(['/kilometrage']);
          } else {
            this.router.navigate(['/login']); // Rôle non reconnu
          }
        } else {
          this.errorMessage = 'Invalid credentials';
          console.error('Réponse non valide');
        }
      },
      error: (error) => {
        this.ngxService.stop();
        console.error('Login error', error);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
*/