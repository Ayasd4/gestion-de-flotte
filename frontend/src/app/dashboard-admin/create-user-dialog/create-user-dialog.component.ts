import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ]

})
export class CreateUserDialogComponent implements OnInit {

  userForm: any = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    roles: ''
  };
  isEditing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isEditing = this.data.isEditing || false;
      // Copy user data to form, excluding isEditing flag
      const { isEditing, ...userData } = this.data;
      this.userForm = { ...userData };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.userForm.nom || !this.userForm.prenom || !this.userForm.email || 
        (!this.isEditing && !this.userForm.password) || !this.userForm.roles) {
      alert("Tous les champs sont obligatoires !");
      return;
    }
    
    this.dialogRef.close(this.userForm);
  }
}