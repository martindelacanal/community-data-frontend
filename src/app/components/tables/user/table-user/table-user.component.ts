import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { DisclaimerEnableDisableElementComponent } from 'src/app/components/dialog/disclaimer-enable-disable-element/disclaimer-enable-disable-element.component';
import { DisclaimerResetPasswordComponent } from 'src/app/components/dialog/disclaimer-reset-password/disclaimer-reset-password/disclaimer-reset-password.component';
import { userTable } from 'src/app/models/tables/user-table';
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
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss']
})

export class TableUserComponent implements OnInit, AfterViewInit {

  dataUserTable: userTable;
  dataSource: any;
  columns = [' ', 'id', 'username', 'email', 'firstname', 'lastname', 'role', 'enabled', 'creation_date'];

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
  tableRole: string = 'all';


  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private tablesService: TablesService,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.columna = 'id'
  }

  ngOnInit() {


    this.activatedRoute.params.subscribe((params: Params) => {
      const search = params['search'];
      if (search) {
        // this.buscar.setValue(search);
        this.tableRole = search;
      }
      this.getDataUserTable();
    });

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

    this.buscar.valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.buscarValor = res;
          this.getDataUserTable();
        }
      );

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
    this.getDataUserTable();
  }

  updateOrder(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.getDataUserTable();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  openDialogResetPassword(id: string): void {
    const dialogRef = this.dialog.open(DisclaimerResetPasswordComponent, {
      width: '370px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.status) {
        this.tablesService.resetPassword(id).subscribe(
          (res) => {
            this.openSnackBar(this.translate.instant('login_snack_your_new_password') + res.password);
          }
        );
      }
    });
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
        this.tablesService.enableDisableElement(id, 'user', enable).subscribe({
          next: (res) => {
            this.openSnackBar(this.translate.instant('table_snack_enable_disable'));
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar(this.translate.instant('table_snack_enable_disable_error'));
          },
          complete: () => {
            this.getDataUserTable();
          }
        });
      }
    });
  }

  private getDataUserTable() {
    this.loading = true;
    this.tablesService.getDataUserTable(this.pagina + 1, this.columna, this.ordenarTipo, this.buscarValor, this.tableRole).subscribe({
      next: (res) => {

        this.pagina = res.page;
        this.columna = res.orderBy;
        this.ordenarTipo = res.orderType;
        this.dataUserTable = res;

        this.numOfPages = this.dataUserTable.numOfPages;
        this.totalItems = this.dataUserTable.totalItems;
        this.dataSource = new MatTableDataSource(this.dataUserTable.results);

        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('table_users_snack_error_get'));
        this.loading = false;
      }
    })
  }

}
