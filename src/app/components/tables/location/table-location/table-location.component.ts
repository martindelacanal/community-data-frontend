import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { DisclaimerEnableDisableElementComponent } from 'src/app/components/dialog/disclaimer-enable-disable-element/disclaimer-enable-disable-element.component';
import { Usuario } from 'src/app/models/login/usuario';
import { locationTable } from 'src/app/models/tables/location-table';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { TablesService } from 'src/app/services/tables/tables.service';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
  const amountPages = Math.ceil(length / pageSize);
  if (length == 0 || pageSize == 0) { return `Página 0 de ${amountPages}`; }
  length = Math.max(length, 0);
  return `Página ${page + 1} de ${amountPages}`;
}

const englishRangeLabel = (page: number, pageSize: number, length: number) => {
  const amountPages = Math.ceil(length / pageSize);
  if (length == 0 || pageSize == 0) { return `Page 0 of ${amountPages}`; }
  length = Math.max(length, 0);
  return `Page ${page + 1} of ${amountPages}`;
}

@Component({
  selector: 'app-table-location',
  templateUrl: './table-location.component.html',
  styleUrls: ['./table-location.component.scss']
})
export class TableLocationComponent implements OnInit, AfterViewInit {

  usuario: Usuario;

  dataLocationTable: locationTable;
  dataSource: any;
  columns = [' ', 'id', 'organization', 'community_city', 'partner', 'address', 'enabled', 'creation_date'];

  tabIndex = 0;
  totalItems: number = 0;
  numOfPages: number = 0;
  loading: boolean = false;
  buscar = new FormControl();
  buscarValor: string = '';
  pagina: number = 0;
  columna: string = 'id';
  ordenarTipo: string = 'desc';
  ordenCambiado: { columna: string, direccion: string };


  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private route: Router,
    private tablesService: TablesService,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private decodificadorService: DecodificadorService
  ) {
    this.columna = 'id';
    this.usuario = this.decodificadorService.getUsuario();
  }


  ngOnInit() {
    this.getDataLocationTable();

    this.buscar.valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.buscarValor = res;
          this.getDataLocationTable();
        }
      );

    this.translate.onLangChange.subscribe(
      (res) => {
        if (res.lang == 'es') {
          this.paginator._intl.itemsPerPageLabel = 'Items por página:';
          this.paginator._intl.nextPageLabel = 'Siguiente';
          this.paginator._intl.previousPageLabel = 'Anterior';
          this.paginator._intl.firstPageLabel = 'Primera página';
          this.paginator._intl.lastPageLabel = 'Última página';
          this.paginator._intl.getRangeLabel = spanishRangeLabel;
        } else {
          this.paginator._intl.itemsPerPageLabel = 'Items per page:';
          this.paginator._intl.nextPageLabel = 'Next';
          this.paginator._intl.previousPageLabel = 'Previous';
          this.paginator._intl.firstPageLabel = 'First page';
          this.paginator._intl.lastPageLabel = 'Last page';
          this.paginator._intl.getRangeLabel = englishRangeLabel;
        }
      }
    )
  }

  ngAfterViewInit() {
    if (this.translate.currentLang == 'es') {
      this.paginator._intl.itemsPerPageLabel = 'Items por página:';
      this.paginator._intl.nextPageLabel = 'Siguiente';
      this.paginator._intl.previousPageLabel = 'Anterior';
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.getRangeLabel = spanishRangeLabel;
    } else {
      this.paginator._intl.itemsPerPageLabel = 'Items per page:';
      this.paginator._intl.nextPageLabel = 'Next';
      this.paginator._intl.previousPageLabel = 'Previous';
      this.paginator._intl.firstPageLabel = 'First page';
      this.paginator._intl.lastPageLabel = 'Last page';
      this.paginator._intl.getRangeLabel = englishRangeLabel;
    }
  }


  updatePage(event: PageEvent): void {
    this.pagina = event.pageIndex;
    this.getDataLocationTable();
  }

  updateOrder(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.getDataLocationTable();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  openDialogEnableDisableElement(id: string, enabled: string): void {
    const dialogRef = this.dialog.open(DisclaimerEnableDisableElementComponent, {
      width: '370px',
      data: enabled
    });

    dialogRef.afterClosed().subscribe(result => {
      let enable = 'Y';
      if (enabled === 'Y') {
        enable = 'N';
      }
      if (result.status) {
        this.tablesService.enableDisableElement(id, 'location', enable).subscribe({
          next: (res) => {
            this.openSnackBar(this.translate.instant('table_snack_enable_disable'));
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar(this.translate.instant('table_snack_enable_disable_error'));
          },
          complete: () => {
            this.getDataLocationTable();
          }
        });
      }
    });
  }

  private getDataLocationTable() {
    this.loading = true;
    this.tablesService.getDataLocationTable(this.pagina + 1, this.columna, this.ordenarTipo, this.buscarValor).subscribe({
      next: (res) => {

        this.pagina = res.page;
        this.columna = res.orderBy;
        this.ordenarTipo = res.orderType;
        this.dataLocationTable = res;

        this.numOfPages = this.dataLocationTable.numOfPages;
        this.totalItems = this.dataLocationTable.totalItems;
        this.dataSource = new MatTableDataSource(this.dataLocationTable.results);

        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('table_locations_snack_error_get'));
        this.loading = false;
      }
    })
  }

}
