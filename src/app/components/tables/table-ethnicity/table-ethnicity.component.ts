import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { ethnicityTable } from 'src/app/models/tables/ethnicity-table';
import { TablesService } from 'src/app/services/tables/tables.service';
import { MetricsFiltersComponent } from '../../dialog/metrics-filters/metrics-filters.component';
import { DisclaimerEnableDisableElementComponent } from '../../dialog/disclaimer-enable-disable-element/disclaimer-enable-disable-element.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-table-ethnicity',
  templateUrl: './table-ethnicity.component.html',
  styleUrls: ['./table-ethnicity.component.scss']
})
export class TableEthnicityComponent implements OnInit, AfterViewInit {

  dataEthnicityTable: ethnicityTable;
  dataSource: any;
  columns = [' ', 'id', 'name', 'enabled', 'creation_date', 'modification_date'];

  tabIndex = 0;
  totalItems: number = 0;
  numOfPages: number = 0;
  loading: boolean = false;
  loadingCSV: boolean = false;
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
    private dialog: MatDialog
  ) {
    this.columna = 'id'
  }


  ngOnInit() {
    this.getDataEthnicityTable();

    this.buscar.valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.buscarValor = res;
          this.getDataEthnicityTable();
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
    this.getDataEthnicityTable();
  }

  updateOrder(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.getDataEthnicityTable();
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
        this.tablesService.enableDisableElement(id, 'ethnicity', enable).subscribe({
          next: (res) => {
            this.openSnackBar(this.translate.instant('table_snack_enable_disable'));
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar(this.translate.instant('table_snack_enable_disable_error'));
          },
          complete: () => {
            this.getDataEthnicityTable();
          }
        });
      }
    });
  }

  dialogDownloadCsv(): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
      width: '370px',
      data: {
        origin: 'table-ethnicity'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.loadingCSV = true;

        this.tablesService.getEthnicityFileCSV(result.data).subscribe({
          next: (res) => {
            const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ethnicities-table.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.loadingCSV = false;
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar(this.translate.instant('metrics_button_download_csv_error'));
            this.loadingCSV = false;
          }
        });
      }
    });
  }

  private getDataEthnicityTable() {
    this.loading = true;
    this.tablesService.getDataEthnicityTable(this.pagina + 1, this.columna, this.ordenarTipo, this.buscarValor, this.translate.currentLang).subscribe({
      next: (res) => {

        this.pagina = res.page;
        this.columna = res.orderBy;
        this.ordenarTipo = res.orderType;
        this.dataEthnicityTable = res;

        this.numOfPages = this.dataEthnicityTable.numOfPages;
        this.totalItems = this.dataEthnicityTable.totalItems;
        this.dataSource = new MatTableDataSource(this.dataEthnicityTable.results);

        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('table_ethnicities_snack_error_get'));
        this.loading = false;
      }
    })
  }

}
