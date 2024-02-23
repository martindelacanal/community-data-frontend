import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { genderTable } from 'src/app/models/tables/gender-table';
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
  selector: 'app-table-gender',
  templateUrl: './table-gender.component.html',
  styleUrls: ['./table-gender.component.scss']
})
export class TableGenderComponent implements OnInit, AfterViewInit {

  dataGenderTable: genderTable;
  dataSource: any;
  columns = [' ', 'id', 'name', 'creation_date', 'modification_date'];

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
    private tablesService: TablesService,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    this.columna = 'id'
  }


  ngOnInit() {
    this.getDataGenderTable();

    this.buscar.valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.buscarValor = res;
          this.getDataGenderTable();
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
    this.getDataGenderTable();
  }

  updateOrder(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.getDataGenderTable();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private getDataGenderTable() {
    this.loading = true;
    this.tablesService.getDataGenderTable(this.pagina + 1, this.columna, this.ordenarTipo, this.buscarValor, this.translate.currentLang).subscribe({
      next: (res) => {

        this.pagina = res.page;
        this.columna = res.orderBy;
        this.ordenarTipo = res.orderType;
        this.dataGenderTable = res;

        this.numOfPages = this.dataGenderTable.numOfPages;
        this.totalItems = this.dataGenderTable.totalItems;
        this.dataSource = new MatTableDataSource(this.dataGenderTable.results);

        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('table_genders_snack_error_get'));
        this.loading = false;
      }
    })
  }

}
