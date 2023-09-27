import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphicLineComplete } from 'src/app/models/grafico-linea/graphic-line-complete';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardGeneralService {

  constructor(
    private http: HttpClient
  ) { }

  getGraficoLinea(selectedTab: string, language: string) {
    return this.http.get<GraphicLineComplete>(`${environment.url_api}/dashboard/graphic-line/${selectedTab}?language=${language}`);
  }

  getPoundsDelivered() {
    return this.http.get<number>(`${environment.url_api}/pounds-delivered`);
  }

  getTotalLocations() {
    return this.http.get<number>(`${environment.url_api}/total-locations`);
  }

  getTotalDaysOperation() {
    return this.http.get<number>(`${environment.url_api}/total-days-operation`);
  }

  getTotalStockers() {
    return this.http.get<number>(`${environment.url_api}/total-from-role/stocker`);
  }

  getTotalDeliveries() {
    return this.http.get<number>(`${environment.url_api}/total-from-role/delivery`);
  }

  getTotalBeneficiaries() {
    return this.http.get<number>(`${environment.url_api}/total-from-role/beneficiary`);
  }

  getTotalBeneficiariesServed() {
    return this.http.get<number>(`${environment.url_api}/total-beneficiaries-served`);
  }

  getTotalBeneficiariesQualified() {
    return this.http.get<number>(`${environment.url_api}/total-beneficiaries-qualified`);
  }

  getTotalEnabledUsers() {
    return this.http.get<number>(`${environment.url_api}/total-enabled-users`);
  }

  getTotalTicketsUploaded() {
    return this.http.get<number>(`${environment.url_api}/total-tickets-uploaded`);
  }

  getTotalLocationsEnabled() {
    return this.http.get<number>(`${environment.url_api}/total-locations-enabled`);
  }

  getTotalProductsUploaded() {
    return this.http.get<number>(`${environment.url_api}/total-products-uploaded`);
  }
}
