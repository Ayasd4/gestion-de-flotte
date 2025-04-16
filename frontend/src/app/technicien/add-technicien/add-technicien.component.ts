import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TechnicienService } from '../technicien.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddAtelierComponent } from 'src/app/atelier/add-atelier/add-atelier.component';
import { Technicien } from '../technicien';
import * as moment from 'moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploaderComponent } from 'src/app/chauffeur/file-uploader/file-uploader.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD', // Le format pour l'entrée
  },
  display: {
    dateInput: 'YYYY/MM/DD', // Le format pour l'affichage
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-technicien',
  templateUrl: './add-technicien.component.html',
  styleUrls: ['./add-technicien.component.css'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter }, // Fournir un adaptateur de date natif
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FileUploaderComponent

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AddTechnicienComponent {

  specialiteDisponibles: string[] = ['électrique', 'mécanique', 'tolerie', 'volcanisation', 'autres'];

  selected = "électrique";

  constructor(private technicienService: TechnicienService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngxService: NgxUiLoaderService,
    public dialogRef: MatDialogRef<AddAtelierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.TechnicienForm = this.fb.group({
      image: [null, Validators.required]
    });
  }

  matricule_techn: any = undefined;

  technicien: Technicien = {
    id_technicien: 0,
    nom: '',
    prenom: '',
    matricule_techn: this.matricule_techn,
    cin: '',
    telephone_techn: '',
    email_techn: '',
    specialite: '',
    date_embauche: '',
    image: ''
  }

  TechnicienForm: FormGroup;
  imageFile: File | null = null;
  submitted: boolean = false;
  isPhotoError = false;
  uploadError = '';

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data) {
      this.technicien = { ...this.data }
    }
  }

  formatBackendDate(date: Date | string): string {
    if (!date) return ''; // Vérifie la validité de la date
    if (date instanceof Date && isNaN(date.getTime())) return ''; // Vérifie si la date est valide
    return moment(new Date(date)).format('YYYY/MM/DD'); // Formate au format 'YYYY/MM/DD'
  }

  saveTechnicien(TechnicienForm: any) {
    console.log('Données envoyées:', this.technicien);

    if (TechnicienForm.invalid) {
      this.snackBar.open('All fields must be filled out!', 'Close', { duration: 9000 });
      return;
    }

    if (this.TechnicienForm.get('image')?.invalid) {
      this.isPhotoError = true;
      return;
    }

    const image = this.TechnicienForm.get('image')?.value;
    this.uploadError = '';

    const formData = new FormData();
    formData.append('nom', this.technicien.nom);
    formData.append('prenom', this.technicien.prenom);
    formData.append('matricule_techn', this.technicien.matricule_techn.toString());
    formData.append('cin', this.technicien.cin);
    formData.append('telephone_techn', this.technicien.telephone_techn);
    formData.append('email_techn', this.technicien.email_techn);
    formData.append('specialite', this.technicien.specialite);
    formData.append('date_embauche', this.formatBackendDate(this.technicien.date_embauche));
    formData.append('image', image);

    this.technicien.image = image.name;

    /*const TechnicienToSend = {
      ...this.technicien,

      date_embauche: this.formatBackendDate(this.technicien.date_embauche),
    };*/

    this.ngxService.start();

    if (this.technicien.id_technicien) {
      this.technicienService.updateTechnicien(this.technicien.id_technicien, formData).subscribe(() => {
        console.log('Technician updated successfully!');
        this.ngxService.stop();
        window.location.reload();
        this.dialogRef.close(this.technicien);
      },
        (error: any) => {
          console.error('Error while updating Technician:', error);
        }
      );
    } else {
      this.technicienService.createTechnicien(formData).subscribe(
        () => {
          this.snackBar.open('Technician added successfully!', 'close', { duration: 9000 });
          this.ngxService.stop();
          //window.location.reload();
          this.dialogRef.close(this.technicien);
        },
        (error: any) => {
          console.error('Error while creation Technician :', error);

          if (error?.error?.message === 'This Technician already exists.') {
            this.snackBar.open('This technician already exists.', 'Close', { duration: 9000 });
          } else {
            this.snackBar.open('An error occurred while adding the technician.', 'Close', { duration: 9000 });
          }
        }
      );
    }
  }

  onFileSelect(file: File) {
    this.TechnicienForm.patchValue({ image: file });
    this.TechnicienForm.get('image')?.updateValueAndValidity();
    this.technicien.image = file.name;
  }

}
