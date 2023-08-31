import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { Usuario } from 'src/app/models/login/usuario';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Gender } from 'src/app/models/user/gender';
import { Ethnicity } from 'src/app/models/user/ethnicity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) { }

  signin(user:any){
    return this.http.post(`${environment.url_api}/signin`,user);
  }

  signup(form:any){
    return this.http.post(`${environment.url_api}/signup`,form);
  }

  isAuth():boolean{
    const token = localStorage.getItem('token');
    if(this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')){
      localStorage.removeItem('token');
      return false;
    }
    return true;
  }

  isAuthObservable(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')) {
      return of(false);
    }
    return of(true);
  }


  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  login() {
    this.isAuthenticated.next(true);
  }

  changePassword(idUser: string, form: any){
    return this.http.put<any>(`${environment.url_api}/change-password/${idUser}`,form);
  }

  resetPassword(form: any){
    return this.http.put<any>(`${environment.url_api}/beneficiary/reset-password`,form);
  }

  getUserNameExists(nombre: string){
    return this.http.get<any>(`${environment.url_api}/userName/exists/search?username=${nombre}`);
  }

  getEmailExists(nombre: string){
    return this.http.get<any>(`${environment.url_api}/email/exists/search?email=${nombre}`);
  }

  getGender(language: string, id?: number){
    return this.http.get<Gender[]>(`${environment.url_api}/gender?${id ? 'id='+id : ''}language=${language}`);
  }

  getEthnicity(language: string, id?: number){
    return this.http.get<Ethnicity[]>(`${environment.url_api}/ethnicity?${id ? 'id='+id : ''}language=${language}`);
  }

}
