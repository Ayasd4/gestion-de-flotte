import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class DashboardAdminComponent implements OnInit{

  users: any[] = [];
  isFormVisible = false;
  isEditing = false;
  
  userForm: any = {
    nom: '',
    prenom: '',
    telephone:'',
    email: '',
    password: '',
    roles: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    const token = localStorage.getItem('token'); // Récupérer le token
  
    if (!token) {
      console.error("Token non trouvé !");
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` }; // Ajouter l'en-tête d'authentification
  
    this.http.get<any[]>('http://localhost:3100/utilisateur', { headers })
      .subscribe(
        (data) => {
          console.log("Users fetched:", data);
          this.users = data;
        },
        (error) => {
          console.error("Error fetching users:", error);
        }
      );
  }
  

  /*fetchUsers() {
    this.http.get<any[]>('http://localhost:3100/utilisateur').subscribe((data) => {
      this.users = data;
    });
  }*/

  openCreateUserForm() {
    
    this.isFormVisible = true;
    this.isEditing = false;
    this.userForm = { nom: '', prenom: '', email: '', password: '', roles: '' };
  }

  openEditUserForm(user: any) {
    this.isFormVisible = true;
    this.isEditing = true;
    this.userForm = { ...user };
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token non trouvé !");
      return;
    }
    
    const headers = { Authorization: `Bearer ${token}` };
  
    if (this.isEditing) {
      this.http.put(`http://localhost:3100/utilisateur/${this.userForm.id}`, this.userForm, { headers })
        .subscribe(() => {
          this.fetchUsers();
          this.isFormVisible = false;
        });
    } else {
      this.http.post('http://localhost:3100/utilisateur', this.userForm, { headers })
        .subscribe(() => {
          this.fetchUsers();
          this.isFormVisible = false;
        });
    }
  }
  
  /*onSubmit() {
    if (!this.userForm.nom || !this.userForm.prenom || !this.userForm.email || !this.userForm.password || !this.userForm.roles) {
      alert("Tous les champs sont obligatoires !");
      return;
    }
  
    if (this.isEditing) {
      this.http.put(`http://localhost:3100/utilisateur/${this.userForm.id}`, this.userForm)
        .subscribe(() => {
          this.fetchUsers();
          this.isFormVisible = false;
        });
    } else {
      this.http.post('http://localhost:3100/utilisateur', this.userForm)
        .subscribe(() => {
          this.fetchUsers();
          this.isFormVisible = false;
        });
    }
  }*/

    deleteUser(id: number) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token non trouvé !");
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
    
      this.http.delete(`http://localhost:3100/utilisateur/${id}`, { headers })
        .subscribe(() => {
          this.fetchUsers();
        });
    }
    
}
