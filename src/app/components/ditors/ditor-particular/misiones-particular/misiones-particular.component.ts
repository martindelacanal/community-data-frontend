import { Component } from '@angular/core';

@Component({
  selector: 'app-misiones-particular',
  templateUrl: './misiones-particular.component.html',
  styleUrls: ['./misiones-particular.component.scss']
})
export class MisionesParticularComponent {
  listaMisionesCompletadas = [{
    idMision: '#M15',
    idCamp:'#CC15',
    cliente:'Farmacity',
    tipoMision:'Presencia',
    fecha:'29/05/2023',
    duracion: '30 min',
    idDitor:'#D32',
    tabIndex: 9

   }];
}
