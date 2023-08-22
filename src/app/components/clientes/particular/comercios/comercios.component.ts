import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-comercios',
  templateUrl: './comercios.component.html',
  styleUrls: ['./comercios.component.scss']
})
export class ComerciosComponent {
  dataSource = new MatTableDataSource();
   //paginador
   @ViewChild(MatPaginator) paginator: MatPaginator;
   columns = ['ID Comercio', 'Tipo de Comercio', 'Localidad', 'Misiones Disponibles', 'Misiones Completadas',' '];

   ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
   }
}
