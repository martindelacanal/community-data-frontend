import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { campActivas } from 'src/app/models/campanias-activas/campanias-activas.model';
import { Contador } from 'src/app/models/contador/contador.model';
import {  dashboardClientesService } from 'src/app/services/dashboard-clientes/dashboard-clientes.service';

@Component({
  selector: 'app-dashboard-clientes',
  templateUrl: './dashboard-clientes.component.html',
  styleUrls: ['./dashboard-clientes.component.scss']
})
export class DashboardClientesComponent implements OnInit {
  totalMisionesRevision:number = 0;
  selectedTab = 'Mes';
  totalClientes:number = 0;
  totalComercios:number = 0;
  totalArticulos:number = 0;
  campActivas: number = 0;
  campPreparacion: number = 0;
 
  constructor(
    private route: Router,
    private dashboardClientesService: dashboardClientesService
  ) { }
 
  ngOnInit(): void {
    this.getMisionesRevisionTotal();
    this.getTotalClientes();
    this.getTotalComercios();
    this.getTotalArticulos();

    
  }
  
  getMisionesRevisionTotal(){
    this.dashboardClientesService.getCantidadMisionesRevision().subscribe(
      (resul)=>{
       
        this.totalMisionesRevision = resul.total;
      }
    );
  }
  getTotalClientes(){
    this.dashboardClientesService.getTotalClientes().subscribe(
      (resul)=>{
        this.totalClientes = resul.total;
      }
    )
  }
  getTotalArticulos(){
    this.dashboardClientesService.getTotalArticulos().subscribe(
      (resul)=>{
        this.totalArticulos = resul.total;
      }
    )
  }
  irtotalClientes(){
    this.route.navigate(['/clientes/listado-clientes']);

  }
  getTotalComercios(){
    this.dashboardClientesService.getTotalComercios().subscribe(
      (resul)=>{
        this.totalComercios = resul.total;
      }
    )
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

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
