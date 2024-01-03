import { Component, ViewChild } from '@angular/core';
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
import { AgeMetrics } from 'src/app/models/metrics/age-metrics';
import { EthnicityMetrics } from 'src/app/models/metrics/ethnicity-metrics';
import { GenderMetrics } from 'src/app/models/metrics/gender-metrics';
import { HouseholdMetrics } from 'src/app/models/metrics/household-metrics';
import { MetricsService } from 'src/app/services/metrics/metrics.service';
import { MetricsFiltersComponent } from '../../dialog/metrics-filters/metrics-filters.component';

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

@Component({
  selector: 'app-metrics-demographic',
  templateUrl: './metrics-demographic.component.html',
  styleUrls: ['./metrics-demographic.component.scss']
})
export class MetricsDemographicComponent {

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chartYESNO") chartYESNO: ChartComponent;
  public chartOptionsGender: Partial<ChartOptionsYESNO>;
  public chartOptionsEthnicity: Partial<ChartOptionsYESNO>;
  public chartOptionsHousehold: Partial<ChartOptions>;
  public chartOptionsAge: Partial<ChartOptions>;
  public loadingMetrics: boolean = false;
  public loadingGenderMetrics: boolean = false;
  public loadingEthnicityMetrics: boolean = false;
  public loadingHouseholdMetrics: boolean = false;
  public loadingAgeMetrics: boolean = false;
  public genderMetrics: GenderMetrics[] = [];
  public ethnicityMetrics: EthnicityMetrics[] = [];
  public householdMetrics: HouseholdMetrics;
  public householdMetricsAverage: number = 0;
  public householdMetricsMedian: number = 0;
  public ageMetrics: AgeMetrics;
  public ageMetricsAverage: number = 0;
  public ageMetricsMedian: number = 0;
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
      genders: [null],
      ethnicities: [null],
      min_age: [null],
      max_age: [null],
      zipcode: [null]
    });

  }

  ngOnInit() {
    this.getGenderMetrics(this.translate.currentLang);
    this.getEthnicityMetrics(this.translate.currentLang);
    this.getHouseholdMetrics(this.translate.currentLang);
    this.getAgeMetrics(this.translate.currentLang);
  }

  private getGenderMetrics(language: string, filters?: any) {
    this.loadingGenderMetrics = true;
    this.metricsService.getGenderMetrics(language, filters).subscribe({
      next: (res) => {
        this.genderMetrics = res;
        const data = [];
        const categories = [];
        for (let i = 0; i < this.genderMetrics.length; i++) {
          data.push(this.genderMetrics[i].total);
          categories.push(this.genderMetrics[i].name);
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
    this.metricsService.getEthnicityMetrics(language, filters).subscribe({
      next: (res) => {
        this.ethnicityMetrics = res;
        const data = [];
        const categories = [];
        for (let i = 0; i < this.ethnicityMetrics.length; i++) {
          data.push(this.ethnicityMetrics[i].total);
          categories.push(this.ethnicityMetrics[i].name);
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

        this.loadingEthnicityMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getHouseholdMetrics(language: string, filters?: any) {
    this.loadingHouseholdMetrics = true;
    this.metricsService.getHouseholdMetrics(language, filters).subscribe({
      next: (res) => {
        this.householdMetrics = res;
        this.householdMetricsAverage = res.average;
        this.householdMetricsMedian = res.median;
        const data = [];
        const categories = [];
        for (let i = 0; i < this.householdMetrics.data.length; i++) {
          data.push(this.householdMetrics.data[i].total);
          categories.push(this.householdMetrics.data[i].name);
        }

        this.chartOptionsHousehold = {
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
            enabled: true
          },
          xaxis: {
            categories: categories,
            // tickAmount: Math.max(...data), // problema de muchos numeros en el eje X
            labels: {
              formatter: function (val) {
                return parseInt(val).toString();
              }
            }
          }
        };

        this.loadingHouseholdMetrics = false;
        this.checkLoadingMetrics(); // si ya cargaron todos los datos, se oculta el spinner
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getAgeMetrics(language: string, filters?: any) {
    this.loadingAgeMetrics = true;
    this.metricsService.getAgeMetrics(language, filters).subscribe({
      next: (res) => {
        this.ageMetrics = res;
        this.ageMetricsAverage = res.average;
        this.ageMetricsMedian = res.median;
        const data = [];
        const categories = [];
        for (let i = 0; i < this.ageMetrics.data.length; i++) {
          data.push(this.ageMetrics.data[i].total);
          categories.push(this.ageMetrics.data[i].name);
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
            enabled: true
          },
          xaxis: {
            categories: categories,
            // tickAmount: Math.max(...data), // problema de muchos numeros en el eje X
            labels: {
              formatter: function (val) {
                return parseInt(val).toString();
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

  dialogDownloadCsv(): void {
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
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
        this.filterForm.get('genders').setValue(result.data.genders);
        this.filterForm.get('ethnicities').setValue(result.data.ethnicities);
        this.filterForm.get('min_age').setValue(result.data.min_age);
        this.filterForm.get('max_age').setValue(result.data.max_age);
        this.filterForm.get('zipcode').setValue(result.data.zipcode);

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
    const dialogRef = this.dialog.open(MetricsFiltersComponent, {
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
        this.filterForm.get('genders').setValue(result.data.genders);
        this.filterForm.get('ethnicities').setValue(result.data.ethnicities);
        this.filterForm.get('min_age').setValue(result.data.min_age);
        this.filterForm.get('max_age').setValue(result.data.max_age);
        this.filterForm.get('zipcode').setValue(result.data.zipcode);

        this.getGenderMetrics(this.translate.currentLang, result.data);
        this.getEthnicityMetrics(this.translate.currentLang, result.data);
        this.getHouseholdMetrics(this.translate.currentLang, result.data);
        this.getAgeMetrics(this.translate.currentLang, result.data);

      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private checkLoadingMetrics() {
    if (!this.loadingGenderMetrics && !this.loadingEthnicityMetrics && !this.loadingHouseholdMetrics && !this.loadingAgeMetrics) {
      this.loadingMetrics = false;
    }
  }

  private adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  private generateColors(n) {
    const colors = [];
    const baseColor = '97c481';
    const half = Math.floor(n / 2);
    for (let i = 0; i < n; i++) {
      // Genera colores más oscuros para la primera mitad
      if (i < half) {
        const amount = -20 * (half - i);
        colors.push(this.adjustColor(baseColor, amount));
      }
      // Genera colores más claros para la segunda mitad
      else {
        const amount = 20 * (i - half + 1);
        colors.push(this.adjustColor(baseColor, amount));
      }
    }
    return colors;
  }

}
