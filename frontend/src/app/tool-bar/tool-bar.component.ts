import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, RouterModule, MatMenuModule, MatButtonModule, MatDialogModule],
})
export class ToolBarComponent implements OnInit{
  //role: any;
  isLoggedIn: boolean = false;


  constructor(private router: Router, private dialog: MatDialog, 
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn(); // Pas besoin de `.subscribe()`

    //si l'utilisateur est connecté 
    /*this.authService.isLoggedIn().subscribe(status=>{
      this.isLoggedIn = status;
    });*/
    //this.isLoggedIn = !!localStorage.getItem('user'); // Vérifie si un utilisateur est connecté
  }

  logout() {
    console.log('user logged out');
    this.authService.logout();
    this.isLoggedIn = false;

    /*localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);*/

    /*const dialogConfig = new MatDialogConfig();
    dialogConfig: data= {
      message: 'Logout'
    };
 
    const dialogRef = this.dialog.open(dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user)=>{
    dialogRef.close();
    localStorage.clear();
    this.router.navigate(['/])
    })*/
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }

}