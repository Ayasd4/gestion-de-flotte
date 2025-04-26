import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicule-stat',
  templateUrl: './vehicule-stat.component.html',
  styleUrls: ['./vehicule-stat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    
  ]
})
export class VehiculeStatComponent {

}
