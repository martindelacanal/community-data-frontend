import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { notificationTable } from 'src/app/models/tables/notification-table';
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
  selector: 'app-table-notification',
  templateUrl: './table-notification.component.html',
  styleUrls: ['./table-notification.component.scss']
})
export class TableNotificationComponent implements OnInit, AfterViewInit {

  dataNotificationTable: notificationTable;
  dataSource: any;
  columns = [' ', 'id', 'user_id', 'user_name', 'message', 'creation_date'];

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
  ) {
    this.columna = 'id'
  }


  ngOnInit() {
    this.getDataNotificationTable();

    this.buscar.valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.buscarValor = res;
          this.getDataNotificationTable();
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
    this.getDataNotificationTable();
  }

  updateOrder(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.getDataNotificationTable();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private getDataNotificationTable() {
    this.loading = true;
    this.tablesService.getDataNotificationTable(this.pagina + 1, this.columna, this.ordenarTipo, this.buscarValor).subscribe({
      next: (res) => {

        this.pagina = res.page;
        this.columna = res.orderBy;
        this.ordenarTipo = res.orderType;
        this.dataNotificationTable = res;

        this.numOfPages = this.dataNotificationTable.numOfPages;
        this.totalItems = this.dataNotificationTable.totalItems;
        this.dataSource = new MatTableDataSource(this.dataNotificationTable.results);

        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('table_notifications_snack_error_get'));
        this.loading = false;
      }
    })
  }

}
