import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], //RouterModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @Input() collapsed= false;
  @Input() screenwidth= 0;

  getHomeClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenwidth >768){
      styleClass = 'home-trimmed';
    }else if(this.collapsed && this.screenwidth <= 768 && this.screenwidth >0){
      styleClass= 'home-md-screen';
    }
    return styleClass;
  }
}
