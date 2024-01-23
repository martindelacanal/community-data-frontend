import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTheme,
  ApexTooltip,
  ApexLegend
} from "ng-apexcharts";
import { KindOfProductMetrics } from 'src/app/models/metrics/kindOfProduct-metrics';
import { PoundsPerLocationMetrics } from 'src/app/models/metrics/poundsPerLocation-metrics';
import { PoundsPerProductMetrics } from 'src/app/models/metrics/poundsPerProduct-metrics';
import { ReachMetrics } from 'src/app/models/metrics/reach-metrics';
import { MetricsService } from 'src/app/services/metrics/metrics.service';
import { MetricsFiltersProductComponent } from '../../dialog/metrics-filters-product/metrics-filters-product.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

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
  selector: 'app-metrics-product',
  templateUrl: './metrics-product.component.html',
  styleUrls: ['./metrics-product.component.scss']
})
export class MetricsProductComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chartYESNO") chartYESNO: ChartComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public chartOptionsKindOfProduct: Partial<ChartOptionsYESNO>;
  public chartOptionsPoundsPerLocation: Partial<ChartOptions>;
  public chartOptionsPoundsPerProduct: Partial<ChartOptions>;

  public loadingMetrics: boolean = false;
  public loadingReachMetrics: boolean = false;
  public loadingKindOfProductMetrics: boolean = false;
  public loadingPoundsPerLocationMetrics: boolean = false;
  public loadingPoundsPerProductMetrics: boolean = false;

  public reachMetrics: ReachMetrics;
  public kindOfProductMetrics: KindOfProductMetrics[] = [];
  public poundsPerLocationMetrics: PoundsPerLocationMetrics;
  public poundsPerLocationAverage: number = 0;
  public poundsPerLocationMedian: number = 0;
  public poundsPerProductMetrics: PoundsPerProductMetrics;
  public poundsPerProductAverage: number = 0;
  public poundsPerProductMedian: number = 0;
  poundsPerProductPage: number = 0;
  poundsPerProductTotalItems: number = 0;

  filterForm: FormGroup;
  loadingCSV: boolean = false;

  constructor(
    private metricsService: MetricsService,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
      locations: [null],
      providers: [null],
      product_types: [null],
    });

    this.reachMetrics = {
      reach: 0,
      poundsDelivered: 0,
    }
  }

  ngOnInit() {
    this.getReachMetrics(this.translate.currentLang);
    this.getKindOfProductMetrics(this.translate.currentLang);
    this.getPoundsPerLocationMetrics(this.translate.currentLang);
    this.getPoundsPerProductMetrics(this.translate.currentLang);

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

  private getReachMetrics(language: string, filters?: any) {
    this.loadingReachMetrics = true;
    this.metricsService.getReachMetrics(language, filters).subscribe({
      next: (res) => {
        this.reachMetrics = res;

        this.loadingReachMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getKindOfProductMetrics(language: string, filters?: any) {
    this.loadingKindOfProductMetrics = true;
    this.metricsService.getKindOfProductMetrics(language, filters).subscribe({
      next: (res) => {
        this.kindOfProductMetrics = res;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.kindOfProductMetrics.length; i++) {
          total += this.kindOfProductMetrics[i].total;
        }
        for (let i = 0; i < this.kindOfProductMetrics.length; i++) {
          data.push(this.kindOfProductMetrics[i].total);
          const percentage = Number(((this.kindOfProductMetrics[i].total / total) * 100).toFixed(2));
          categories.push(this.kindOfProductMetrics[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsKindOfProduct = {
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
            theme: 'dark'
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

        this.loadingKindOfProductMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getPoundsPerLocationMetrics(language: string, filters?: any) {
    this.loadingPoundsPerLocationMetrics = true;
    this.metricsService.getPoundsPerLocationMetrics(language, filters).subscribe({
      next: (res) => {
        this.poundsPerLocationMetrics = res;
        this.poundsPerLocationAverage = res.average;
        this.poundsPerLocationMedian = res.median;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.poundsPerLocationMetrics.data.length; i++) {
          total += this.poundsPerLocationMetrics.data[i].total;
        }
        for (let i = 0; i < this.poundsPerLocationMetrics.data.length; i++) {
          const percentage = Number(((this.poundsPerLocationMetrics.data[i].total / total) * 100).toFixed(2));
          data.push(this.poundsPerLocationMetrics.data[i].total);
          categories.push(this.poundsPerLocationMetrics.data[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsPoundsPerLocation = {
          series: [
            {
              name: "value",
              data: data,
              color: "#97c481"
            }
          ],
          chart: {
            type: "bar",
            height: Math.max(350, 30 * categories.length), // Ajusta la altura en función del número de categorías (minimo 350px)
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toString(); // Mostrar el valor absoluto
            }
          },
          xaxis: {
            categories: categories,
            title: {
              text: this.translate.instant('metrics_product_pounds_per_location_title_x_axis'),
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#5D5D5E',
                fontFamily: 'Roboto, sans-serif',
              }
            },
          }
        };

        this.loadingPoundsPerLocationMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getPoundsPerProductMetrics(language: string, filters?: any) {
    this.loadingPoundsPerProductMetrics = true;
    this.metricsService.getPoundsPerProductMetrics(language, filters, this.poundsPerProductPage + 1).subscribe({
      next: (res) => {
        this.poundsPerProductMetrics = res;
        this.poundsPerProductAverage = res.average;
        this.poundsPerProductMedian = res.median;
        this.poundsPerProductPage = res.page;
        this.poundsPerProductTotalItems = res.totalItems;

        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.poundsPerProductMetrics.data.length; i++) {
          total += this.poundsPerProductMetrics.data[i].total;
        }
        for (let i = 0; i < this.poundsPerProductMetrics.data.length; i++) {
          const percentage = Number(((this.poundsPerProductMetrics.data[i].total / total) * 100).toFixed(2));
          data.push(this.poundsPerProductMetrics.data[i].total);
          categories.push(this.poundsPerProductMetrics.data[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsPoundsPerProduct = {
          series: [
            {
              name: "value",
              data: data,
              color: "#97c481"
            }
          ],
          chart: {
            type: "bar",
            height: Math.max(350, 30 * categories.length), // Ajusta la altura en función del número de categorías (minimo 350px)
          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toString(); // Mostrar el valor absoluto
            }
          },
          xaxis: {
            categories: categories,
            title: {
              text: this.translate.instant('metrics_product_pounds_per_location_title_x_axis'),
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#5D5D5E',
                fontFamily: 'Roboto, sans-serif',
              }
            },
          }
        };

        this.loadingPoundsPerProductMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  updatePage(event: PageEvent): void {
    this.poundsPerProductPage = event.pageIndex;
    this.getPoundsPerProductMetrics(this.translate.currentLang, this.filterForm.value);
  }

  dialogDownloadCsv(): void {
    const dialogRef = this.dialog.open(MetricsFiltersProductComponent, {
      width: '370px',
      data: this.filterForm,
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

        this.metricsService.getDemographicFileCSV(result.data).subscribe({
          next: (res) => {
            const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'demographic-metrics.csv';
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

  dialogFilters(): void {
    const dialogRef = this.dialog.open(MetricsFiltersProductComponent, {
      width: '370px',
      data: this.filterForm,
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
        this.filterForm.get('providers').setValue(result.data.providers);
        this.filterForm.get('product_types').setValue(result.data.product_types);

        this.getReachMetrics(this.translate.currentLang, result.data);
        this.getKindOfProductMetrics(this.translate.currentLang, result.data);
        this.getPoundsPerLocationMetrics(this.translate.currentLang, result.data);
        this.getPoundsPerProductMetrics(this.translate.currentLang, result.data);
      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private checkLoadingMetrics() {
    if (!this.loadingReachMetrics && !this.loadingKindOfProductMetrics && !this.loadingPoundsPerLocationMetrics) {
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
