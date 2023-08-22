import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';
export interface Tab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-campanias-pausadas',
  templateUrl: './campanias-pausadas.component.html',
  styleUrls: ['./campanias-pausadas.component.scss']
})
export class CampaniasPausadasComponent {
  listaMisiones = [{
    idMision: '#M15',
    idCamp:'#CC15',
    cliente:'Farmacity',
    tipoMision:'Presencia',
    fechaFin:'29/05/2023',
    estado: 'Disponible',
    tabIndex: 8
   }];
   listaCompletadas = [{
    idMision: '#M15',
    idCamp:'#CC15',
    cliente:'Farmacity',
    tipoMision:'Presencia',
    fecha:'29/05/2023',
    duracion: '30 min',
    idDitor:'#D32',
    tabIndex: 9

   }];
   listaEnVivo = [{
    idMision: '#M15',
    idCamp:'#CC15',
    cliente:'Farmacity',
    tipoMision:'Presencia',
    fechaFin:'29/05/2023',
    idDitor: '#D32',
    nombre: 'Juan',
    tabIndex: 10
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
