import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/login/auth.service';
import { Usuario } from 'src/app/models/login/usuario';
import { ContenidoToken } from 'src/app/models/login/contenido-token';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class DecodificadorService {

  constructor(
    private authService: AuthService
  ) { }

  getUsuario():Usuario{
    if(this.authService.isAuth()){
      const token = localStorage.getItem('token');
      const usuario: Usuario = JSON.parse((<ContenidoToken>decode(token)).data);
      return usuario;
    }else{
      return null;
    }
  }

  getId():string{
    if(this.authService.isAuth()){
      const token = localStorage.getItem('token');
      const usuario: Usuario = JSON.parse((<ContenidoToken>decode(token)).data);
      return usuario.id;
    }else{
      return "";
    }
  }

  getEmail():string{
    if(this.authService.isAuth()){
      const token = localStorage.getItem('token');
      const usuario: Usuario = JSON.parse((<ContenidoToken>decode(token)).data);
      return usuario.email;
    }else{
      return "";
    }
  }

  getRol():string{
    if(this.authService.isAuth()){
      const token = localStorage.getItem('token');
      const usuario: Usuario = JSON.parse((<ContenidoToken>decode(token)).data);
      return usuario.role;
    }else{
      return "";
    }
  }
}
