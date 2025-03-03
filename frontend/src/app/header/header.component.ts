import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

interface HeaderNavToggle {
  screenwidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-header',
  standalone: true,//ajouter
  // Assure-toi que RouterModule est importé
  imports: [CommonModule, RouterModule, NgxUiLoaderModule],//ajouter
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms',
          style({ opacity: 0 })
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        )
      ])
    ])
  ]
})

export class HeaderComponent implements OnInit {


  @Output() onToggleHeaderNav: EventEmitter<HeaderNavToggle> = new EventEmitter();

  role: string | null = null;
  collapsed = false;
  screenwidth = 0;
  navData = navbarData;

  constructor(private tokenService: TokenService, private authService: AuthService, private router: Router) { }

  @HostListener('window: resize', ['$event'])

  onResize(event: any) {
    this.screenwidth = window.innerWidth;
    if (this.screenwidth <= 768) {
      this.collapsed = false;
      this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
    }
  }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    //ajouter le role
    this.role = this.tokenService.getUserRole();
    console.log('user role:', this.role);


    // Vérification de l'authentification
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {

      // Filtrer navData en fonction du rôle
      //this.navData = this.getUserNavData();
      //console.log('navData:', this.navData);
      
      this.navData = navbarData; // Afficher tous les liens pour tout le monde


    }

    //this.navData = this.role === 'admin' ? this.getAdminNavData() : navbarData;
  }

  getUserNavData() {
    const navItems = [];

    // Vérifie les rôles et ajoute les sections correspondantes
    if (this.role && this.role.includes('admin')) {
      navItems.push(
        { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
        { routeLink: 'vehicule', icon: 'fal fa-bus', label: 'Véhicule' },
        { routeLink: 'maintenance', icon: 'fal fa-tools', label: 'Maintenance' },
        { routeLink: 'consommation', icon: 'fal fa-gas-pump', label: 'Consommation' },
        { routeLink: 'kilometrage', icon: 'fal fa-tachometer-alt', label: 'Kilométrage' }
      );
    }
    if (this.role && this.role.includes('chef de direction technique')) {
      navItems.push({ routeLink: 'vehicule', icon: 'fal fa-bus', label: 'Véhicule' });
    }
    if (this.role && this.role.includes('chef service maintenance')) {
      navItems.push({ routeLink: 'maintenance', icon: 'fal fa-tools', label: 'Maintenance' });
    }
    if (this.role && this.role.includes('agent de saisie maîtrise de l\'énergie')) {
      navItems.push(
        { routeLink: 'kilometrage', icon: 'fal fa-tachometer-alt', label: 'Kilométrage' },
        { routeLink: 'consommation', icon: 'fal fa-gas-pump', label: 'Consommation' }
      );
    }

    return navItems;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
  }

  closeHeader(): void {
    this.collapsed = false;
    this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToTask(task: string) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      // Rediriger vers la tâche spécifique
      this.router.navigate([task]);
    }
  }

}



/* getUserNavData() {
    if (this.role === 'admin') {
      return [
        { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
        { routeLink: 'vehicule', icon: 'fal fa-bus', label: 'Véhicule' },
        { routeLink: 'maintenance', icon: 'fal fa-tools', label: 'Maintenance' },
        { routeLink: 'consommation', icon: 'fal fa-gas-pump', label: 'Consommation' },
        { routeLink: 'kilometrage', icon: 'fal fa-tachometer-alt', label: 'Kilométrage' },
      ];
    } else if (this.role === 'chef de direction technique') {
      return [
        { RouterLink: 'vehicule', icon: 'fal fa-bus', label: 'vehicule' },
      ];
    } else if (this.role === 'chef service maintenance') {
      return [
        { routeLink: 'maintenance', icon: 'fal fa-tools', label: 'Maintenance' },
      ];
    } else if (this.role === 'agent de saisie maîtrise de l\'énergie') {
      return [
        { routeLink: 'kilometrage', icon: 'fal fa-tachometer-alt', label: 'Kilométrage' },
        { routeLink: 'consommation', icon: 'fal fa-gas-pump', label: 'Consommation' },
      ];
    } else {
      return []; // Aucun accès pour les autres rôles
    }
  }
*/





/*menuValue: boolean= false;
menu_icon: String= 'bi bi-list'

openMenu(){
  this.menuValue =!this.menuValue;
  this.menu_icon= this.menuValue ? 'bi bi-x':'bi bi-list';
}

closeMenu(){
  this.menuValue= false;
  this.menu_icon= 'bi bi-list'



   getUserNavData(){
  return [
    {
      routeLink: 'dashboard',
      icon: 'fal fa-home',
      label: 'Dashboard'
    },
    {
      routeLink: 'vehicule',
      icon: 'fal fa-bus',
      label: 'Véhicule'
    },
    {
      routeLink: 'maintenance',
      icon: 'fal fa-tools',
      label: 'Maintenance'
    },
    {
      routeLink: 'consommation',
      icon: 'fal fa-gas-pump',
      label: 'Consommation'
    },
    {
      routeLink: 'kilometrage',
      icon: 'fal fa-tachometer-alt',
      label: 'Kilométrage'
    },
    {
      routeLink: 'admin',
      icon: 'fal fa-user-shield',
      label: 'Admin Panel'
    }
  ];
}
}*/
