import { Component, Input, ViewChild , OnInit, EventEmitter, Output} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
  const amountPages = Math.ceil(length / pageSize);
  if (length == 0 || pageSize == 0) { return `Página 0 de ${amountPages}`; }
  length = Math.max(length, 0);
  return `Página ${page + 1} de ${amountPages}`;
}

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.scss']
})
export class TablasComponent implements OnInit {
  @Input() datosTabla: any[];
  @Input() columnas: string[];
  @Input() mapeoColumnas: { [key: string]: string };
  @Input() datosMenu:any[];
  @Output() paginaCambiada = new EventEmitter<number>();
  @Output() ordenCambiado = new EventEmitter<{ columna: string, direccion: string }>();
  tabIndex = 0;
  ordenarTipo: string = 'desc';
  pagina: number = 0;
  totalItems: number = 0;
  numOfPages: number = 0;
  columna: string ;

  columnsFinalizadas = ['ID Campaña', 'Cliente', 'Fecha Inicio', 'Fecha Fin', 'Nombre Campaña', '% Finalización','Tipo de Campaña','Estado','Revenue Total',' '];
  //columnas Activas/Preparacion
  columns = ['ID Campaña', 'Cliente', 'Tipo de Campaña', 'Fecha de Solicitud', '# Misiones', 'Presupuesto Total',' '];
  //columnas Misiones 
  columnsMisiones = ['ID Misión', 'ID Campaña', 'Cliente', 'Tipo de Misión', 'Fecha de Finalización', 'Estado'];
  //columnas listado ditors
  columnsListado = ['ID Ditor', 'Nombre', 'Ditor desde', 'Nivel', 'Ranking','Capacidad','Deuda','Localidad','Nacionalidad','Reclamos'];
  //columnas campanias pausadas
  columnsCampPausadas = ['ID Mision', 'ID Campania', 'Cliente', 'Tipo de mision', 'Fecha de finalizacion'];
   //columnas campanias en vivo
   columnsCampVivo = ['ID Mision', 'ID Campania', 'Cliente', 'Tipo de mision', 'Fecha de finalizacion','ID Ditor','Nombre'];
   //columnas campanias completadas
   columnsCampCompletas = ['ID Mision', 'ID Campania', 'Cliente', 'Tipo de mision', 'Fecha realizada','Duracion','ID Ditor'];
   //columnas saldos
   columnsSaldos = ['Movimiento', 'Concepto', 'Tipo de mision', 'Fecha', 'Hora','Monto','ID Ditor'];
    //columnas reclamos
    columnsReclamos = ['ID Reclamo', 'Tipo de reclamo', 'Fecha', 'Descripcion', 'Origen','ID Ditor','Estado'];
    //columnas entrenamiento
    columnsEntrenamiento = ['ID Entrenamiento','Nombre','Estado','Fecha de realizacion','XP'];
    //columnas certificaciones
    columnsCertificaciones = ['ID Certificacion','Nombre','Estado','Fecha de realizacion','XP'];
     //columnas referidos
     columnsReferidos = ['ID Ditor','Nombre','Ditor desde','Codigo','Tiempo','Utilizado','Ganancia'];
  dataSource:MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnMapping: { [key: string]: string };
  

  obtenerValor(fila: any, columna: string): any {
    if (this.mapeoColumnas && this.mapeoColumnas[columna]) {
      const propiedad = this.mapeoColumnas[columna];
      return fila[propiedad];
    } else {
      return null;
    }
  }
  //paginador
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private route: Router
  ){}


  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Items por página:';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.getRangeLabel = spanishRangeLabel;
  }
  
  ngOnInit(){
    this.dataSource = new MatTableDataSource(this.datosTabla);
    this.displayedColumns = this.columnas; 
    // this.numOfPages = this.datosTabla.numOfPages;
    // this.totalItems = this.datosTabla.totalItems;
    // this.pagina = this.datosTabla.page;
    // this.ordenarTipo = this.datosTabla.orderType;
    // this.columna = this.datosTabla.orderBy;
    this.dataSource.paginator = this.paginator;
   this.generateColumnMapping(this.datosTabla, this.columnas);
    
  }
  cambiarPagina(event: PageEvent): void {
    // this.pagina = event.pageIndex;
    this.paginaCambiada.emit(event.pageIndex);
  }
  ordenar(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.ordenCambiado.emit({ columna, direccion });
  }
  generateColumnMapping(data: any[], columns: string[]): { [key: string]: string } {
    const columnMapping: { [key: string]: string } = {};
  
    columns.forEach((column, index) => {
      columnMapping[column] = `property${index + 1}`;
    });
  
    data.forEach((obj) => {
      columns.forEach((column) => {
        if (obj.hasOwnProperty(column)) {
          columnMapping[column] = obj[column];
        }
      });
    });
  
    return columnMapping;
  }
}
