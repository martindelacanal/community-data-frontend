import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { deliveredTable } from 'src/app/models/tables/delivered-table';
import { locationTable } from 'src/app/models/tables/location-table';
import { notificationTable } from 'src/app/models/tables/notification-table';
import { productTable } from 'src/app/models/tables/product-table';
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

  resetPassword(id: string){
    return this.http.delete<any>(`${environment.url_api}/user/reset-password/${id}`);
  }
}
