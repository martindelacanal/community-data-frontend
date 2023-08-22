import { Component } from '@angular/core';
import { Clientes } from 'src/app/models/nuevo-campania/clientes';

@Component({
  selector: 'app-nuevo-campania',
  templateUrl: './nuevo-campania.component.html',
  styleUrls: ['./nuevo-campania.component.scss']
})
export class NuevoCampaniaComponent {

  clientes: Clientes[] = [];
  step: number = 1;

  servicios = [
    { id: 1, name: 'Presencia' },
    { id: 2, name: 'Precio' },
    { id: 3, name: 'Comunicación' },
    { id: 4, name: 'Personalizado' }
  ];

  constructor() { }

  addStep() {
    if (this.step < 5) {
      this.step++;
    }
  }
  subStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

}
