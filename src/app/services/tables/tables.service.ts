import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userTable } from 'src/app/models/tables/user-table';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(
    private http: HttpClient
  ) { }

  getDataUserTable(page: number, columna: string, ordenarTipo: string, buscar: string){
    return this.http.get<userTable>(`${environment.url_api}/table/user?page=${page}&orderBy=${columna}&search=${buscar}&orderType=${ordenarTipo}`)
  }
}
