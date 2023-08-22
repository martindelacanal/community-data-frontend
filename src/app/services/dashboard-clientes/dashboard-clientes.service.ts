import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contador } from 'src/app/models/contador/contador.model';
import { GraficoLinea } from 'src/app/models/grafico-linea/grafico-linea.model';
import { graficoTorta } from 'src/app/models/grafico-torta/grafico-torta.model';
import { MisionesRevision } from 'src/app/models/misiones-en-revision/misiones-revision.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class dashboardClientesService{
    constructor(
        private http: HttpClient
    ){}

    getMisionesRevision(){
        return this.http.get<MisionesRevision[]>(`${environment.url_api}/misiones-revision`);
    }

    getClientesMes(){
        return this.http.get<GraficoLinea[]>(`${environment.url_api}/total-clientes-mes`);
    }
    getComerciosMes(){
        return this.http.get<GraficoLinea[]>(`${environment.url_api}/total-comercios-mes`);
    }
    getCantidadMisionesRevision(){
        return this.http.get<Contador>(`${environment.url_api}/misiones-revision-total`);
    }

    getTotalClientes(){
        return this.http.get<Contador>(`${environment.url_api}/total-clientes`);
    }
    getClientesActivos(){
        return this.http.get<Contador>(`${environment.url_api}/clientes-activos`);
    }
    getTotalComercios(){
        return this.http.get<Contador>(`${environment.url_api}/total-comercios`);
    }
    getTotalArticulos(){
        return this.http.get<Contador>(`${environment.url_api}/total-articulos`);
    }
    getCampaniasEnPreparacion(){
        return this.http.get<Contador>(`${environment.url_api}/campanias-preparacion`);
    }
    getCampaniasActivas(){
        return this.http.get<Contador>(`${environment.url_api}/campanias-activas`);
    }
    getMisionesDisponibles(){
        return this.http.get<Contador>(`${environment.url_api}/misiones-disponibles-total`); 

    }
    getDitorsActivos(){
        return this.http.get<Contador>(`${environment.url_api}/ditors-activos`); 

    }
    getDataCampaniasActivas(){
        return this.http.get<graficoTorta>(`${environment.url_api}/campanias-activas-torta`);
    }
    getDataCampaniasPreparacion(){
        return this.http.get<graficoTorta>(`${environment.url_api}/campanias-preparacion-torta`);
    }
}