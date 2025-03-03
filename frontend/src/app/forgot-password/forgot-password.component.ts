import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgxUiLoaderModule,
    ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  message: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private ngxService: NgxUiLoaderService,
  ) { 
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]//, Validators.pattern(GlobalConstants.emailRegex)
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    this.ngxService.start();
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.ngxService.stop();
          this.message = response.message;
          this.errorMessage = '';
        },
        error: (error) => {
          this.ngxService.stop();
          this.errorMessage = error.error.message;
          this.message = '';
        }
      });
    }
  }
}
