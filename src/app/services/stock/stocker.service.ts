import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from 'src/app/models/map/location';
import { Product } from 'src/app/models/stocker/product';
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

  getLocations(){
    return this.http.get<Location[]>(`${environment.url_api}/locations`);
  }

  getProviders(){
    return this.http.get<Provider[]>(`${environment.url_api}/providers`);
  }

  getProducts(){
    return this.http.get<Product[]>(`${environment.url_api}/products`);
  }

  getDonationIDExists(nombre: string) {
    return this.http.get<any>(`${environment.url_api}/donation_id/exists/search?donation_id=${nombre}`);
  }

}
