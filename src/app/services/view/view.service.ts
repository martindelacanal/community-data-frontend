import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewTicket } from 'src/app/models/view/view-ticket';
import { ViewTicketImage } from 'src/app/models/view/view-ticket-image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(
    private http: HttpClient
  ) { }

  getViewTicket(idTicket: string){
    return this.http.get<ViewTicket>(`${environment.url_api}/view/ticket/${idTicket}`)
  }

  getImages(idTicket: string){
    return this.http.get<ViewTicketImage[]>(`${environment.url_api}/view/ticket/images/${idTicket}`);
  }
}
