import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ChauffeurService } from '../chauffeur.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
  ]
})
export class FileUploaderComponent {//implements OnInit 

  @Output() onFileSelect: EventEmitter<object> = new EventEmitter();
  @ViewChild('fileUploader', { static: false }) fileUploader!: ElementRef<HTMLElement>;

  public image: string = '';
  public imageName: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  triggerClick() {
    let fileElement: HTMLElement = this.fileUploader.nativeElement;
    fileElement.click();
  }

  selectFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.imageName = file.name;

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
    };

    reader.readAsDataURL(file);
    this.onFileSelect.emit(file);
  }
}


/**@ViewChild('fileInput', {static: false}) fileInput!: ElementRef;

  constructor(private http: HttpClient,
    private chauffeurService: ChauffeurService
  ){}

  onFileUpload(){
    const imageBlob = this.fileInput.nativeElement.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
  }


  /* */
