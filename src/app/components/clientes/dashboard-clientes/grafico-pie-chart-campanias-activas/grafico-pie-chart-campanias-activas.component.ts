import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";
import { dashboardClientesService } from 'src/app/services/dashboard-clientes/dashboard-clientes.service';
import { campActivas } from 'src/app/models/campanias-activas/campanias-activas.model';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any; 
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-grafico-pie-chart-campanias-activas',
  templateUrl: './grafico-pie-chart-campanias-activas.component.html',
  styleUrls: ['./grafico-pie-chart-campanias-activas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraficoPieChartCampaniasActivasComponent implements OnInit {
  // @Input() dataCampActivas: any;
  public chartOptions: Partial<ChartOptions>;
  single: any[];
  view: [number,number] = [800, 200];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendTitle="";
  // configuraciones de los charts
  legendPosition:LegendPosition = LegendPosition.Below;
  colorScheme: string = "cool";

  constructor(
    private dashboardClientesService: dashboardClientesService
  ) {
    
    this.chartOptions = {
      title: {
        text: 'Total',
        align: 'center',
       
      },
      series: [],
      chart: {
        type: "donut"
      },
      labels: [],
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
    
  }
 ngOnInit(): void {
  this.actualizarGrafico();
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
  actualizarGrafico(){
    this.dashboardClientesService.getDataCampaniasActivas().subscribe(
      (resul)=>{
        
        resul.rows.forEach((element,index) => {
          this.chartOptions.series[index] = element.camp;
          this.chartOptions.labels[index] = element.nombreCliente.slice(0,5);
         
        });
        this.chartOptions.series.push(resul.rowTotal[0].total);
        this.chartOptions.labels.push('Resto');
      }
    )
     
    
  }
}

