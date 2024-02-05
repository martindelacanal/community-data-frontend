import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewDelivered } from 'src/app/models/view/view-delivered';
import { ViewProduct } from 'src/app/models/view/view-product';
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

  getViewDelivered(idDelivered: string){
    return this.http.get<ViewDelivered>(`${environment.url_api}/view/delivered/${idDelivered}`)
  }

  getViewProduct(idProduct: string){
    return this.http.get<ViewProduct>(`${environment.url_api}/view/product/${idProduct}`)
  }

  getViewTicket(idTicket: string){
    return this.http.get<ViewTicket>(`${environment.url_api}/view/ticket/${idTicket}`)
  }

  getImagesTicket(idTicket: string){
    return this.http.get<ViewTicketImage[]>(`${environment.url_api}/view/ticket/images/${idTicket}`);
  }
}
