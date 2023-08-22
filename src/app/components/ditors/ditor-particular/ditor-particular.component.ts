import { Component } from '@angular/core';

@Component({
  selector: 'app-ditor-particular',
  templateUrl: './ditor-particular.component.html',
  styleUrls: ['./ditor-particular.component.scss']
})
export class DitorParticularComponent {

 listaDatos = {
  nombre:'Julian Alvarez',
  dni: '39986285',
  nacionalidad: 'Argentina',
  genero:'Masculino',
  direccion:'Rivadavia 8556',
  email:'asdas@hotmail.com',
  telefono:'2241694021',
  cobro:'Mercado Pago',
  verificacion:'Si',
  nivel:'Farmaceutica',
  fecha:'01/06/2023',
  exp:'2050 XP'

  
  
}
}
