import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AgeMetrics } from 'src/app/models/metrics/age-metrics';
import { VolunteerLocationMetrics } from 'src/app/models/metrics/volunteer-location-metrics';
import { EthnicityMetrics } from 'src/app/models/metrics/ethnicity-metrics';
import { GenderMetrics } from 'src/app/models/metrics/gender-metrics';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTheme,
  ApexTooltip,
  ApexLegend
} from "ng-apexcharts";
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterChip } from 'src/app/models/metrics/filter-chip';
import { MetricsService } from 'src/app/services/metrics/metrics.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, tap } from 'rxjs';
import { MetricsFiltersComponent } from '../../dialog/metrics-filters/metrics-filters.component';

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
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-metrics-volunteer',
  templateUrl: './metrics-volunteer.component.html',
  styleUrls: ['./metrics-volunteer.component.scss']
})
export class MetricsVolunteerComponent implements OnInit, OnDestroy {

  @ViewChild('chartYESNOGender', { static: false }) chartYESNOGender: ElementRef;
  @ViewChild('chartYESNOEthnicity', { static: false }) chartYESNOEthnicity: ElementRef;
  @ViewChild('chartLocation', { static: false }) chartLocation: ElementRef;
  @ViewChild('chartAge', { static: false }) chartAge: ElementRef;

  public chartOptionsGender: Partial<ChartOptionsYESNO>;
  public chartOptionsEthnicity: Partial<ChartOptionsYESNO>;
  public chartOptionsLocation: Partial<ChartOptions>;
  public chartOptionsAge: Partial<ChartOptions>;
  public loadingMetrics: boolean = true;
  public loadingGenderMetrics: boolean = false;
  public loadingEthnicityMetrics: boolean = false;
  public loadingLocationMetrics: boolean = false;
  public loadingAgeMetrics: boolean = false;
  public genderMetrics: GenderMetrics[] = [];
  public ethnicityMetrics: EthnicityMetrics[] = [];
  public locationMetrics: VolunteerLocationMetrics;
  public locationMetricsAverage: number = 0;
  public locationMetricsMedian: number = 0;
  public locationMetricsTotal: number = 0;
  public ageMetrics: AgeMetrics;
  public ageMetricsAverage: number = 0;
  public ageMetricsMedian: number = 0;
  filterForm: FormGroup;
  loadingCSV: boolean = false;

  filtersChip: FilterChip[];
  isFullscreen: boolean = false;

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

    this.getGenderMetrics(this.translate.currentLang, this.filterForm.value);
    this.getEthnicityMetrics(this.translate.currentLang, this.filterForm.value);
    this.getLocationMetrics(this.translate.currentLang, this.filterForm.value);
    this.getAgeMetrics(this.translate.currentLang, this.filterForm.value);

