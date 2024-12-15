import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { format } from 'date-fns';
import { finalize } from 'rxjs';
import { GraphicLineComplete } from 'src/app/models/grafico-linea/graphic-line-complete';
import { DashboardGeneralService } from 'src/app/services/dashboard/dashboard-general.service';

@Component({
  selector: 'app-grafico-linea-dashboard-home',
  templateUrl: './grafico-linea-dashboard-home.component.html',
  styleUrls: ['./grafico-linea-dashboard-home.component.scss']
})
export class GraficoLineaDashboardHomeComponent implements OnInit, OnChanges {

  @Input() selectedTab: string;
  @Input() filters: any; // Cambiado de FormGroup a any

  multi: GraphicLineComplete[] = [];
  view: [number, number] = [undefined, 300];

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

  // loading
  loading: boolean = true;

  colorScheme: Color = {
    name: 'my-color-scheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#28A745']
  };

  constructor(
    private dashboardGeneralService: DashboardGeneralService,
    public translate: TranslateService,
  ) {
    this.multi = [];

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.postGraficoLinea(this.selectedTab, this.translate.currentLang, this.filters);
    }
  }

  ngOnInit(): void {
    // Check if we have initial values
    if (this.selectedTab && this.filters && this.selectedTab === 'pounds-filters') {
      this.postGraficoLinea(this.selectedTab, this.translate.currentLang, this.filters);
    } else {
      this.getGraficoLinea(this.selectedTab, this.translate.currentLang);
    }

    // Initialize series based on selectedTab
    this.initializeSeries();
  }

  private initializeSeries(): void {
    switch (this.selectedTab) {
      case 'pounds':
      case 'pounds-filters':
        this.multi = [
          {
            "name": "Pounds",
            "series": []
          }
        ];
        break;
      case 'beneficiaries':
        this.multi = [
          {
            "name": "Beneficiaries",
            "series": []
          }
        ];
        break;
      case 'deliveryPeople':
        this.multi = [
          {
            "name": "Delivery people",
            "series": []
          }
        ];
        break;
      case 'operations':
        this.multi = [
          {
            "name": "Operations",
            "series": []
          }
        ];
        break;
    }
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  formatXAxisTick(tick: any): string {
    return format(new Date(tick), 'MM/yyyy');
  }

  private getGraficoLinea(selectedTab: string, language: string) {
    this.loading = true;
    this.dashboardGeneralService.getGraficoLinea(selectedTab, language).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        if (res.series.length > 0) {
          this.multi = [res];
        } else {
          this.multi = [];
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  private postGraficoLinea(selectedTab: string, language: string, filters: any) {
    this.loading = true;
    this.dashboardGeneralService.postGraficoLinea(selectedTab, language, filters).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        if (res.series.length > 0) {
          this.multi = [res];
        } else {
          this.multi = [];
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
