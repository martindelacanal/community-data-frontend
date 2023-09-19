
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

  constructor(
    private metricsService: MetricsService,
    private snackBar: MatSnackBar,
    public translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.getQuestions(this.translate.currentLang);
  }

  downloadCsv() {
    this.metricsService.getFileCSV().subscribe({
      next: (res) => {
        const blob = new Blob([res as BlobPart], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'results-beneficiary-form.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('delivery_snack_upload_qr_error'));
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private getQuestions(language: string, locationId?: string) {
    this.loadingQuestions = true;
    this.metricsService.getQuestions(language, locationId).subscribe({
      next: (res) => {
        console.log(res);
        this.chartOptions = [];
        this.questionsMetrics = res;
        for (let i = 0; i < this.questionsMetrics.length; i++) {
          const question = this.questionsMetrics[i];
          const data = [];
          const categories = [];
          for (let j = 0; j < question.answers.length; j++) {
            const answer = question.answers[j];
            data.push(answer.total);
            categories.push(answer.answer);
          }
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
              tickAmount: Math.max(...data),
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
