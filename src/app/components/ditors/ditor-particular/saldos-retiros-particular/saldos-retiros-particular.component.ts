import { Component } from '@angular/core';

@Component({
  selector: 'app-saldos-retiros-particular',
  templateUrl: './saldos-retiros-particular.component.html',
  styleUrls: ['./saldos-retiros-particular.component.scss']
})
export class SaldosRetirosParticularComponent {
  listaMisiones = [{
    nombre:'Julian Alvarez',
    movimiento: '#REC',
    concepto:'Recompensa',
    tipoMision:'Presencia',
    fecha:'30/05/2023',
    hora:'11:38 hs',
    monto: '$750',
    idDitor:'#D32',
    tabIndex: 11
   }];
}
