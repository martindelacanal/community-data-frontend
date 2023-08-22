import { Component, OnInit, ViewChild } from '@angular/core';
import { TablasComponent } from 'src/app/components/tablas/tablas.component';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {
  @ViewChild(TablasComponent) tablaComponent: TablasComponent;
  listaClientes= [{
    idCliente: '#15',
    nombre:'Matias',
    campaniasActivas:'2',
    totalMisiones:'20',
    pendienteCobro:'$2000',
    estado:'Activo'
   }];
   //este vector sirve para mandar las opciones que tenga el boton dentro de la tabla
   datosMenu=[{
    detalleCliente:'Detalle Cliente',

   }];
   //columnas que se le pasan al componente tabla
  columnsClientes = ['ID Cliente', 'Nombre de Cliente', 'Campañas Activas', 'Total Misiones', 'Pendiente de Cobro', 'Estado'];
  //con esta funcion mapeamos las columnas para que los datos puedan mostrarse en la columna correspondiente
  mapeoColumnas= {
    'ID Cliente': 'idCliente',
    'Nombre de Cliente':'nombre',
    'Campañas Activas':'campaniasActivas',
    'Total Misiones':'totalMisiones',
    'Pendiente de Cobro':'pendienteCobro',
    'Estado': 'estado',
    ' ':' '};
  ngOnInit(): void {
    
  }
}
