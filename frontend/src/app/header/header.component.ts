import { Component, EventEmitter, HostListener, OnInit, Output, SimpleChanges } from '@angular/core';
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
interface NavItem {
  routeLink: string;
  icon: string;
  label: string;
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
          style({ opacity: 0 })//0
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

  //role: string | null = null;
  role: any;
  collapsed = false;
  screenwidth = 0;
  navData = navbarData;
  isLoggedIn: boolean = false;

  constructor(private tokenService: TokenService, private authService: AuthService, private router: Router) { }

  @HostListener('window: resize', ['$event'])

  onResize(event: any) {
    this.screenwidth = window.innerWidth;
    this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });

    /*this.screenwidth = window.innerWidth;
    if (this.screenwidth <= 768) {
      this.collapsed = false;//false
      this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
    }*/
  }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    this.collapsed = true; //

    // Écoute les changements de l'utilisateur pour mettre à jour le header dynamiquement


    const user = this.authService.getUser();
    console.log('Utilisateur retourné par getUser():', user);

    if (!user || !user.roles) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = user.roles; // Assigne les rôles
    console.log('Rôle récupéré:', this.role);

    // Filtrer le menu selon le rôle
    this.navData = this.getUserNavData();
    console.log('navData après filtrage:', this.navData);
    //this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth }); //
    this.isLoggedIn = !!localStorage.getItem('token');

  }

  getUserNavData() {
    const navItems: NavItem[] = [];

    // Vérifie les rôles et ajoute les sections correspondantes
    if (this.role.includes('admin')) {

      return [
        { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
        { routeLink: 'vehicule', icon: 'fal fa-bus', label: 'Véhicule' },
        { routeLink: 'chauffeur', icon: 'fal fa-user-tie', label: 'chauffeur' },
        { routeLink: 'atelier', icon: 'fal fa-hard-hat', label: 'atelier' },
        { routeLink: 'technicien', icon: 'fal fa-user-hard-hat ', label: 'technicien' },
        { routeLink: 'maintenance', icon: 'fal fa-tools', label: 'Maintenance' },
        { routeLink: 'diagnostic', icon: 'fal fa-clipboard-list-check ', label: 'diagnostic' },
        { routeLink: 'ordre', icon: 'fal fa-clipboard-list', label: 'ordre de travail' },
        { routeLink: 'intervention', icon: 'fal fa-hammer', label: 'intervention' },
        //{ routeLink: 'ordre', icon: 'fal fa-clipboard-list', label: 'orders'},
        { routeLink: 'demande', icon: ' fal fa-file-alt', label: 'demande d’avarie' },
        {
          routeLink: 'etat',
          icon: 'fal fa-calendar-check',
          label: 'etat vidange'
        },

        {
          routeLink: 'stat',
          icon: 'fal fa-chart-bar',
          label: 'statistique'
      },
        /*{
          routeLink: 'vidange',
          icon: 'fal fa-oil-can',
          label: 'vidange'
        },*/
        {
          routeLink: 'consomation',
          icon: 'fal fa-gas-pump', //fal fa-oil-can //fal fa-tags
          label: 'consomation'
        },
        { routeLink: 'kilometrage', icon: 'fal fa-tachometer-alt', label: 'Kilométrage' }
      ];

    }

    if (this.role.includes('chef de direction technique')) {

      return [

        { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
        { routeLink: 'vehicule', icon: 'fal fa-bus', label: 'Véhicule' },
        { routeLink: 'chauffeur', icon: 'fal fa-user-tie', label: 'chauffeur' },
        { routeLink: 'atelier', icon: 'fal fa-hard-hat', label: 'atelier' },
        { routeLink: 'technicien', icon: 'fal fa-user-hard-hat ', label: 'technicien' },

      ];

    }

    if (this.role.includes('chef service maintenance')) {
      return [
        { routeLink: 'maintenance', icon: 'fal fa-tools', label: 'Maintenance' },
        { routeLink: 'diagnostic', icon: 'fal fa-clipboard-list-check ', label: 'diagnostic' },
        { routeLink: 'ordre', icon: 'fal fa-clipboard-list', label: 'ordre de travail' },
      ];
    }

    if (this.role.includes('Responsable maintenance')) {
      return [
        { routeLink: 'ordres', icon: 'fal fa-clipboard-list', label: 'orders' },
        { routeLink: 'intervention', icon: 'fal fa-hammer', label: 'intervention' },
      ];
    }

    if (this.role.includes('chef d’agence')) {
      return [{ routeLink: 'demande', icon: 'fal fa-file-alt', label: 'demandes d’avarie' }];
    }

    if (this.role.includes('Chef service maîtrise de l\'énergie')) {
      return [
        {
          routeLink: 'etat',
          icon: 'fal fa-calendar-check',
          label: 'etat vidange'
        },

        {
          routeLink: 'stat',
          icon: 'fal fa-chart-bar',
          label: 'statistique'
      },
        /*{
          routeLink: 'vidange',
          icon: 'fal fa-oil-can',// fa-tint
          label: 'vidange'
        }*/
      ]
    }

    if (this.role.includes('Agent de saisie maîtrise de l\'énergie')) {
      return [
        {
          routeLink: 'consomation',
          icon: 'fal fa-gas-pump', //fal fa-oil-can //fal fa-tags
          label: 'consomation'

        },

        {
          routeLink: 'kilometrage',
          icon: 'fal fa-tachometer-alt', //fal fa-road//fal fa-cog:parametre
          label: 'kilometrage'
        },

        /*{
          routeLink: 'dashboard-admin',
          icon: 'fal fa-tachometer-alt', //fal fa-road//fal fa-cog:parametre
          label: 'kilometrage'
        }*/

      ]
    }

    return [];
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleHeaderNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });

  }

  closeHeader(): void {
    this.collapsed = false; //false
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
      window.location.reload();
    }
  }

}



/* 
derniere code: contenu de header accessible a touta les utilisateurs mais par connexion
----------------------------------------------------------------------------------------
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











getUserNavData() {
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
