import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { clientTable } from 'src/app/models/tables/client-table';
import { deliveredByTable } from 'src/app/models/tables/delivered-by-table';
import { deliveredTable } from 'src/app/models/tables/delivered-table';
import { ethnicityTable } from 'src/app/models/tables/ethnicity-table';
import { genderTable } from 'src/app/models/tables/gender-table';
import { locationTable } from 'src/app/models/tables/location-table';
import { notificationTable } from 'src/app/models/tables/notification-table';
import { productTable } from 'src/app/models/tables/product-table';
import { productTypeTable } from 'src/app/models/tables/product-type-table';
import { providerTable } from 'src/app/models/tables/provider-table';
import { ticketTable } from 'src/app/models/tables/ticket-table';
import { transportedByTable } from 'src/app/models/tables/transported-by-table';
import { userTable } from 'src/app/models/tables/user-table';
import { workerTable } from 'src/app/models/tables/worker-table';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(
    private http: HttpClient
  ) { }

  getDataUserTable(page: number, columna: string, ordenarTipo: string, buscar: string, tableRole: string, filters: any){
    return this.http.post<userTable>(`${environment.url_api}/table/user?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&tableRole=${tableRole}`, filters)
  }

  getDataTicketTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<ticketTable>(`${environment.url_api}/table/ticket?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataDeliveredTable(page: number, columna: string, ordenarTipo: string, buscar: string, filters: any){
    return this.http.post<deliveredTable>(`${environment.url_api}/table/delivered?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`, filters)
  }

  getDataProductTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<productTable>(`${environment.url_api}/table/product?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataProductTypeTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<productTypeTable>(`${environment.url_api}/table/product-type?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataGenderTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<genderTable>(`${environment.url_api}/table/gender?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataDeliveredByTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<deliveredByTable>(`${environment.url_api}/table/delivered-by?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataTransportedByTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<transportedByTable>(`${environment.url_api}/table/transported-by?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataEthnicityTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<ethnicityTable>(`${environment.url_api}/table/ethnicity?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataProviderTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<providerTable>(`${environment.url_api}/table/provider?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataClientTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<clientTable>(`${environment.url_api}/table/client?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getDataNotificationTable(page: number, columna: string, ordenarTipo: string, buscar: string){
    return this.http.get<notificationTable>(`${environment.url_api}/table/notification?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`)
  }

  getDataLocationTable(page: number, columna: string, ordenarTipo: string, buscar: string, filters: any){
    return this.http.post<locationTable>(`${environment.url_api}/table/location?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`, filters)
  }

  getDataWorkerTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string, filters: any){
    return this.http.post<workerTable>(`${environment.url_api}/table/worker?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`, filters)
  }

  getFileCSV(language: string, filters: any) {
    return this.http.post(`${environment.url_api}/table/ticket/download-csv?language=${language}`, filters, { responseType: 'blob' });
  }

  deleteTicket(id: string){
    return this.http.delete<any>(`${environment.url_api}/ticket/${id}`);
  }

  getDeliveredFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/delivered/download-csv`, filters, { responseType: 'text' });
  }

  getDeliveredBeneficiarySummaryFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/delivered/beneficiary-summary/download-csv`, filters, { responseType: 'text' });
  }

  getSystemUserFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/user/system-user/download-csv`, filters, { responseType: 'text' });
  }

  getClientUserFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/user/client/download-csv`, filters, { responseType: 'text' });
  }

  getParticipantFileCSVMailchimp(filters: any) {
    return this.http.post(`${environment.url_api}/table/user/beneficiary/download-csv-mailchimp`, filters, { responseType: 'text' });
  }

  getParticipantFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/user/beneficiary/download-csv`, filters, { responseType: 'text' });
  }

  getClientFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/client/download-csv`, filters, { responseType: 'text' });
  }

  getEthnicityFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/ethnicity/download-csv`, filters, { responseType: 'text' });
  }

  getGenderFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/gender/download-csv`, filters, { responseType: 'text' });
  }

  getDeliveredByFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/delivered-by/download-csv`, filters, { responseType: 'text' });
  }

  getTransportedByFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/transported-by/download-csv`, filters, { responseType: 'text' });
  }

  getLocationFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/location/download-csv`, filters, { responseType: 'text' });
  }

  getProductFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/product/download-csv`, filters, { responseType: 'text' });
  }

  getProductTypeFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/product-type/download-csv`, filters, { responseType: 'text' });
  }

  getProviderFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/provider/download-csv`, filters, { responseType: 'text' });
  }

  getWorkerFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/worker/download-csv`, filters, { responseType: 'text' });
  }

  resetPassword(id: string){
    return this.http.delete<any>(`${environment.url_api}/user/reset-password/${id}`);
  }

  enableDisableElement(id: string, table: string, enabled: string){
    return this.http.put<any>(`${environment.url_api}/enable-disable/${id}`, { table: table, enabled: enabled });
  }
}
