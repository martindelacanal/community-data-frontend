import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, forkJoin, tap } from 'rxjs';
import { DisclaimerEnableDisableElementComponent } from 'src/app/components/dialog/disclaimer-enable-disable-element/disclaimer-enable-disable-element.component';
import { DisclaimerResetPasswordComponent } from 'src/app/components/dialog/disclaimer-reset-password/disclaimer-reset-password/disclaimer-reset-password.component';
import { MetricsFiltersComponent } from 'src/app/components/dialog/metrics-filters/metrics-filters.component';
import { Usuario } from 'src/app/models/login/usuario';
import { FilterChip } from 'src/app/models/metrics/filter-chip';
import { userTable } from 'src/app/models/tables/user-table';
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
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss']
})

export class TableUserComponent implements OnInit, AfterViewInit {

  usuario: Usuario;

  dataUserTable: userTable;
  dataSource: any;
  columns = [' ', 'id', 'username', 'email', 'firstname', 'lastname', 'role', 'enabled', 'creation_date'];

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
  tableRole: string = 'all';

  filterForm: FormGroup;
  filtersChip: FilterChip[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private tablesService: TablesService,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private decodificadorService: DecodificadorService,
    private formBuilder: FormBuilder
  ) {
    this.columna = 'id';
    this.usuario = this.decodificadorService.getUsuario();
    this.filterForm = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
      locations: [null],
      genders: [null],
      ethnicities: [null],
      min_age: [null],
      max_age: [null],
      zipcode: [null]
    });
    this.filtersChip = [];
  }

  ngOnInit() {
    // Intenta recuperar el valor de 'filters' del localStorage
    const filters = JSON.parse(localStorage.getItem('filters'));
    const filters_chip = JSON.parse(localStorage.getItem('filters_chip'));

    // Si existe, corregir el idioma en el campo name del array filters_chip
    if (filters_chip) {
      this.filtersChip = filters_chip;
      const translateRequests = this.filtersChip.map((element) => {
        return this.translate.get('metrics_filters_input_' + element.code).pipe(
          tap((translatedValue) => {
            element.name = translatedValue;
          })
        );
      });

      forkJoin(translateRequests).subscribe(() => {
        // guardar en el localStorage
        localStorage.setItem('filters_chip', JSON.stringify(this.filtersChip));
      });
    }

    // Si existe, asigna el valor al formulario
    if (filters) {
      // Convierte las fechas a objetos Date y luego las formatea en el formato deseado
      if (filters.from_date) {
        const date = new Date(filters.from_date + 'T00:00');
        filters.from_date = date;
      }
      if (filters.to_date) {
        const date2 = new Date(filters.to_date + 'T00:00');
        filters.to_date = date2;
      }

      this.filterForm.patchValue(filters);
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      const search = params['search'];
      if (search) {
        // this.buscar.setValue(search);
        if (this.decodificadorService.getRol() == 'client') {
          // si es client solo puede ver client y beneficiary, sino mandarlo al home
          if (search != 'client' && search != 'beneficiary') {
            this.route.navigate(['/home']);
          }
        }
        this.tableRole = search;
      }
      this.getDataUserTable(this.filterForm.value);
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
          this.getDataUserTable(this.filterForm.value);
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

  removeFilterChip(filterChip: FilterChip): void {
    this.filtersChip = this.filtersChip.filter(f => f.code !== filterChip.code);
    localStorage.setItem('filters_chip', JSON.stringify(this.filtersChip));
    // colocar en null o [] el campo de filters en localStorage
    const filters = JSON.parse(localStorage.getItem('filters'));
    if (filterChip.code === 'genders' || filterChip.code === 'ethnicities' || filterChip.code === 'locations' || filterChip.code === 'product_types' || filterChip.code === 'providers') {
      filters[filterChip.code] = [];
    } else {
      filters[filterChip.code] = null;
    }
    localStorage.setItem('filters', JSON.stringify(filters));
    // eliminar el filtro del formulario
    this.filterForm.get(filterChip.code).setValue(null);
    this.getDataUserTable(this.filterForm.value);
  }

  updatePage(event: PageEvent): void {
    this.pagina = event.pageIndex;
    this.getDataUserTable(this.filterForm.value);
  }

  updateOrder(columna: string): void {
    let direccion = 'asc';
    if (this.columna === columna) {
      direccion = this.ordenarTipo === 'asc' ? 'desc' : 'asc';
    }
    this.columna = columna;
    this.ordenarTipo = direccion;
    this.getDataUserTable(this.filterForm.value);
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
            this.getDataUserTable(this.filterForm.value);
          }
        });
      }
    });
  }

  dialogFilters(): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
      width: '370px',
      data: '',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        // por problema de zona horaria local, se debe convertir la fecha a ISO 8601 (me estaba retrasando 1 dia)
        if (result.data.from_date) {
          const date = new Date(result.data.from_date + 'T00:00');
          this.filterForm.get('from_date').setValue(date);
        }
        if (result.data.to_date) {
          const date2 = new Date(result.data.to_date + 'T00:00');
          this.filterForm.get('to_date').setValue(date2);
        }

        // set values into filterForm
        this.filterForm.get('locations').setValue(result.data.locations);
        this.filterForm.get('genders').setValue(result.data.genders);
        this.filterForm.get('ethnicities').setValue(result.data.ethnicities);
        this.filterForm.get('min_age').setValue(result.data.min_age);
        this.filterForm.get('max_age').setValue(result.data.max_age);
        this.filterForm.get('zipcode').setValue(result.data.zipcode);

        // recuperar filter-chip del localStorage
        this.filtersChip = JSON.parse(localStorage.getItem('filters_chip'));

        this.getDataUserTable(this.filterForm.value);
      }
    });
  }

  dialogDownloadCsv(role: string): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
      width: '370px',
      data: '',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.loadingCSV = true;

        // por problema de zona horaria local, se debe convertir la fecha a ISO 8601 (me estaba retrasando 1 dia)
        if (result.data.from_date) {
          const date = new Date(result.data.from_date + 'T00:00');
          this.filterForm.get('from_date').setValue(date);
        }
        if (result.data.to_date) {
          const date2 = new Date(result.data.to_date + 'T00:00');
          this.filterForm.get('to_date').setValue(date2);
        }

        // set values into filterForm
        this.filterForm.get('locations').setValue(result.data.locations);
        this.filterForm.get('genders').setValue(result.data.genders);
        this.filterForm.get('ethnicities').setValue(result.data.ethnicities);
        this.filterForm.get('min_age').setValue(result.data.min_age);
        this.filterForm.get('max_age').setValue(result.data.max_age);
        this.filterForm.get('zipcode').setValue(result.data.zipcode);

        // recuperar filter-chip del localStorage
        this.filtersChip = JSON.parse(localStorage.getItem('filters_chip'));

        switch (role) {
          case 'all': this.downloadAllCSV(result);
            break;
          case 'client': this.downloadClientUserCSV(result);
            break;
          case 'beneficiary': this.downloadBeneficiaryCSV(result);
            break;
        }

        this.getDataUserTable(this.filterForm.value);
      }
    });
  }

  private downloadAllCSV(result: any) {

    this.tablesService.getSystemUserFileCSV(result.data).subscribe({
      next: (res) => {
        const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'system-users-table.csv';
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

  private downloadClientUserCSV(result: any) {

    this.tablesService.getClientUserFileCSV(result.data).subscribe({
      next: (res) => {
        const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'client-users-table.csv';
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

  private downloadBeneficiaryCSV(result: any) {

    this.tablesService.getParticipantFileCSV(result.data).subscribe({
      next: (res) => {
        const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'participants-table.csv';
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

  private getDataUserTable(filters?: any) {
    this.loading = true;
    this.tablesService.getDataUserTable(this.pagina + 1, this.columna, this.ordenarTipo, this.buscarValor, this.tableRole, filters).subscribe({
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
