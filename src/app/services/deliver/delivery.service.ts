import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { Location } from 'src/app/models/map/location';
import { UserStatus } from 'src/app/models/user/user-status';
import { RegisterQuestion } from 'src/app/models/login/register-question';
import { WorkerFilter } from 'src/app/models/view/view-worker/worker-filter';

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
  uploadPhone(phone: number, location_id: number, client_id: number, user_id_from_phone_list: number){
    const body = {phone: phone, user_id: user_id_from_phone_list};
    return this.http.post<any>(`${environment.url_api}/upload/beneficiaryPhone/${location_id}/${client_id}`, body);
  }

  getWorkers(){
    return this.http.get<WorkerFilter[]>(`${environment.url_api}/workers`);
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

  getQuestions(language: string, location_id: number) {
    return this.http.get<RegisterQuestion[]>(`${environment.url_api}/onBoard/questions?language=${language}&location_id=${location_id}`);
  }

  onBoard(value: boolean, location_id: number, client_id?: number){
    return this.http.post<any>(`${environment.url_api}/onBoard`, {value: value, location_id: location_id, client_id: client_id});
  }

  postNewAnswers(form: any, location_id: number) {
    return this.http.post(`${environment.url_api}/onBoard/answers?location_id=${location_id}`, form);
  }
}
