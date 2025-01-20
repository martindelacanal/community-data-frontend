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

  postGraficoLinea(selectedTab: string, language: string, filters: any) {
    return this.http.post<GraphicLineComplete>(`${environment.url_api}/dashboard/graphic-line/${selectedTab}?language=${language}`, filters);
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

  getHouseHoldSizeAverage() {
    return this.http.get<number>(`${environment.url_api}/house-hold-size-average`);
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

  getTotalBeneficiariesWithoutHealthInsurance() {
    return this.http.get<number>(`${environment.url_api}/total-beneficiaries-without-health-insurance`);
  }

  getTotalBeneficiariesRegisteredToday() {
    return this.http.get<number>(`${environment.url_api}/total-beneficiaries-registered-today`);
  }

  getTotalBeneficiariesRecurringTodayScanned() {
    return this.http.get<number>(`${environment.url_api}/total-beneficiaries-recurring-today-scanned`);
  }

  getTotalBeneficiariesRecurringTodayNotScanned() {
    return this.http.get<number>(`${environment.url_api}/total-beneficiaries-recurring-today-not-scanned`);
  }

  getTotalBeneficiariesQualified() {
    return this.http.get<number>(`${environment.url_api}/total-beneficiaries-qualified`);
  }

  getTotalClients() {
    return this.http.get<number>(`${environment.url_api}/total-clients`);
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

  getTotalDelivered() {
    return this.http.get<number>(`${environment.url_api}/total-delivered`);
  }
}
