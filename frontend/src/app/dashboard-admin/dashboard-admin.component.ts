import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    CreateUserDialogComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class DashboardAdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'telephone', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>();
  filisble: boolean = false;

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');

    // If the currentUser is found and it's a valid JSON, parse it
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const currentUserRole = user?.roles;

      // Check if the role is admin
      if (currentUserRole === 'admin') {
        // Set 'filisble' to true
        this.filisble = true;
        this.fetchUsers();
      } else {
        this.router.navigate(['/login-admin']);
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  fetchUsers() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("token no trouvé!");

    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:3100/utilisateur', { headers }).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  searchUsers(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateUserForm() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:3100/utilisateur', result)
          .subscribe(() => {
            this.fetchUsers();
          });
      }
    });
  }

  openEditUserForm(user: any) {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { ...user, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error("token no trouvé!");

        }

        const headers = { Authorization: `Bearer ${token}` };

        this.http.put(`http://localhost:3100/utilisateur/${user.id}`, result, { headers })
          .subscribe(() => {
            this.fetchUsers();
          });
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("token no trouvé!");

      }

      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`http://localhost:3100/utilisateur/${id}`, {headers})
        .subscribe({
          next: () => {
            this.fetchUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          }
        });
    }
  }
}
