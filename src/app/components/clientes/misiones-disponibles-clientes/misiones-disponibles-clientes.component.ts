import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export interface Tab {
  label: string;
  content: string;
}
@Component({
  selector: 'app-misiones-disponibles',
  templateUrl: './misiones-disponibles-clientes.component.html',
  styleUrls: ['./misiones-disponibles-clientes.component.scss']
})
export class MisionesDisponiblesClientesComponent {
  asyncTab: Observable<Tab[]>;
  tabIndex=0;
  listaMisiones = [{
    idMision: '#M15',
    idCamp:'#CC15',
    cliente:'Farmacity',
    tipoMision:'Presencia',
    fechaFin:'17/5/2023',
    estado: 'Disponible',
    tabIndex: 6
   }];
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
