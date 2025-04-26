import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consommation-stat',
  templateUrl: './consommation-stat.component.html',
  styleUrls: ['./consommation-stat.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

  ]
})
export class ConsommationStatComponent implements OnInit{
  ngOnInit(): void {
  }

}
