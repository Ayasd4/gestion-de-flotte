import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';

interface HeaderNavToggle{
  screenwidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,HeaderComponent, HomeComponent, ToolBarComponent],//HeaderComponent
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  isHeaderNavCollapsed= false;
  screenwidth= 0;

  onToggleHeaderNav(data: HeaderNavToggle): void{
    this.screenwidth = data.screenwidth;
    this.isHeaderNavCollapsed = data.collapsed;
  }
}
