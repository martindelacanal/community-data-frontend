import { Component, Input, OnInit } from '@angular/core';
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
export class GraficoLineaDashboardHomeComponent implements OnInit{

  @Input() selectedTab: string;

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

  ngOnInit(): void {
    // switch value of selectedTab
    console.log(this.selectedTab);
    this.getGraficoLinea(this.selectedTab, this.translate.currentLang);
    switch (this.selectedTab) {
      case 'pounds':
        this.multi = [
          {
            "name": "Pounds",
            "series": [
              {
                "value": 0,
                "name": "2016-04-19T09:57:01.208Z"
              },
              {
                "value": 5,
                "name": "2016-05-14T18:11:35.766Z"
              },
              {
                "value": 10,
                "name": "2016-06-16T03:30:54.136Z"
              },
              {
                "value": 4,
                "name": "2016-07-15T06:49:48.939Z"
              },
              {
                "value": 12,
                "name": "2016-08-15T09:57:01.208Z"
              }
            ]
          }
        ];
        break;
      case 'beneficiaries':
        this.multi = [
          {
            "name": "Beneficiaries",
            "series": [
              {
                "value": 21,
                "name": "2016-04-19T09:57:01.208Z"
              },
              {
                "value": 2,
                "name": "2016-05-14T18:11:35.766Z"
              },
              {
                "value": 15,
                "name": "2016-06-16T03:30:54.136Z"
              },
              {
                "value": 4,
                "name": "2016-07-15T06:49:48.939Z"
              },
              {
                "value": 12,
                "name": "2016-08-15T09:57:01.208Z"
              }
            ]
          }
        ];
        break;
      case 'deliveryPeople':
        this.multi = [
          {
            "name": "Delivery people",
            "series": [
              {
                "value": 10,
                "name": "2016-04-19T09:57:01.208Z"
              },
              {
                "value": 5,
                "name": "2016-05-14T18:11:35.766Z"
              },
              {
                "value": 0,
                "name": "2016-06-16T03:30:54.136Z"
              },
              {
                "value": 5,
                "name": "2016-07-15T06:49:48.939Z"
              },
              {
                "value": 1,
                "name": "2016-08-15T09:57:01.208Z"
              }
            ]
          }
        ];
        break;
      case 'operations':
        this.multi = [
          {
            "name": "Operations",
            "series": [
              {
                "value": 20,
                "name": "2016-04-19T09:57:01.208Z"
              },
              {
                "value": 25,
                "name": "2016-05-14T18:11:35.766Z"
              },
              {
                "value": 10,
                "name": "2016-06-16T03:30:54.136Z"
              },
              {
                "value": 4,
                "name": "2016-07-15T06:49:48.939Z"
              },
              {
                "value": 32,
                "name": "2016-08-15T09:57:01.208Z"
              }
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
        console.log(res)
        if(res.series.length > 0){
          this.multi = [res];
        }else{
          this.multi = [];
        }

      }
    );
  }

}
