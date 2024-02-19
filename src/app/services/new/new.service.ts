import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewLocation } from 'src/app/models/new/new-location';
import { NewProduct } from 'src/app/models/new/new-product';
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

  newLocation(usuario: NewLocation) {
    return this.http.post<any>(`${environment.url_api}/new/location`, usuario)
  }

  updateLocation(id: string, usuario: NewLocation) {
    return this.http.put<any>(`${environment.url_api}/new/location/${id}`, usuario)
  }

  getLocation(id: string) {
    return this.http.get<NewLocation>(`${environment.url_api}/new/location/${id}`)
  }

  getLocationExists(community_city: string) {
    return this.http.get<any>(`${environment.url_api}/location/exists/search?community_city=${community_city}`);
  }

  newProduct(usuario: NewProduct) {
    return this.http.post<any>(`${environment.url_api}/new/product`, usuario)
  }

  updateProduct(id: string, usuario: NewProduct) {
    return this.http.put<any>(`${environment.url_api}/new/product/${id}`, usuario)
  }

  getProduct(id: string) {
    return this.http.get<NewProduct>(`${environment.url_api}/new/product/${id}`)
  }

  getProductExists(nombre: string) {
    return this.http.get<any>(`${environment.url_api}/product/exists/search?product=${nombre}`);
  }

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
