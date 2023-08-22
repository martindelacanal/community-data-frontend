import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Tab } from '../capacidad-misiones/capacidad-misiones.component';

@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.scss']
})
export class ReferidosComponent {
  listaReferidos = [{
    idDitor: '#15',
    nombre:'Juan',
    ditorDesde:'29/05/2023',
    codigo:'UIJK02',
    tiempo:'1 día(s)',
    utilizado: '22',
    ganancia:'$11.000',
   
    tabIndex: 15
   }];
   asyncTab: Observable<Tab[]>;
   tabIndex=0;
   constructor() {
    this.asyncTab = new Observable((observer: Observer<Tab[]>) => {
      setTimeout(() => {
        observer.next([
          {label: 'Total', content: 'Content 1'},
          {label: 'Activos', content: 'Content 2'},
          {label: 'Vencidos', content: 'Content 3'},
          
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
