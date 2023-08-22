import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export interface Tab {
  label: string;
  content: string;
}
@Component({
  selector: 'app-entrenamientos-y-certificaciones',
  templateUrl: './entrenamientos-y-certificaciones.component.html',
  styleUrls: ['./entrenamientos-y-certificaciones.component.scss']
})
export class EntrenamientosYCertificacionesComponent {
  tabIndex=0;
  asyncTab: Observable<Tab[]>;
  constructor() {
   this.asyncTab = new Observable((observer: Observer<Tab[]>) => {
     setTimeout(() => {
       observer.next([
         {label: 'Entrenamientos', content: 'Content 1'},
         {label: 'Certificaciones', content: 'Content 2'}
         
       ]);
     }, 1000);
   });
 }
 changeTab(event: { index: number; }){
   this.tabIndex = event.index;
 }
  listaEntrenamientos = [{
    idEntrena:'#E01',
    nombre: 'Julian Alvarez',
    estado:'Activo',
    fecha:'30/05/2023',
    xp:'2500 XP',
    cantidad:'2',
    realizados:'10',
    ultimomes:'2',
    sinfinalizar:'1',
    tabIndex: 13
   }];
   listaCertificaciones = [{
    idCertif:'#E01',
    nombre: 'Julian Alvarez',
    estado:'Activo',
    fecha:'30/05/2023',
    xp:'2500 XP',
    cantidad:'2',
    realizados:'10',
    ultimomes:'2',
    sinfinalizar:'1',
    tabIndex: 14
   }];
}
