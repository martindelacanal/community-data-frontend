import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';
export interface Tab {
  label: string;
  content: string;
}
@Component({
  selector: 'app-capacidad-misiones',
  templateUrl: './capacidad-misiones.component.html',
  styleUrls: ['./capacidad-misiones.component.scss']
})
export class CapacidadMisionesComponent {
  listaMisiones = [{
    idDitor: '#15',
    nombre:'Juan',
    ditorDesde:'29/05/2023',
    nivel:'22',
    ranking:'#15',
    capacidad: '40 misiones',
    deuda:'$15.000',
    localidad:'La Plata',
    nacionalidad:'Argentina',
    reclamos:'0',
    tabIndex: 7
   }];
   asyncTab: Observable<Tab[]>;
   tabIndex=0;
   constructor() {
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
  changeTab(event: { index: number; }){
    this.tabIndex = event.index;
  }
  //implementar la busqueda
  buscar(){
    
  }
}
