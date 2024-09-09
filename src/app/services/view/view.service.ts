import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewClient } from 'src/app/models/view/view-client';
import { ViewDelivered } from 'src/app/models/view/view-delivered';
import { ViewEthnicity } from 'src/app/models/view/view-ethnicity';
import { ViewGender } from 'src/app/models/view/view-gender';
import { ViewLocation } from 'src/app/models/view/view-location';
import { ViewNotification } from 'src/app/models/view/view-notification';
import { ViewProduct } from 'src/app/models/view/view-product';
import { ViewProductType } from 'src/app/models/view/view-product-type';
import { ViewProvider } from 'src/app/models/view/view-provider';
import { ViewTicket } from 'src/app/models/view/view-ticket';
import { ViewTicketImage } from 'src/app/models/view/view-ticket-image';
import { ViewUser } from 'src/app/models/view/view-user';
import { ViewWorkerTable } from 'src/app/models/view/view-worker/view-worker-table';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor(
    private http: HttpClient
  ) { }

  getViewUser(idUser: string, language: string){
    return this.http.get<ViewUser>(`${environment.url_api}/view/user/${idUser}?language=${language}`)
  }

  getViewWorkerTable(idWorker: string, language: string, filters: any){
    return this.http.post<ViewWorkerTable[]>(`${environment.url_api}/view/worker/table/${idWorker}?language=${language}`, filters)
  }

  getViewLocation(idLocation: string){
    return this.http.get<ViewLocation>(`${environment.url_api}/view/location/${idLocation}`)
  }

  getViewNotification(idNotification: string){
    return this.http.get<ViewNotification>(`${environment.url_api}/view/notification/${idNotification}`)
  }

  getViewDelivered(idDelivered: string){
    return this.http.get<ViewDelivered>(`${environment.url_api}/view/delivered/${idDelivered}`)
  }

  getViewClient(idClient: string){
    return this.http.get<ViewClient>(`${environment.url_api}/view/client/${idClient}`)
  }

  getViewProvider(idProvider: string){
    return this.http.get<ViewProvider>(`${environment.url_api}/view/provider/${idProvider}`)
  }

  getViewProduct(idProduct: string){
    return this.http.get<ViewProduct>(`${environment.url_api}/view/product/${idProduct}`)
  }

  getViewProductType(idProductType: string){
    return this.http.get<ViewProductType>(`${environment.url_api}/view/product-type/${idProductType}`)
  }

  getViewGender(idGender: string){
    return this.http.get<ViewGender>(`${environment.url_api}/view/gender/${idGender}`)
  }

  getViewEthnicity(idEthnicity: string){
    return this.http.get<ViewEthnicity>(`${environment.url_api}/view/ethnicity/${idEthnicity}`)
  }

  getViewTicket(idTicket: string, language: string){
    return this.http.get<ViewTicket>(`${environment.url_api}/view/ticket/${idTicket}?language=${language}`)
  }

  getImagesTicket(idTicket: string){
    return this.http.get<ViewTicketImage[]>(`${environment.url_api}/view/ticket/images/${idTicket}`);
  }
}
