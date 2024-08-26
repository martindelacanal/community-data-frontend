import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/services/login/auth.service';
import { Usuario } from 'src/app/models/login/usuario';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  private usuario: Usuario;

  constructor(
    private authService: AuthService,
    private decodificadorService: DecodificadorService,
    public router: Router,
    public translate: TranslateService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.translate.use(localStorage.getItem('language') || 'en');
    const expectedRoles = route.data['expectedRoles'];
    const token = localStorage.getItem('token');

    this.usuario = this.decodificadorService.getUsuario();

    if (
      !this.authService.isAuth() ||
      expectedRoles.indexOf(this.decodificadorService.getRol()) === -1
    ) {
      console.log('Usuario no autorizado para la vista');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  };
}