    // Agregar listener para el evento fullscreenchange
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  ngOnDestroy() {
    // Remover el listener cuando el componente se destruye
    document.removeEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  toggleFullScreen(chartElement: HTMLElement) {
    if (chartElement) {
      chartElement.style.backgroundColor = 'white';
      if (!document.fullscreenElement) {
        chartElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } else {
      console.error('chartElement is not defined');
    }
  }

  removeFilterChip(filterChip: FilterChip): void {
    this.filtersChip = this.filtersChip.filter(f => f.code !== filterChip.code);
    localStorage.setItem('filters_chip', JSON.stringify(this.filtersChip));
    // colocar en null o [] el campo de filters en localStorage
    const filters = JSON.parse(localStorage.getItem('filters'));
    if (filterChip.code === 'genders' || filterChip.code === 'ethnicities' || filterChip.code === 'workers' || filterChip.code === 'locations' || filterChip.code === 'product_types' || filterChip.code === 'providers' || filterChip.code === 'delivered_by' || filterChip.code === 'transported_by' || filterChip.code === 'stocker_upload') {
      filters[filterChip.code] = [];
    } else {
      filters[filterChip.code] = null;
    }
    localStorage.setItem('filters', JSON.stringify(filters));
    // eliminar el filtro del formulario
    this.filterForm.get(filterChip.code).setValue(null);
    this.getGenderMetrics(this.translate.currentLang, this.filterForm.value);
    this.getEthnicityMetrics(this.translate.currentLang, this.filterForm.value);
    this.getLocationMetrics(this.translate.currentLang, this.filterForm.value);
    this.getAgeMetrics(this.translate.currentLang, this.filterForm.value);
  }

  private getGenderMetrics(language: string, filters?: any) {
    this.loadingGenderMetrics = true;
    this.metricsService.getGenderVolunteerMetrics(language, filters).subscribe({
      next: (res) => {
        this.genderMetrics = res;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.genderMetrics.length; i++) {
          total += this.genderMetrics[i].total;
        }
        for (let i = 0; i < this.genderMetrics.length; i++) {
          data.push(this.genderMetrics[i].total);
          let percentage = 0;
          if (total > 0) {
            percentage = Number(((this.genderMetrics[i].total / total) * 100).toFixed(2));
          }
          categories.push(this.genderMetrics[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsGender = {
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

        this.loadingGenderMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getEthnicityMetrics(language: string, filters?: any) {
    this.loadingEthnicityMetrics = true;
    this.metricsService.getEthnicityVolunteerMetrics(language, filters).subscribe({
      next: (res) => {
        this.ethnicityMetrics = res;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.ethnicityMetrics.length; i++) {
          total += this.ethnicityMetrics[i].total;
        }
        for (let i = 0; i < this.ethnicityMetrics.length; i++) {
          data.push(this.ethnicityMetrics[i].total);
          let percentage = 0;
          if (total > 0) {
            percentage = Number(((this.ethnicityMetrics[i].total / total) * 100).toFixed(2));
          }
          categories.push(this.ethnicityMetrics[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsEthnicity = {
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

        this.loadingEthnicityMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getLocationMetrics(language: string, filters?: any) {
    this.loadingLocationMetrics = true;
    this.metricsService.getLocationVolunteerMetrics(language, filters).subscribe({
      next: (res) => {
        this.locationMetrics = res;
        this.locationMetricsAverage = res.average;
        this.locationMetricsMedian = res.median;
        this.locationMetricsTotal = res.total;

        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.locationMetrics.data.length; i++) {
          total += this.locationMetrics.data[i].total;
        }
        for (let i = 0; i < this.locationMetrics.data.length; i++) {
          let percentage = 0;
          if (total > 0) {
            percentage = Number(((this.locationMetrics.data[i].total / total) * 100).toFixed(2));
          }
          data.push(this.locationMetrics.data[i].total);
          categories.push(this.locationMetrics.data[i].name + ' (' + percentage + '%)');
        }
        this.chartOptionsLocation = {
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
              // Convertir el valor a un número y luego a una cadena con formato de miles
              return Number(val).toLocaleString('en-US');
            }
          },
          tooltip: {
            y: {
              formatter: function (val) {
                // Convertir el valor a un número y luego a una cadena con formato de miles
                return Number(val).toLocaleString('en-US');
              }
            }
          },
          xaxis: {
            categories: categories,
            title: {
              text: this.translate.instant('metrics_volunteer_location_title_x_axis'),
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#5D5D5E',
                fontFamily: 'Roboto, sans-serif',
              }
            },
            labels: {
              formatter: function (val) {
                // Convertir el valor a un número y luego a una cadena con formato de miles
                return Number(val).toLocaleString('en-US');
              }
            }
          }
        };

        this.loadingLocationMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  private getAgeMetrics(language: string, filters?: any) {
    this.loadingAgeMetrics = true;
    this.metricsService.getAgeVolunteerMetrics(language, filters).subscribe({
      next: (res) => {
        this.ageMetrics = res;
        this.ageMetricsAverage = res.average;
        this.ageMetricsMedian = res.median;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.ageMetrics.data.length; i++) {
          total += this.ageMetrics.data[i].total;
        }
        for (let i = 0; i < this.ageMetrics.data.length; i++) {
          let percentage = 0;
          if (total > 0) {
            percentage = Number(((this.ageMetrics.data[i].total / total) * 100).toFixed(2));
          }
          data.push(this.ageMetrics.data[i].total);
          categories.push(this.ageMetrics.data[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsAge = {
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
              // Convertir el valor a un número y luego a una cadena con formato de miles
              return Number(val).toLocaleString('en-US');
            }
          },
          tooltip: {
            y: {
              formatter: function (val) {
                // Convertir el valor a un número y luego a una cadena con formato de miles
                return Number(val).toLocaleString('en-US');
              }
            }
          },
          xaxis: {
            categories: categories,
            title: {
              text: this.translate.instant('metrics_volunteer_age_title_x_axis'),
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#5D5D5E',
                fontFamily: 'Roboto, sans-serif',
              }
            },
            labels: {
              formatter: function (val) {
                // Convertir el valor a un número y luego a una cadena con formato de miles
                return Number(val).toLocaleString('en-US');
              }
            }
          }
        };

        this.loadingAgeMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  // dialogDownloadCsv(): void {
  //   const dialogRef = this.dialog.open(MetricsFiltersComponent, {
  //     width: '370px',
  //     data: '',
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.status) {
  //       this.loadingCSV = true;

  //       // por problema de zona horaria local, se debe convertir la fecha a ISO 8601 (me estaba retrasando 1 dia)
  //       if (result.data.from_date) {
  //         const date = new Date(result.data.from_date + 'T00:00');
  //         this.filterForm.get('from_date').setValue(date);
  //       }
  //       if (result.data.to_date) {
  //         const date2 = new Date(result.data.to_date + 'T00:00');
  //         this.filterForm.get('to_date').setValue(date2);
  //       }

  //       // set values into filterForm
  //       this.filterForm.get('locations').setValue(result.data.locations);
  //       this.filterForm.get('genders').setValue(result.data.genders);
  //       this.filterForm.get('ethnicities').setValue(result.data.ethnicities);
  //       this.filterForm.get('min_age').setValue(result.data.min_age);
  //       this.filterForm.get('max_age').setValue(result.data.max_age);
  //       this.filterForm.get('zipcode').setValue(result.data.zipcode);

  //       // recuperar filter-chip del localStorage
  //       this.filtersChip = JSON.parse(localStorage.getItem('filters_chip'));

  //       this.metricsService.getDemographicFileCSV(result.data).subscribe({
  //         next: (res) => {
  //           const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
  //           const url = window.URL.createObjectURL(blob);
  //           const a = document.createElement('a');
  //           a.href = url;
  //           a.download = 'demographic-metrics.csv';
  //           document.body.appendChild(a);
  //           a.click();
  //           document.body.removeChild(a);
  //           window.URL.revokeObjectURL(url);
  //           this.loadingCSV = false;
  //         },
  //         error: (error) => {
  //           console.log(error);
  //           this.openSnackBar(this.translate.instant('metrics_button_download_csv_error'));
  //           this.loadingCSV = false;
  //         }
  //       });

  //       // Recargar los graficos con los filtros aplicados
  //       this.getGenderMetrics(this.translate.currentLang, this.filterForm.value);
  //       this.getEthnicityMetrics(this.translate.currentLang, this.filterForm.value);
  //       this.getLocationMetrics(this.translate.currentLang, this.filterForm.value);
  //       this.getAgeMetrics(this.translate.currentLang, this.filterForm.value);
  //     }
  //   });
  // }

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

        this.getGenderMetrics(this.translate.currentLang, result.data);
        this.getEthnicityMetrics(this.translate.currentLang, result.data);
        this.getLocationMetrics(this.translate.currentLang, result.data);
        this.getAgeMetrics(this.translate.currentLang, result.data);
      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private checkLoadingMetrics() {
    if (!this.loadingGenderMetrics && !this.loadingEthnicityMetrics && !this.loadingLocationMetrics && !this.loadingAgeMetrics) {
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
