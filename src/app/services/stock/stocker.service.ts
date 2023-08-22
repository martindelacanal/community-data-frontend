import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from 'src/app/models/mapa/location';
import { Product } from 'src/app/models/stocker/product';
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

  getProducts(){
    return this.http.get<Product[]>(`${environment.url_api}/products`);
  }
}
