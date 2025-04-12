import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class LoginAdminComponent {

  // Déclaration des variables pour stocker l'email et le mot de passe
  email: string = '';
  password: string = '';
  errorMessage: string = '';// Variable pour afficher un message d'erreur

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginUrl = 'http://localhost:3100/login';

    // Prepare the body with email and password
    const body = {
      email: this.email,
      password: this.password
    };

    // Send POST request to the backend
    this.http.post(loginUrl, body).subscribe({
      next: (response: any) => {
        // Check if the response contains user information
        if (response && response.roles) {
          // Check if the user has the 'admin' role (or any role you want to test)
          if (response.roles.toLowerCase() === 'admin') {
            // Redirect to admin dashboard if role is 'admin'
            console.log('Admin user:', response);
            this.router.navigate(['/dashboardAdmin']);
            localStorage.setItem('currentUser', JSON.stringify(response));
          } else if (response.roles.toLowerCase() === 'agent de saisie maîtrise de l’énergie'){
            // Redirect to user dashboard if role is not 'admin'
            console.log('Non-admin user:', response);
            this.router.navigate(['/consomation']);
            localStorage.clear();
            localStorage.setItem('currentUser', JSON.stringify(response));
            // You can also store user details in local storage or a service for further use
          }else{
            this.router.navigate(['/login']);


          }
        } else {
          // If no roles are found, handle as an error or show message
          console.error('Invalid response or no role found');
          this.errorMessage = 'User role not found. Please try again.';
        }
      },
      error: (error) => {
        // Show error message if login fails
        if (error.status === 401) {
          this.errorMessage = error.error.message || 'Invalid email or password';
        } else {
          this.errorMessage = 'Server error. Please try again later.';
        }
      }
    });
  }
}