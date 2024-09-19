import { Component, OnInit, ViewChild } from '@angular/core';
import { MetricsFiltersComponent } from '../../dialog/metrics-filters/metrics-filters.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexTheme, ApexDataLabels, ApexTooltip, ApexLegend, ChartComponent } from 'ng-apexcharts';
import { tap, forkJoin, finalize } from 'rxjs';
import { FilterChip } from 'src/app/models/metrics/filter-chip';
import { KindOfProductMetrics } from 'src/app/models/metrics/kindOfProduct-metrics';
import { ViewService } from 'src/app/services/view/view.service';
import { ViewWorkerTable } from 'src/app/models/view/view-worker/view-worker-table';
import { ActivatedRoute, Params } from '@angular/router';
import { GraphicLineComplete } from 'src/app/models/grafico-linea/graphic-line-complete';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { format } from 'date-fns';

export type ChartOptionsYESNO = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-view-worker',
  templateUrl: './view-worker.component.html',
  styleUrls: ['./view-worker.component.scss']
})
export class ViewWorkerComponent implements OnInit {

  @ViewChild("chartYESNO") chartYESNO: ChartComponent;

  public chartOptionsScannedQR: Partial<ChartOptionsYESNO>;

  public loadingMetrics: boolean = true;
  public loadingScannedQRMetrics: boolean = false;
  public loadingScanHistoryMetrics: boolean = false;
  public loadingWorkerTable: boolean = false;
  public viewWorkerTable: ViewWorkerTable[] = [];

  public scannedQRMetrics: KindOfProductMetrics[] = [];

  // scan history
  multi: GraphicLineComplete[] = [];
  view: [number,number] = [undefined, 300];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = false;
  autoScale: boolean = false;

