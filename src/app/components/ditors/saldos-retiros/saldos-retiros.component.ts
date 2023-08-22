import { Component } from '@angular/core';

@Component({
  selector: 'app-saldos-retiros',
  templateUrl: './saldos-retiros.component.html',
  styleUrls: ['./saldos-retiros.component.scss']
})
export class SaldosRetirosComponent {
  listaMisiones = [{
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
