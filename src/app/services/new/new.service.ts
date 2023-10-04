import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewUser } from 'src/app/models/new/new-user';
import { Role } from 'src/app/models/user/role';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewService {

  constructor(
    private http: HttpClient
  ) { }

  newUser(usuario: NewUser) {
    return this.http.post<any>(`${environment.url_api}/new/user`, usuario)
  }

  getRoles() {
    return this.http.get<Role[]>(`${environment.url_api}/roles`)
  }
}
