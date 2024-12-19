import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewClient } from 'src/app/models/new/new-client';
import { NewDeliveredBy } from 'src/app/models/new/new-delivered-by';
import { NewEthnicity } from 'src/app/models/new/new-ethnicity';
import { NewGender } from 'src/app/models/new/new-gender';
import { NewLocation } from 'src/app/models/new/new-location';
import { NewProduct } from 'src/app/models/new/new-product';
import { NewProductType } from 'src/app/models/new/new-product-type';
import { NewProvider } from 'src/app/models/new/new-provider';
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

  newLocation(location: NewLocation) {
    return this.http.post<any>(`${environment.url_api}/new/location`, location)
  }

  updateLocation(id: string, location: NewLocation) {
    return this.http.put<any>(`${environment.url_api}/new/location/${id}`, location)
  }

  getLocation(id: string) {
    return this.http.get<NewLocation>(`${environment.url_api}/new/location/${id}`)
  }

  getLocationExists(community_city: string) {
    return this.http.get<any>(`${environment.url_api}/location/exists/search?community_city=${community_city}`);
  }

  newProduct(product: NewProduct) {
    return this.http.post<any>(`${environment.url_api}/new/product`, product)
  }

  updateProduct(id: string, product: NewProduct) {
    return this.http.put<any>(`${environment.url_api}/new/product/${id}`, product)
  }

  getProduct(id: string) {
    return this.http.get<NewProduct>(`${environment.url_api}/new/product/${id}`)
  }

  getProductExists(name: string) {
    return this.http.get<any>(`${environment.url_api}/product/exists/search?product=${name}`);
  }

  newProductType(productType: NewProductType) {
    return this.http.post<any>(`${environment.url_api}/new/product-type`, productType)
  }

  updateProductType(id: string, productType: NewProductType) {
    return this.http.put<any>(`${environment.url_api}/new/product-type/${id}`, productType)
  }

  getProductType(id: string) {
    return this.http.get<NewProductType>(`${environment.url_api}/new/product-type/${id}`)
  }

  getProductTypeExists(name: string) {
    return this.http.get<any>(`${environment.url_api}/product-type/exists/search?name=${name}`);
  }

  newDeliveredBy(deliveredBy: NewDeliveredBy) {
    return this.http.post<any>(`${environment.url_api}/new/delivered-by`, deliveredBy)
  }

  updateDeliveredBy(id: string, deliveredBy: NewDeliveredBy) {
    return this.http.put<any>(`${environment.url_api}/new/delivered-by/${id}`, deliveredBy)
  }

  getDeliveredBy(id: string) {
    return this.http.get<NewDeliveredBy>(`${environment.url_api}/new/delivered-by/${id}`)
  }

  getDeliveredByExists(name: string) {
    return this.http.get<any>(`${environment.url_api}/delivered-by/exists/search?name=${name}`);
  }

  newGender(gender: NewGender) {
    return this.http.post<any>(`${environment.url_api}/new/gender`, gender)
  }

  updateGender(id: string, gender: NewGender) {
    return this.http.put<any>(`${environment.url_api}/new/gender/${id}`, gender)
  }

  getGender(id: string) {
    return this.http.get<NewGender>(`${environment.url_api}/new/gender/${id}`)
  }

  getGenderExists(name: string) {
    return this.http.get<any>(`${environment.url_api}/gender/exists/search?name=${name}`);
  }

  newEthnicity(ethnicity: NewEthnicity) {
    return this.http.post<any>(`${environment.url_api}/new/ethnicity`, ethnicity)
  }

  updateEthnicity(id: string, ethnicity: NewEthnicity) {
    return this.http.put<any>(`${environment.url_api}/new/ethnicity/${id}`, ethnicity)
  }

  getEthnicity(id: string) {
    return this.http.get<NewEthnicity>(`${environment.url_api}/new/ethnicity/${id}`)
  }

  getEthnicityExists(name: string) {
    return this.http.get<any>(`${environment.url_api}/ethnicity/exists/search?name=${name}`);
  }

  newProvider(provider: NewProvider) {
    return this.http.post<any>(`${environment.url_api}/new/provider`, provider)
  }

  updateProvider(id: string, provider: NewProvider) {
    return this.http.put<any>(`${environment.url_api}/new/provider/${id}`, provider)
  }

  getProvider(id: string) {
    return this.http.get<NewProvider>(`${environment.url_api}/new/provider/${id}`)
  }

  getProviderExists(name: string) {
    return this.http.get<any>(`${environment.url_api}/provider/exists/search?name=${name}`);
  }

  newClient(client: NewClient) {
    return this.http.post<any>(`${environment.url_api}/new/client`, client)
  }

  updateClient(id: string, client: NewClient) {
    return this.http.put<any>(`${environment.url_api}/new/client/${id}`, client)
  }

  getClient(id: string) {
    return this.http.get<NewClient>(`${environment.url_api}/new/client/${id}`)
  }

  getClientExists(name: string, short_name: string) {
    let url = `${environment.url_api}/client/exists/search?`;
    if (name) {
      url += `name=${name}`;
    }
    if (short_name) {
      if (name) {
        url += '&';
      }
      url += `short_name=${short_name}`;
    }
    return this.http.get<any>(url);
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
