import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule , RouterModule, MatMenuModule, MatButtonModule, MatDialogModule]
})
export class ToolBarComponent implements OnInit{
  //role: any;
  isLoggedIn: boolean = false;
  user: any;
  subscription!: Subscription;

  constructor(private router: Router, private dialog: MatDialog, 
    private authService: AuthService, private cdRef: ChangeDetectorRef,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      console.log("isLoggedIn:", this.isLoggedIn);
      if (this.isLoggedIn) {
        this.user = this.authService.getUser(); // Récupère les données de l'utilisateur
        console.log("Utilisateur connecté:", this.user); // Vérifiez que l'utilisateur est récupéré
      }
      this.cdRef.detectChanges(); //Force Angular à mettre à jour la vue
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /*forgotPassword(){
    this.isLoggedIn = true;
  }*/

  logout() {
    this.ngxService.start();
    console.log('user logged out');
    this.authService.logout();
    this.isLoggedIn = false;

    setTimeout(() => {
      this.ngxService.stop(); // Arrêter l'animation ou le chargement
      this.router.navigate(['/login']);
    }, 500);
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }

}