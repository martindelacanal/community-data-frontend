import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { Usuario } from 'src/app/models/login/usuario';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Gender } from 'src/app/models/user/gender';
import { Ethnicity } from 'src/app/models/user/ethnicity';
import { RegisterQuestion } from 'src/app/models/login/register-question';
import { Location } from 'src/app/models/map/location';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) { }

  signin(user: any) {
    return this.http.post(`${environment.url_api}/signin`, user);
  }

  signup(form: any) {
    return this.http.post(`${environment.url_api}/signup`, form);
  }

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (!decodedToken || this.jwtHelper.isTokenExpired(token)) {
        localStorage.removeItem('token');
        return false;
      }
      // Aquí puedes agregar cualquier otra verificación que necesites
      return true;
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      return false;
    }
  }

  isAuthObservable(): Observable<boolean> {
    const token = localStorage.getItem('token');
    try {
      if (this.jwtHelper.isTokenExpired(token) || !token) {
        if (token) {
          localStorage.removeItem('token');
        }
        return of(false);
      }
      return of(true);
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      return of(false);
    }
  }

  isTokenNextToExpire(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (!decodedToken || this.jwtHelper.isTokenExpired(token)) {
        localStorage.removeItem('token');
        return false;
      }
      // Obtén la fecha de expiración del token en milisegundos
      const expiryDate = this.jwtHelper.getTokenExpirationDate(token).getTime();
      // Obtén la fecha y hora actual en milisegundos
      const now = new Date().getTime();
      // Calcula la diferencia en minutos
      const diff = (expiryDate - now) / (1000 * 60);
      // Si la diferencia es menor o igual a 5 minutos, el token está a punto de expirar
      return diff <= 5;
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      return false;
    }
  }

  refreshToken() {
    return this.http.get(`${environment.url_api}/refresh-token`);
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  login() {
    this.isAuthenticated.next(true);
  }

  changePassword(idUser: string, form: any) {
    return this.http.put<any>(`${environment.url_api}/change-password/${idUser}`, form);
  }

  resetPassword(form: any) {
    return this.http.put<any>(`${environment.url_api}/beneficiary/reset-password`, form);
  }

  getUserNameExists(nombre: string) {
    return this.http.get<any>(`${environment.url_api}/userName/exists/search?username=${nombre}`);
  }

  getPhoneExists(nombre: string) {
    return this.http.get<any>(`${environment.url_api}/phone/exists/search?phone=${nombre}`);
  }

  getEmailExists(nombre: string) {
    return this.http.get<any>(`${environment.url_api}/email/exists/search?email=${nombre}`);
  }

  getRegisterQuestions(language: string, location_id: number) {
    return this.http.get<RegisterQuestion[]>(`${environment.url_api}/register/questions?language=${language}&location_id=${location_id}`);
  }

  getGender(language: string, id?: number) {
    return this.http.get<Gender[]>(`${environment.url_api}/gender?${id ? 'id=' + id + '&' : ''}language=${language}`);
  }

  getEthnicity(language: string, id?: number) {
    return this.http.get<Ethnicity[]>(`${environment.url_api}/ethnicity?${id ? 'id=' + id + '&' : ''}language=${language}`);
  }

  getLocations() {
    return this.http.get<Location[]>(`${environment.url_api}/register/locations`);
  }

}
