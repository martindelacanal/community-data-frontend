import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTheme,
  ApexTooltip
} from "ng-apexcharts";
import { QuestionMetrics } from "src/app/models/metrics/question-metrics";
import { MetricsService } from "src/app/services/metrics/metrics.service";
import { MatDialog } from "@angular/material/dialog";
import { MetricsFiltersComponent } from "../../dialog/metrics-filters/metrics-filters.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FilterChip } from "src/app/models/metrics/filter-chip";
import { forkJoin, tap } from "rxjs";
import { Usuario } from "src/app/models/login/usuario";
import { DecodificadorService } from "src/app/services/login/decodificador.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
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
};

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  public chartOptions: Partial<ChartOptions>[];
  public chartOptionsYESNO: Partial<ChartOptionsYESNO>[];
  public loadingQuestions: boolean = false;
  public questionsMetrics: QuestionMetrics[] = [];
  filterForm: FormGroup;
  loadingCSV: boolean = false;

  usuario: Usuario;

  filtersChip: FilterChip[];

  constructor(
    private decodificadorService: DecodificadorService,
    private metricsService: MetricsService,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
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

    this.getQuestions(this.translate.currentLang, this.filterForm.value);
  }

  /**
   * Método para alternar el modo fullscreen de un gráfico.
   * @param type Tipo de gráfico ('main' o 'yesno').
   * @param index Índice del gráfico en el array.
   */
  toggleFullScreen(type: 'main' | 'yesno', index: number) {
    const elementId = type === 'main' ? `chart-container-main-${index}` : `chart-container-yesno-${index}`;
    const chartContainer = document.getElementById(elementId);

    if (chartContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        chartContainer.style.backgroundColor = 'white'; // Asegura que el fondo sea blanco
        chartContainer.requestFullscreen?.().catch(err => {
          console.error(`Error al intentar habilitar el modo fullscreen: ${err.message} (${err.name})`);
        });
      }
    } else {
      console.error(`Elemento con ID ${elementId} no encontrado.`);
    }
  }


  removeFilterChip(filterChip: FilterChip): void {
    this.filtersChip = this.filtersChip.filter(f => f.code !== filterChip.code);
    localStorage.setItem('filters_chip', JSON.stringify(this.filtersChip));
    // Colocar en null o [] el campo de filters en localStorage
    const filters = JSON.parse(localStorage.getItem('filters'));
    if (
      filterChip.code === 'genders' ||
      filterChip.code === 'ethnicities' ||
      filterChip.code === 'workers' ||
      filterChip.code === 'locations' ||
      filterChip.code === 'product_types' ||
      filterChip.code === 'providers'
    ) {
      filters[filterChip.code] = [];
    } else {
      filters[filterChip.code] = null;
    }
    localStorage.setItem('filters', JSON.stringify(filters));
    // Eliminar el filtro del formulario
    this.filterForm.get(filterChip.code).setValue(null);
    this.getQuestions(this.translate.currentLang, this.filterForm.value);
  }

  private getQuestions(language: string, filters?: any) {
    this.loadingQuestions = true;
    this.metricsService.getQuestions(language, filters).subscribe({
      next: (res) => {
        this.questionsMetrics = res;
        this.chartOptions = new Array(this.questionsMetrics.length).fill(null);
        this.chartOptionsYESNO = new Array(this.questionsMetrics.length).fill(null);
        for (let i = 0; i < this.questionsMetrics.length; i++) {
          const question = this.questionsMetrics[i];
          const data = [];
          const categories = [];
          const categories_aux = [];
          let total = 0;
          for (let j = 0; j < question.answers.length; j++) {
            const answer = question.answers[j];
            data.push(answer.total);
            total += answer.total;
            categories_aux.push(answer.answer);
          }
          for (let j = 0; j < question.answers.length; j++) {
            const answer = question.answers[j];
            let percentage = 0;
            if (
              (categories_aux.includes('Yes') && categories_aux.includes('No')) ||
              (categories_aux.includes('Sí') && categories_aux.includes('No')) ||
              (categories_aux.includes('Si') && categories_aux.includes('No'))
            ) {
              if (total > 0) {
                percentage = Number(((answer.total / total) * 100).toFixed(2));
              }
              categories.push(answer.answer + ' (' + percentage + '%)');
            } else {
              if (total > 0) {
                percentage = Number(((answer.total / total) * 100).toFixed(2));
              }
              categories.push('(' + percentage + '%) ' + answer.answer);
            }
          }

          if (
            (categories_aux.includes('Yes') && categories_aux.includes('No')) ||
            (categories_aux.includes('Sí') && categories_aux.includes('No')) ||
            (categories_aux.includes('Si') && categories_aux.includes('No'))
          ) {
            this.chartOptionsYESNO[i] = {
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
              theme: {
                monochrome: {
                  enabled: true,
                  color: "#97c481",
                }
              },
              tooltip: {
                theme: 'dark',
                y: {
                  formatter: function (val) {
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
          } else {
            this.chartOptions[i] = {
              series: [
                {
                  name: "value",
                  data: data,
                  color: "#97c481"
                }
              ],
              chart: {
                type: "bar",
                height: Math.max(350, 30 * categories.length), // Ajusta la altura en función del número de categorías (mínimo 350px)
              },
              plotOptions: {
                bar: {
                  horizontal: true
                }
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return Number(val).toLocaleString('en-US');
                }
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return Number(val).toLocaleString('en-US');
                  }
                }
              },
              xaxis: {
                categories: categories,
                title: {
                  text: this.translate.instant('metrics_health_title_barchart_x_axis'),
                  style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#5D5D5E',
                    fontFamily: 'Roboto, sans-serif',
                  }
                },
                labels: {
                  formatter: function (val) {
                    return Number(val).toLocaleString('en-US');
                  }
                }
              }
            };
          }
        }
        this.loadingQuestions = false;
      },
      error: (error) => {
        console.error(error);
        this.loadingQuestions = false;
      }
    });
  }

  dialogDownloadCsv(): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
      width: '370px',
      data: {
        origin: 'metrics-health'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.loadingCSV = true;

        // Convertir fechas a ISO 8601
        if (result.data.from_date) {
          const date = new Date(result.data.from_date + 'T00:00');
          result.data.from_date = date;
          this.filterForm.get('from_date').setValue(date);
        }
        if (result.data.to_date) {
          const date2 = new Date(result.data.to_date + 'T00:00');
          result.data.to_date = date2;
          this.filterForm.get('to_date').setValue(date2);
        }

        // Set values into filterForm
        this.filterForm.get('locations').setValue(result.data.locations);
        this.filterForm.get('genders').setValue(result.data.genders);
        this.filterForm.get('ethnicities').setValue(result.data.ethnicities);
        this.filterForm.get('min_age').setValue(result.data.min_age);
        this.filterForm.get('max_age').setValue(result.data.max_age);
        this.filterForm.get('zipcode').setValue(result.data.zipcode);

        // Recuperar filter-chip del localStorage
        this.filtersChip = JSON.parse(localStorage.getItem('filters_chip'));

        this.metricsService.getHealthFileCSV(result.data).subscribe({
          next: (res) => {
            const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'health-metrics.csv';
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

        // Recargar los gráficos con los filtros aplicados
        this.getQuestions(this.translate.currentLang, result.data);
      }
    });
  }

  dialogFilters(): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
      width: '370px',
      data: {
        origin: 'metrics-health'
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        // Convertir fechas a ISO 8601
        if (result.data.from_date) {
          const date = new Date(result.data.from_date + 'T00:00');
          result.data.from_date = date;
          this.filterForm.get('from_date').setValue(date);
        }
        if (result.data.to_date) {
          const date2 = new Date(result.data.to_date + 'T00:00');
          result.data.to_date = date2;
          this.filterForm.get('to_date').setValue(date2);
        }

        // Set values into filterForm
        this.filterForm.get('locations').setValue(result.data.locations);
        this.filterForm.get('genders').setValue(result.data.genders);
        this.filterForm.get('ethnicities').setValue(result.data.ethnicities);
        this.filterForm.get('min_age').setValue(result.data.min_age);
        this.filterForm.get('max_age').setValue(result.data.max_age);
        this.filterForm.get('zipcode').setValue(result.data.zipcode);

        // Recuperar filter-chip del localStorage
        this.filtersChip = JSON.parse(localStorage.getItem('filters_chip'));

        this.getQuestions(this.translate.currentLang, result.data);
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

}
