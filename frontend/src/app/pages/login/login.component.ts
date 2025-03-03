import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    NgxUiLoaderModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  userRole: string = '';  // Variable pour stocker le rôle de l'utilisateur


  //email = '';
  //password = '';
  //errorMessage = '';

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

          // Sauvegarde du token et de l'utilisateur
          //this.authService.saveToken(response.token);
          //this.authService.saveUser(response.user);

          // Redirection en fonction du rôle
          const userRole = response.user.roles;
          if (userRole === 'chef de direction technique') {
            this.router.navigate(['/dashboard']);
            this.router.navigate(['/vehicule']);
          } /*else if (userRole === 'chef de direction technique') {
            this.router.navigate(['/vehicule']);
          } */else if (userRole === 'chef service maintenance') {
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

}




/*loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private tokenService: TokenService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(loginForm: any) {
    //console.log(this.loginForm.value)
    //const { email, password } = this.loginForm.value;
    this.authService.login(
      loginForm.value.email,
      loginForm.value.password
    ).subscribe(
      (response) => {
        this.tokenService.saveToken(response.token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }

  get email(){ 
    return this.loginForm.get('email');
  }

  get password(){ 
    return this.loginForm.get('password');
  }*/