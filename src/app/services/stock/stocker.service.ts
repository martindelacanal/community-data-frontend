import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from 'src/app/models/map/location';
import { NewTicket } from 'src/app/models/new/new-ticket';
import { AuditStatus } from 'src/app/models/stocker/audit-status';
import { Product } from 'src/app/models/stocker/product';
import { ProductType } from 'src/app/models/stocker/product-type';
import { Provider } from 'src/app/models/stocker/provider';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockerService {

  constructor(
    private http: HttpClient
  ) { }

  uploadTicket(ticket: FormData){
    return this.http.post(`${environment.url_api}/upload/ticket`, ticket);
  }

  updateTicket(id: string, ticket: FormData) {
    return this.http.put<any>(`${environment.url_api}/upload/ticket/${id}`, ticket)
  }

  getTicket(id: string) {
    return this.http.get<NewTicket>(`${environment.url_api}/upload/ticket/${id}`)
  }

  getLocations(){
    return this.http.get<Location[]>(`${environment.url_api}/locations`);
  }

  getAuditStatus(language: string) {
    return this.http.get<AuditStatus[]>(`${environment.url_api}/audit_status?language=${language}`);
  }

  getProviders(){
    return this.http.get<Provider[]>(`${environment.url_api}/providers`);
  }

  getProducts(){
    return this.http.get<Product[]>(`${environment.url_api}/products`);
  }

  getProductTypes(language: string, id?: number) {
    return this.http.get<ProductType[]>(`${environment.url_api}/product_types?${id ? 'id=' + id + '&' : ''}language=${language}`);
  }

  getDonationIDExists(nombre: string) {
    return this.http.get<any>(`${environment.url_api}/donation_id/exists/search?donation_id=${nombre}`);
  }

}
