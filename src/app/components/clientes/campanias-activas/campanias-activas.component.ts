import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Observable, Observer } from 'rxjs';
import { campaniasActivasService } from 'src/app/services/campanias-activa/campanias-activas.service';


export interface Tab {
  label: string;
  content: string;
}
@Component({
  selector: 'app-campanias-activas',
  templateUrl: './campanias-activas.component.html',
  styleUrls: ['./campanias-activas.component.scss']
})

export class CampaniasActivasComponent {
  //columnas de las tablas para campanias
  
  //columnas Activas/Preparacion
  columnsActivas = ['ID Campaña', 'Cliente', 'Tipo de Campaña', 'Fecha de Solicitud', '# Misiones', 'Presupuesto Total',' '];
  //en preparacion
  columnsPreparacion =['ID Campaña', 'Cliente', 'Tipo de Campaña', 'Fecha de Solicitud', '# Misiones', 'Presupuesto Total',' ']
  //pausadas
  columnsCampPausadas = ['ID Mision', 'ID Campania', 'Cliente', 'Tipo de mision', 'Fecha de finalizacion'];
  //finalizadas
  columnsFinalizadas = ['ID Campaña', 'Cliente', 'Fecha Inicio', 'Fecha Fin', 'Nombre Campaña', '% Finalización','Tipo de Campaña','Estado','Revenue Total',' '];
  //canceladas
  columnsCanceladas=['ID Campaña', 'Cliente', 'Fecha Inicio', 'Fecha Fin', 'Nombre Campaña', '% Finalización','Tipo de Campaña','Estado','Revenue Total',' ' ]
  dataSource = new MatTableDataSource();
  listaResultados= [
    {
      data:'asdasdas'
    }
  ];
  asyncTab: Observable<Tab[]>;
  tabIndex = 0 ;
  seleccionado=false;

  constructor(private campaniasService:campaniasActivasService) {
    this.asyncTab = new Observable((observer: Observer<Tab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Activas', content: 'Content 1'},
          {label: 'En preparación', content: 'Content 2'},
          {label: 'Finalizadas', content: 'Content 3'},
          {label: 'Pausadas', content: 'Content 4'},
          {label: 'Canceladas', content: 'Content 5'},
        ]);
      }, 1000);
    });
  }
  
  //paginador
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  
 
 //index de los tabs
 changeTab(event: { index: number; }){
  this.tabIndex = event.index;
}

  
  //implementar la busqueda
  buscar(){

  }

  // obtenerCampActivas(){
  //   this.campaniasService.getCampActivas().subscribe(
  //     (resul)=>{

  //     }
  //   )
  // }

  ngOnInit(){
    
    
  }
}
