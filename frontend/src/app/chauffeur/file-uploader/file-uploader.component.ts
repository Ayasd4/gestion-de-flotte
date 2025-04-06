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
  @Output() onFileSelect = new EventEmitter<File>();
 // @Output() onFileSelect: EventEmitter<object> = new EventEmitter();
  @ViewChild('fileUpoader', { static: false }) fileUpoader!: ElementRef<HTMLElement>;

  public image: string = '';
  public imageName: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  triggerClick() {
    let fileElement: HTMLElement = this.fileUpoader.nativeElement;
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

