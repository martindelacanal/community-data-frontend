import { Component, OnInit } from '@angular/core';
import { delay, from, mergeMap, toArray } from 'rxjs';
import { GraficoLinea } from 'src/app/models/grafico-linea/grafico-linea.model';
import { dashboardClientesService } from 'src/app/services/dashboard-clientes/dashboard-clientes.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {


  clientesPositivo = true;
  comerciosPositivo = false;
  ditorsPositivo = true;
  misionesPositivo = true;
  campActivas:number = 0;
  campPreparacion:number = 0;
  misionesDisponibles:number = 0;
  misionesRevision: number =0;
  clientesActivos: number=0;
  ditorsActivos: number = 0;
  formattedChartDataClientes: any[] = [];
  formattedChartDataComercios: any[] = [];
  formattedChartDataDitors: any[] = [];
  formattedChartDataMisiones: any[] = [];
  selectedTab ='';
  constructor(
    private dashboardClientesService:dashboardClientesService
  ) {
    this.selectedTab = 'Clientes';
  }

  getCampaniasActivas(){
    this.dashboardClientesService.getCampaniasActivas().subscribe(
      (resul)=>{
        this.campActivas = resul.total;
      }
    )
  }
  getCampaniasPreparacion(){
    this.dashboardClientesService.getCampaniasEnPreparacion().subscribe(
      (resul)=>{
        this.campPreparacion = resul.total;
      }
    )
  }
  getMisionesDisponibles(){
    this.dashboardClientesService.getMisionesDisponibles().subscribe(
      (resul)=>{

        this.misionesDisponibles = resul.total;
      }
    )
  }
  getMisionesRevision(){
    this.dashboardClientesService.getCantidadMisionesRevision().subscribe(
      (resul)=>{
        this.misionesRevision = resul.total;
      }
    )
  }
  getClientesActivos(){
    this.dashboardClientesService.getClientesActivos().subscribe(
      (resul)=>{

        this.clientesActivos= resul.total;
      }
    )
  }
 getDitorsActivos(){
  this.dashboardClientesService.getDitorsActivos().subscribe(
    (resul)=>{

      this.ditorsActivos = resul.total;
    }
  )
 }
  getClientesMes(){

  this.dashboardClientesService.getClientesMes().pipe(
    mergeMap((response: GraficoLinea[]) => {
      return from(response).pipe(
        delay(20), // Añade un retardo para simular la carga progresiva
        toArray()
      );
    })).subscribe((formattedData: any[]) => {
      this.formattedChartDataClientes = [
        {
          name: 'Clientes',
          series: formattedData.map((item: GraficoLinea) => {
            return {
              name: item.name,
              value: item.value
            };
          })
        }
      ]

    });

 }
 getComerciosMes(){
  this.dashboardClientesService.getComerciosMes().pipe(
    mergeMap((response: GraficoLinea[]) => {
      return from(response).pipe(
        delay(10), // Añade un retardo para simular la carga progresiva
        toArray()
      );
    })).subscribe((formattedData: any[]) => {
      this.formattedChartDataComercios = [
        {
          name: 'Comercios',
          series: formattedData.map((item: GraficoLinea) => {
            return {
              name: item.name,
              value: item.value
            };
          })
        }
      ]

    });

 }
  ngOnInit(){

    // this.getClientesMes();
    // this.getCampaniasActivas();
    // this.getCampaniasPreparacion();
    // this.getMisionesDisponibles();
    // this.getMisionesRevision();
    // this.getClientesActivos();
    // this.getDitorsActivos();

    // this.getComerciosMes();

  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

}
