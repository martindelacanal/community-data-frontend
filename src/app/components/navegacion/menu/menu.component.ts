import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Usuario } from 'src/app/models/login/usuario';
import { AuthService } from 'src/app/services/login/auth.service';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('iconAnimation', [
      state('menu', style({
        transform: 'rotate(0deg)'
      })),
      state('intermediate', style({
        transform: 'rotate(45deg)'
      })),
      state('close', style({
        transform: 'rotate(90deg)'
      })),
      transition('menu => intermediate', animate('0.1s')),
      transition('intermediate => close', animate('0.1s')),
      transition('close => intermediate', animate('0.1s')),
      transition('intermediate => menu', animate('0.1s'))
    ])
  ]
})
export class MenuComponent implements OnInit {

  @ViewChild('card') card: ElementRef;
  @ViewChild('profile') profile: ElementRef;
  @ViewChild('menuIcon') menuIcon: ElementRef;
  @ViewChild('menu') menu: ElementRef;

  usuario: Usuario;
  menuExpanded = false;
  showCard = false;
  currentRoute = '';
  animationState = 'menu';

  constructor(
    private decodificadorService: DecodificadorService,
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService
  ) {
    this.usuario = this.decodificadorService.getUsuario();
    console.log(this.usuario)
    if (!this.usuario) {
      window.location.reload()
    }
   }

  ngOnInit(): void {
    this.authService.getIsAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.currentRoute = '/home';
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event) => {
      if (
        this.showCard &&
        !this.card.nativeElement.contains(event.target) &&
        !this.profile.nativeElement.contains(event.target)
      ) {
        this.toggleCard();
      }
      if (
        this.menuExpanded &&
        !this.menuIcon.nativeElement.contains(event.target) &&
        !this.menu.nativeElement.contains(event.target)
      ) {
        this.toggleMenu();
      }

    });
  }

  toggleMenu() {
    if (this.animationState === 'menu') {
      this.animationState = 'intermediate';
      setTimeout(() => {
        this.animationState = 'close';
        this.menuExpanded = true;
      }, 100);
    } else {
      this.animationState = 'intermediate';
      setTimeout(() => {
        this.animationState = 'menu';
        this.menuExpanded = false;
      }, 100);
    }
  }

  toggleCard() {
    this.showCard = !this.showCard;
  }

  logOut() {
    localStorage.removeItem('token');
      window.location.reload();
  }

}
