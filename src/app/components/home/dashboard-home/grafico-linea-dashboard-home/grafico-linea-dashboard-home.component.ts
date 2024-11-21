import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { format } from 'date-fns';
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
    // switch value of selectedTab
    if (this.selectedTab === 'pounds-filters') {
      this.postGraficoLinea(this.selectedTab, this.translate.currentLang, this.filters.value);
    } else {
      this.getGraficoLinea(this.selectedTab, this.translate.currentLang);
    }

    switch (this.selectedTab) {
      case 'pounds':
        this.multi = [
          {
            "name": "Pounds",
            "series": [
              // {
              //   "value": 0,
              //   "name": "2016-04-19T09:57:01.208Z"
              // },
            ]
          }
        ];
        break;
      case 'pounds-filters':
        this.multi = [
          {
            "name": "Pounds",
            "series": [
            ]
          }
        ];
        break;
      case 'beneficiaries':
        this.multi = [
          {
            "name": "Beneficiaries",
            "series": [
            ]
          }
        ];
        break;
      case 'deliveryPeople':
        this.multi = [
          {
            "name": "Delivery people",
            "series": [
            ]
          }
        ];
        break;
      case 'operations':
        this.multi = [
          {
            "name": "Operations",
            "series": [
            ]
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
    this.dashboardGeneralService.getGraficoLinea(selectedTab, language).subscribe(
      (res) => {
        if(res.series.length > 0){
          this.multi = [res];
        }else{
          this.multi = [];
        }

      }
    );
  }

  private postGraficoLinea(selectedTab: string, language: string, filters: any) {
    this.dashboardGeneralService.postGraficoLinea(selectedTab, language, filters).subscribe(
      (res) => {
        if(res.series.length > 0){
          this.multi = [res];
        }else{
          this.multi = [];
        }

      }
    );
  }

}
