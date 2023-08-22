import { Component } from '@angular/core';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss']
})
export class AcercaDeComponent {
 listaDatos = {
    nombre: 'Farmacity',
    id: '#C15',
    razon:'Grupo Farmacity s.a',
    cuit:'17-29387162-8',
    fechaInicio:'10/02/2023',
    pais:'Argentina',
    prov:'Provincia de Buenos Aires',
    dir:'Av.Corrientes 440,CABA',
    rubro:'Farmaceutica',
    web:'https://www.farmacity.com',
    contactos:[ {

      nombre:'Raul',
      email:'raul@farmacity.com.ar',
      num:'+54911507896'
      
      
    },{
      nombre:'Damian',
      email:'damian@farmacity.com.ar',
      num:'+54911507896'
    }],
    cantidad: 2
    
 }
}
