import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, ApexResponsive, ApexTheme, ApexTooltip, ChartComponent } from 'ng-apexcharts';
import { MetricsService } from 'src/app/services/metrics/metrics.service';
import { MetricsFiltersComponent } from '../../dialog/metrics-filters/metrics-filters.component';
import { EmailMetrics } from 'src/app/models/metrics/email-metrics';
import { PhoneMetrics } from 'src/app/models/metrics/phone-metrics';
import { RegisterMetrics } from 'src/app/models/metrics/register-metrics';
import { FilterChip } from 'src/app/models/metrics/filter-chip';
import { forkJoin, tap } from 'rxjs';

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
  selector: 'app-metrics-participant',
  templateUrl: './metrics-participant.component.html',
  styleUrls: ['./metrics-participant.component.scss']
})
export class MetricsParticipantComponent implements OnInit {

  @ViewChild("chartYESNO") chartYESNO: ChartComponent;
  public chartOptionsEmail: Partial<ChartOptionsYESNO>;
  public chartOptionsPhone: Partial<ChartOptionsYESNO>;

  public loadingMetrics: boolean = true;
  public loadingRegisterMetrics: boolean = false;
  public loadingEmailMetrics: boolean = false;
  public loadingPhoneMetrics: boolean = false;

  public emailMetrics: EmailMetrics[] = [];
  public phoneMetrics: PhoneMetrics[] = [];
  public registerMetrics: RegisterMetrics;

  filterForm: FormGroup;
  loadingCSV: boolean = false;

  filtersChip: FilterChip[];

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

    this.registerMetrics = {
      total: 0,
      new: 0,
      recurring: 0,
    }
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

    this.getRegisterMetrics(this.translate.currentLang, this.filterForm.value);
    this.getEmailMetrics(this.translate.currentLang, this.filterForm.value);
    this.getPhoneMetrics(this.translate.currentLang, this.filterForm.value);
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
    this.getRegisterMetrics(this.translate.currentLang, this.filterForm.value);
    this.getEmailMetrics(this.translate.currentLang, this.filterForm.value);
    this.getPhoneMetrics(this.translate.currentLang, this.filterForm.value);
  }

  private getRegisterMetrics(language: string, filters?: any) {
    this.loadingRegisterMetrics = true;
    this.metricsService.getRegisterMetrics(language, filters).subscribe({
      next: (res) => {
        this.registerMetrics = res;

        this.loadingRegisterMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getEmailMetrics(language: string, filters?: any) {
    this.loadingEmailMetrics = true;
    this.metricsService.getEmailMetrics(language, filters).subscribe({
      next: (res) => {
        this.emailMetrics = res;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.emailMetrics.length; i++) {
          total += this.emailMetrics[i].total;
        }
        for (let i = 0; i < this.emailMetrics.length; i++) {
          data.push(this.emailMetrics[i].total);
          const percentage = Number(((this.emailMetrics[i].total / total) * 100).toFixed(2));
          categories.push(this.emailMetrics[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsEmail = {
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

        this.loadingEmailMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getPhoneMetrics(language: string, filters?: any) {
    this.loadingPhoneMetrics = true;
    this.metricsService.getPhoneMetrics(language, filters).subscribe({
      next: (res) => {
        this.phoneMetrics = res;
        const data = [];
        const categories = [];
        let total = 0;
        for (let i = 0; i < this.phoneMetrics.length; i++) {
          total += this.phoneMetrics[i].total;
        }
        for (let i = 0; i < this.phoneMetrics.length; i++) {
          data.push(this.phoneMetrics[i].total);
          const percentage = Number(((this.phoneMetrics[i].total / total) * 100).toFixed(2));
          categories.push(this.phoneMetrics[i].name + ' (' + percentage + '%)');
        }

        this.chartOptionsPhone = {
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

        this.loadingPhoneMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
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

        this.getRegisterMetrics(this.translate.currentLang, result.data);
        this.getEmailMetrics(this.translate.currentLang, result.data);
        this.getPhoneMetrics(this.translate.currentLang, result.data);

      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private checkLoadingMetrics() {
    if (!this.loadingRegisterMetrics && !this.loadingEmailMetrics && !this.loadingPhoneMetrics) {
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
