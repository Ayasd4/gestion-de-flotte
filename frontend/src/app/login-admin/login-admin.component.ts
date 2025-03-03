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
    // Login URL (POST request)
    const loginUrl = 'http://localhost:3100/login';

    // Prepare the body with email and password
    const body = {
      email: this.email,
      password: this.password
    };

    // Send POST request to the backend
    this.http.post(loginUrl, body).subscribe({
      next: (response: any) => {
        // Login successful, redirect to the dashboard
        this.router.navigate(['/dashboardAdmin']);
      },
      error: (error) => {
        // Show error message if login fails
        if (error.status === 401) {
          this.errorMessage = error.error.message || "Invalid email or password";
        } else {
          this.errorMessage = "Server error. Please try again later.";
        }
      }
    });
  }
}
