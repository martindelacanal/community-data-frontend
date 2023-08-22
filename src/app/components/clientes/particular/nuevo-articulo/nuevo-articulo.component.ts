import { Component } from '@angular/core';
import { Clientes } from 'src/app/models/nuevo-campania/clientes';

@Component({
  selector: 'app-nuevo-articulo',
  templateUrl: './nuevo-articulo.component.html',
  styleUrls: ['./nuevo-articulo.component.scss']
})
export class NuevoArticuloComponent {

  clientes: Clientes[] = [];
  step: number = 1;
  tipo: string = 'producto';

  constructor() { }

  addStep() {
    this.step++;
  }
  subStep() {
    this.step--;
  }

}
