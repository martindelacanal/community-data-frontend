
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";
import { QuestionMetrics } from "src/app/models/metrics/question-metrics";
import { MetricsService } from "src/app/services/metrics/metrics.service";
import { DownloadMetricsCsvComponent } from "../dialog/download-metrics-csv/download-metrics-csv/download-metrics-csv.component";
import { MatDialog } from "@angular/material/dialog";
import { MetricsFiltersComponent } from "../dialog/metrics-filters/metrics-filters.component";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>[];
  public loadingQuestions: boolean = false;
  public questionsMetrics: QuestionMetrics[] = [];
  loadingCSV: boolean = false;

  constructor(
    private metricsService: MetricsService,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getQuestions(this.translate.currentLang);
  }

  dialogDownloadCsv(): void {
    const dialogRef = this.dialog.open(DownloadMetricsCsvComponent, {
      width: '370px',
      data: '',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.loadingCSV = true;
        this.metricsService.getFileCSV(result.date.from_date, result.date.to_date).subscribe({
          next: (res) => {
            const blob = new Blob([res as BlobPart], { type: 'text/csv; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'results-beneficiary-form.csv';
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
      data: '',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.getQuestions(this.translate.currentLang,result.data);
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private getQuestions(language: string, filters?: any) {
    this.loadingQuestions = true;
    console.log("filters: ", filters)
    this.metricsService.getQuestions(language, filters).subscribe({
      next: (res) => {
        this.chartOptions = [];
        this.questionsMetrics = res;
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
          this.chartOptions.push({
            series: [
              {
                name: "value",
                data: data,
                color: "var(--ui-secundario-oscuro)"
              }
            ],
            chart: {
              type: "bar",
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: true
              }
            },
            dataLabels: {
              enabled: false
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
          });
        }
        this.loadingQuestions = false;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
