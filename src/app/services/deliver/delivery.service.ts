import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { Location } from 'src/app/models/map/location';
import { UserStatus } from 'src/app/models/user/user-status';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(
    private http: HttpClient
  ) { }

  uploadTicket(beneficiaryQR: beneficiaryQR, location_id: number, client_id: number){
    return this.http.post<any>(`${environment.url_api}/upload/beneficiaryQR/${location_id}/${client_id}`, beneficiaryQR);
  }

  getLocations(){
    return this.http.get<Location[]>(`${environment.url_api}/locations`);
  }

  getUserStatus(){
    return this.http.get<UserStatus>(`${environment.url_api}/user/status`);
  }

  getUserLocation(){
    return this.http.get<Location>(`${environment.url_api}/user/location`);
  }

  onBoard(value: boolean, location_id: number, client_id?: number){
    return this.http.post<any>(`${environment.url_api}/onBoard`, {value: value, location_id: location_id, client_id: client_id});
  }

}