  colorScheme: Color = {
    name: 'my-color-scheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#28A745']
  };

  filterForm: FormGroup;
  loadingCSV: boolean = false;

  filtersChip: FilterChip[];

  idWorker: string;

  constructor(
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.filterForm = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
      locations: [null],
    });
    this.filtersChip = [];
    this.multi = [];

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
      // // Convierte las fechas a objetos Date y luego las formatea en el formato deseado
      // if (filters.from_date) {
      //   const date = new Date(filters.from_date + 'T00:00');
      //   filters.from_date = date;
      // }
      // if (filters.to_date) {
      //   const date2 = new Date(filters.to_date + 'T00:00');
      //   filters.to_date = date2;
      // }

      this.filterForm.patchValue(filters);
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      this.idWorker = params['id'];
      if (this.idWorker) {
        this.getViewUser(this.idWorker, this.translate.currentLang);
        this.getScannedQRMetrics(this.translate.currentLang, this.filterForm.value);
        this.getScanHistoryMetrics(this.translate.currentLang, this.filterForm.value);
      }
    });
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
    this.getScannedQRMetrics(this.translate.currentLang, this.filterForm.value);
    this.getScanHistoryMetrics(this.translate.currentLang, this.filterForm.value);
  }

  private getScannedQRMetrics(language: string, filters?: any) {
    this.loadingScannedQRMetrics = true;
    this.viewService.getScannedQRWorkerMetrics(language, filters, this.idWorker).pipe(
      finalize(() => {
        this.loadingScannedQRMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      })
    ).subscribe({
      next: (res) => {
        this.scannedQRMetrics = res;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.scannedQRMetrics.length; i++) {
          total += this.scannedQRMetrics[i].total;
        }
        for (let i = 0; i < this.scannedQRMetrics.length; i++) {
          data.push(this.scannedQRMetrics[i].total);
          let percentage = 0;
          if (total > 0) {
            percentage = Number(((this.scannedQRMetrics[i].total / total) * 100).toFixed(2));
          }
          categories.push(this.scannedQRMetrics[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsScannedQR = {
          series: data,
          chart: {
            width: 480,
            type: "pie",
            toolbar: {
              show: true,
              tools: {
                download: true, // Habilitar la descarga de imágenes
              },
            },
          },
          labels: categories,
          legend: {
            position: 'bottom',
          },
          theme: {
            monochrome: {
              enabled: false,
              color: "#97c481",
            }
          },
          colors: this.generateColors(categories.length),
          // dataLabels: {
          //   style: {
          //     colors: ['#5D5D5E']
          //   }
          // },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function (val) {
                // Convertir el valor a un número y luego a una cadena con formato de miles
                return Number(val).toLocaleString('en-US');
              }
            }
          },
          responsive: [
            {
              breakpoint: 1100,
              options: {
                chart: {
                  width: 380
                },
                legend: {
                  position: "bottom"
                }
              }
            },
            {
              breakpoint: 850,
              options: {
                chart: {
                  width: 500
                },
                legend: {
                  position: "bottom"
                }
              }
            },
            {
              breakpoint: 510,
              options: {
                chart: {
                  width: 400
                },
                legend: {
                  position: "bottom"
                }
              }
            },
            {
              breakpoint: 450,
              options: {
                chart: {
                  width: 350
                },
                legend: {
                  position: "bottom"
                }
              }
            },
            {
              breakpoint: 350,
              options: {
                chart: {
                  width: 300
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  formatXAxisTick(tick: any): string {
    return format(new Date(tick), 'MM/dd/yyyy');
  }

  private getScanHistoryMetrics(language: string, filters?: any) {
    this.loadingScanHistoryMetrics = true;
    this.viewService.getScanHistoryWorkerMetrics(language, filters, this.idWorker).pipe(
      finalize(() => {
        this.loadingScanHistoryMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      })
    ).subscribe({
      next: (res) => {
        if(res.length > 0){
          this.multi = res;
        }else{
          this.multi = [];
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getViewUser(idUser: string, language: string) {
    this.loadingWorkerTable = true;
    this.viewService.getViewWorkerTable(idUser, language, this.filterForm.value).pipe(
      finalize(() => {
        this.loadingWorkerTable = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      })
    ).subscribe({
      next: (res) => {
        if (res) {
          this.viewWorkerTable = res;
        }
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_user_error'));
      }
    });
  }

  dialogDownloadCsv(): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
      width: '370px',
      data: {
        origin: 'table-worker'
      },
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
        this.filterForm.get('providers').setValue(result.data.providers);
        this.filterForm.get('product_types').setValue(result.data.product_types);

        // recuperar filter-chip del localStorage
        this.filtersChip = JSON.parse(localStorage.getItem('filters_chip'));

        // this.metricsService.getDemographicFileCSV(result.data).subscribe({
        //   next: (res) => {
        //     const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
        //     const url = window.URL.createObjectURL(blob);
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = 'demographic-metrics.csv';
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a);
        //     window.URL.revokeObjectURL(url);
        //     this.loadingCSV = false;
        //   },
        //   error: (error) => {
        //     console.log(error);
        //     this.openSnackBar(this.translate.instant('metrics_button_download_csv_error'));
        //     this.loadingCSV = false;
        //   }
        // });
      }
    });
  }

  dialogFilters(): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
      width: '370px',
      data: {
        origin: 'table-worker'
      },
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

        // recuperar filter-chip del localStorage
        this.filtersChip = JSON.parse(localStorage.getItem('filters_chip'));

        this.getScannedQRMetrics(this.translate.currentLang, result.data);
        this.getScanHistoryMetrics(this.translate.currentLang, result.data);
      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private checkLoadingMetrics() {
    if (!this.loadingScannedQRMetrics && !this.loadingScanHistoryMetrics && !this.loadingWorkerTable) {
      this.loadingMetrics = false;
    }
  }

  private adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  private generateColors(n) {
    const colors = [];
    const baseColor = '97c481';
    const maxLightColors = 2;
    const darkColorsCount = Math.max(n - maxLightColors, 0);
    const lightColorsCount = Math.min(n, maxLightColors);

    // Genera colores más oscuros
    for (let i = 0; i < darkColorsCount; i++) {
      const amount = -20 * (darkColorsCount - i);
      colors.push(this.adjustColor(baseColor, amount));
    }

    // Genera colores más claros
    for (let i = 0; i < lightColorsCount; i++) {
      const amount = 20 * (i + 1);
      colors.push(this.adjustColor(baseColor, amount));
    }

    return colors;
  }

}

