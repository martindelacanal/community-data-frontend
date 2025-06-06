import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphicLineComplete } from 'src/app/models/grafico-linea/graphic-line-complete';
import { KindOfProductMetrics } from 'src/app/models/metrics/kindOfProduct-metrics';
import { ViewClient } from 'src/app/models/view/view-client';
import { ViewDelivered } from 'src/app/models/view/view-delivered';
import { ViewDeliveredBy } from 'src/app/models/view/view-delivered-by';
import { ViewEthnicity } from 'src/app/models/view/view-ethnicity';
import { ViewGender } from 'src/app/models/view/view-gender';
import { ViewLocation } from 'src/app/models/view/view-location';
import { ViewNotification } from 'src/app/models/view/view-notification';
import { ViewProduct } from 'src/app/models/view/view-product';
import { ViewProductType } from 'src/app/models/view/view-product-type';
import { ViewProvider } from 'src/app/models/view/view-provider';
import { ViewTicket } from 'src/app/models/view/view-ticket';
import { ViewTicketImage } from 'src/app/models/view/view-ticket-image';
import { ViewTransportedBy } from 'src/app/models/view/view-transported-by';
import { ViewUser } from 'src/app/models/view/view-user';
import { ViewVolunteer } from 'src/app/models/view/view-volunteer';
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

  getScannedQRWorkerMetrics(language: string, filters: any, idUser: string){
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<KindOfProductMetrics[]>(`${environment.url_api}/view/worker/scannedQR/${idUser}`, filters, httpOptions);
  }

  getScanHistoryWorkerMetrics(language: string, filters: any, idUser: string) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<GraphicLineComplete[]>(`${environment.url_api}/view/worker/scanHistory/${idUser}`, filters, httpOptions);
  }

  getUsername(idWorker: string){
    return this.http.get<string>(`${environment.url_api}/view/worker/username/${idWorker}`)
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

  getViewDeliveredBy(idDeliveredBy: string){
    return this.http.get<ViewDeliveredBy>(`${environment.url_api}/view/delivered-by/${idDeliveredBy}`)
  }

  getViewTransportedBy(idTransportedBy: string){
    return this.http.get<ViewTransportedBy>(`${environment.url_api}/view/transported-by/${idTransportedBy}`)
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

  getViewVolunteer(idVolunteer: string, language: string){
    return this.http.get<ViewVolunteer>(`${environment.url_api}/view/volunteer/${idVolunteer}?language=${language}`)
  }

  getImagesVolunteer(idVolunteer: string){
    return this.http.get<ViewTicketImage[]>(`${environment.url_api}/view/volunteer/images/${idVolunteer}`);
  }
}
