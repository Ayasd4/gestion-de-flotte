import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    MatSnackBarModule

  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  changePasswordForm: FormGroup;
  errorMessage: string = '';
  message: string = '';


  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private ngxService: NgxUiLoaderService,
    private snackbar: MatSnackBar
  ) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]], //, Validators.oldPassword
      newPassword: ['', [Validators.required, Validators.minLength(6)]], //, Validators.newPassword
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  onChange() {
    this.ngxService.start();
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

      // Vérifier si les nouveaux mots de passe correspondent
      if (newPassword !== confirmPassword) {
        this.ngxService.stop();
        this.errorMessage = 'New passwords do not match';
        this.snackbar.open('New passwords do not match', 'close', {duration: 6000})
        this.message = '';
        return;
      }


      this.authService.changePassword(oldPassword, newPassword).subscribe((response: any) => {
        this.ngxService.stop();


        this.message = response.message;
        this.errorMessage = '';

      }, (error) => {
        this.ngxService.stop();
        console.log("error:", error);
        this.errorMessage = 'Somthing was wrong, please try again!';
        this.message = '';
      });
    }
  }
}
