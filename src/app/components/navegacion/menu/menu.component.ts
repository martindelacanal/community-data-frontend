import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Usuario } from 'src/app/models/login/usuario';
import { AuthService } from 'src/app/services/login/auth.service';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../../dialog/reset-password/reset-password.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs';

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
  route_role = '';
  animationState = 'menu';

  constructor(
    private decodificadorService: DecodificadorService,
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.usuario = this.decodificadorService.getUsuario();
    console.log(this.usuario)
    if (!this.usuario) {
      window.location.reload()
    } else {
      switch (this.usuario.role) {
        case 'admin':
          this.route_role = '/home';
          break;
        case 'client':
          this.route_role = '/home';
          break;
        case 'stocker':
          this.route_role = '/stocker/home';
          break;
        case 'delivery':
          this.route_role = '/delivery/home';
          break;
        case 'beneficiary':
          this.route_role = '/beneficiary/home';
          break;
        default:
          this.route_role = '/login';
          break;
      }
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
        if (this.currentRoute === '/login') {
          window.location.reload();
        }
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

    if (localStorage.getItem('reset_password') === 'Y') {
      this.dialogResetPassword();
    }
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
    this.usuario = null;
    window.location.reload();
    // this.router.navigate(['login']).then(() => {
      // window.location.reload();
    // });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close');
  }

  private dialogResetPassword(): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '370px',
      data: `Change your password to continue.`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {

        this.authService.changePassword(this.usuario.id, result.password).subscribe({
          next: (res) => {
            this.snackBar.open(`Password changed successfully`, '', { duration: 4000 });
            localStorage.setItem('reset_password', 'N');
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar('Error changing password');
          }
        });
      }
    });
  }

}
