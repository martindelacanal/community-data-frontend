import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { DownloadDeliveredCsvComponent } from 'src/app/components/dialog/download-delivered-csv/download-delivered-csv/download-delivered-csv.component';
import { SelectionDeliveredCsvComponent } from 'src/app/components/dialog/selection-delivered-csv/selection-delivered-csv/selection-delivered-csv.component';
import { Usuario } from 'src/app/models/login/usuario';
import { deliveredTable } from 'src/app/models/tables/delivered-table';
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
  selector: 'app-table-delivered',
  templateUrl: './table-delivered.component.html',
  styleUrls: ['./table-delivered.component.scss']
})
export class TableDeliveredComponent {

  usuario: Usuario;

  dataDeliveredTable: deliveredTable;
  dataSource: any;
  columns = [' ', 'id', 'delivering_user_id', 'delivery_username', 'receiving_user_id', 'beneficiary_username', 'location_id', 'community_city', 'approved', 'creation_date'];

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private decodificadorService: DecodificadorService
  ) {
    this.columna = 'id';
    this.usuario = this.decodificadorService.getUsuario();
  }


  ngOnInit() {
    this.getDataDeliveredTable();

    this.buscar.valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.buscarValor = res;
          this.getDataDeliveredTable();
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
    this.getDataDeliveredTable();
  }

  updateOrder(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.getDataDeliveredTable();
  }

  dialogDownloadCsv(): void {
    const dialogRefSeleccionDelivered = this.dialog.open(SelectionDeliveredCsvComponent, {
      width: '370px',
      data: '',
      disableClose: true
    });

    dialogRefSeleccionDelivered.afterClosed().subscribe(resultSelection => {
      if (resultSelection && resultSelection.option) {

        const dialogRef = this.dialog.open(DownloadDeliveredCsvComponent, {
          width: '370px',
          data: '',
          disableClose: true
        });


        dialogRef.afterClosed().subscribe(result => {
          if (result && result.status) {
            this.loadingCSV = true;
            switch (resultSelection.option) {
              case 1: // Beneficiary summary
                this.tablesService.getDeliveredBeneficiarySummaryFileCSV(result.date.from_date, result.date.to_date).subscribe({
                  next: (res) => {
                    const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'beneficiary-summary.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    this.loadingCSV = false;
                  },
                  error: (error) => {
                    console.log(error);
                    this.openSnackBar(this.translate.instant('table_delivered_button_download_csv_error'));
                    this.loadingCSV = false;
                  }
                });
                break;
              case 2: // Delivery summary
                this.tablesService.getDeliveredFileCSV(result.date.from_date, result.date.to_date).subscribe({
                  next: (res) => {
                    const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'delivery-summary.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    this.loadingCSV = false;
                  },
                  error: (error) => {
                    console.log(error);
                    this.openSnackBar(this.translate.instant('table_delivered_button_download_csv_error'));
                    this.loadingCSV = false;
                  }
                });
                break;
            }
          }
        });
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private getDataDeliveredTable() {
    this.loading = true;
    this.tablesService.getDataDeliveredTable(this.pagina + 1, this.columna, this.ordenarTipo, this.buscarValor).subscribe({
      next: (res) => {

        this.pagina = res.page;
        this.columna = res.orderBy;
        this.ordenarTipo = res.orderType;
        this.dataDeliveredTable = res;

        this.numOfPages = this.dataDeliveredTable.numOfPages;
        this.totalItems = this.dataDeliveredTable.totalItems;
        this.dataSource = new MatTableDataSource(this.dataDeliveredTable.results);

        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('table_delivered_snack_error_get'));
        this.loading = false;
      }
    })
  }

}
