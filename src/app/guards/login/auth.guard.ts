import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {  }
  canActivate():boolean{

    if(!this.authService.isAuth()){
      console.log('Token no es válido o ya expiró');
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
