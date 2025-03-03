import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-profile-users',
  templateUrl: './profile-users.component.html',
  styleUrls: ['./profile-users.component.css']
})
export class ProfileUsersComponent {
  /*role: any;

  constructor(private router: Router){ }

  logout(){

    console.log('user logged out');
    /*const dialogConfig = new MatDialogConfig();
    dialogConfig: data= {
      message: 'Logout'
    };

    const dialogRef = this.dialog.open(dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user)=>{
    dialogRef.close();
    localStorage.clear();
    this.router.navigate(['/])
    })
  }

  changePassword(){
    const dialogConfig = new MatDialogConfig;
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent.dialogConfig);
  }*/
}
