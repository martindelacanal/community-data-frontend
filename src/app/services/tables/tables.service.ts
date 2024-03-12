import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { clientTable } from 'src/app/models/tables/client-table';
import { deliveredTable } from 'src/app/models/tables/delivered-table';
import { ethnicityTable } from 'src/app/models/tables/ethnicity-table';
import { genderTable } from 'src/app/models/tables/gender-table';
import { locationTable } from 'src/app/models/tables/location-table';
import { notificationTable } from 'src/app/models/tables/notification-table';
import { productTable } from 'src/app/models/tables/product-table';
import { productTypeTable } from 'src/app/models/tables/product-type-table';
import { providerTable } from 'src/app/models/tables/provider-table';
import { ticketTable } from 'src/app/models/tables/ticket-table';
import { userTable } from 'src/app/models/tables/user-table';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(
    private http: HttpClient
  ) { }

  getDataUserTable(page: number, columna: string, ordenarTipo: string, buscar: string, tableRole: string){
    return this.http.get<userTable>(`${environment.url_api}/table/user?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&tableRole=${tableRole}`)
  }

  getDataTicketTable(page: number, columna: string, ordenarTipo: string, buscar: string){
    return this.http.get<ticketTable>(`${environment.url_api}/table/ticket?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`)
  }

  getDataDeliveredTable(page: number, columna: string, ordenarTipo: string, buscar: string){
    return this.http.get<deliveredTable>(`${environment.url_api}/table/delivered?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`)
  }

  getDataProductTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string){
    return this.http.get<productTable>(`${environment.url_api}/table/product?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`)
  }

  getDataProductTypeTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string){
    return this.http.get<productTypeTable>(`${environment.url_api}/table/product-type?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`)
  }

  getDataGenderTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string){
    return this.http.get<genderTable>(`${environment.url_api}/table/gender?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`)
  }

  getDataEthnicityTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string){
    return this.http.get<ethnicityTable>(`${environment.url_api}/table/ethnicity?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`)
  }

  getDataProviderTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string){
    return this.http.get<providerTable>(`${environment.url_api}/table/provider?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`)
  }

  getDataClientTable(page: number, columna: string, ordenarTipo: string, buscar: string, language: string){
    return this.http.get<clientTable>(`${environment.url_api}/table/client?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}&language=${language}`)
  }

  getDataNotificationTable(page: number, columna: string, ordenarTipo: string, buscar: string){
    return this.http.get<notificationTable>(`${environment.url_api}/table/notification?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`)
  }

  getDataLocationTable(page: number, columna: string, ordenarTipo: string, buscar: string){
    return this.http.get<locationTable>(`${environment.url_api}/table/location?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`)
  }

  getFileCSV(from_date: string, to_date: string) {
    return this.http.get(`${environment.url_api}/table/ticket/download-csv?from_date=${from_date}&to_date=${to_date}`, { responseType: 'text' });
  }

  getDeliveredFileCSV(from_date: string, to_date: string) {
    return this.http.get(`${environment.url_api}/table/delivered/download-csv?from_date=${from_date}&to_date=${to_date}`, { responseType: 'text' });
  }

  getDeliveredBeneficiarySummaryFileCSV(from_date: string, to_date: string) {
    return this.http.get(`${environment.url_api}/table/delivered/beneficiary-summary/download-csv?from_date=${from_date}&to_date=${to_date}`, { responseType: 'text' });
  }

  getSystemUserFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/user/system-user/download-csv`, filters, { responseType: 'text' });
  }

  getClientFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/user/client/download-csv`, filters, { responseType: 'text' });
  }

  getParticipantFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/table/user/beneficiary/download-csv`, filters, { responseType: 'text' });
  }

  resetPassword(id: string){
    return this.http.delete<any>(`${environment.url_api}/user/reset-password/${id}`);
  }

  enableDisableElement(id: string, table: string, enabled: string){
    return this.http.put<any>(`${environment.url_api}/enable-disable/${id}`, { table: table, enabled: enabled });
  }
}
