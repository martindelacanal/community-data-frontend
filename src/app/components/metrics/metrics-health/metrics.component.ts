
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
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
  ApexTooltip
} from "ng-apexcharts";
import { QuestionMetrics } from "src/app/models/metrics/question-metrics";
import { MetricsService } from "src/app/services/metrics/metrics.service";
import { DownloadMetricsCsvComponent } from "../../dialog/download-metrics-csv/download-metrics-csv/download-metrics-csv.component";
import { MatDialog } from "@angular/material/dialog";
import { MetricsFiltersComponent } from "../../dialog/metrics-filters/metrics-filters.component";
import { FormBuilder, FormGroup } from "@angular/forms";

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
};

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chartYESNO") chartYESNO: ChartComponent;
  public chartOptions: Partial<ChartOptions>[];
  public chartOptionsYESNO: Partial<ChartOptionsYESNO>[];
  public loadingQuestions: boolean = false;
  public questionsMetrics: QuestionMetrics[] = [];
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
    this.getQuestions(this.translate.currentLang);
  }

  private getQuestions(language: string, filters?: any) {
    this.loadingQuestions = true;
    this.metricsService.getQuestions(language, filters).subscribe({
      next: (res) => {
        // this.chartOptions = [];
        // this.chartOptionsYESNO = [];
        this.questionsMetrics = res;
        this.chartOptions = new Array(this.questionsMetrics.length).fill(null);
        this.chartOptionsYESNO = new Array(this.questionsMetrics.length).fill(null);
        console.log("res: ", res);
        for (let i = 0; i < this.questionsMetrics.length; i++) {
          const question = this.questionsMetrics[i];
          const data = [];
          const categories = [];
          for (let j = 0; j < question.answers.length; j++) {
            const answer = question.answers[j];
            data.push(answer.total);
            categories.push(answer.answer);
          }
          console.log("data: ", data);
          console.log("categories: ", categories);

          if ((categories.includes('Yes') && categories.includes('No')) || (categories.includes('Sí') && categories.includes('No')) || (categories.includes('Si') && categories.includes('No'))) {
            this.chartOptionsYESNO[i] = {
              series: data,
              chart: {
                width: 380,
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
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200
                    },
                    legend: {
                      position: "bottom"
                    }
                  }
                }
              ]
            };
          } else {
            this.chartOptions[i] ={
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
          }
        }
        this.loadingQuestions = false;
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

        this.getQuestions(this.translate.currentLang, result.data);
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }


}
