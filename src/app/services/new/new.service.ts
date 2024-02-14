import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewUser } from 'src/app/models/new/new-user';
import { Client } from 'src/app/models/user/client';
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

  updateUser(id: string, usuario: NewUser) {
    return this.http.put<any>(`${environment.url_api}/new/user/${id}`, usuario)
  }

  getUser(id: string) {
    return this.http.get<NewUser>(`${environment.url_api}/new/user/${id}`)
  }

  getRoles() {
    return this.http.get<Role[]>(`${environment.url_api}/roles`)
  }

  getClients() {
    return this.http.get<Client[]>(`${environment.url_api}/clients`)
  }
}
