import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-reclamos',
  templateUrl: './ditor-reclamos.component.html',
  styleUrls: ['./ditor-reclamos.component.scss']
})
export class DitorReclamosComponent {

  dataSource = new MatTableDataSource<any>();
  //paginador
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columns = ['ID Reclamo', 'Tipo de Reclamo', 'Fecha', 'Descripción', 'Origen', 'Cliente','Estado',' '];


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
