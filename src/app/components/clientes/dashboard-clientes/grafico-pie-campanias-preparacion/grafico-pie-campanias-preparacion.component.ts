
import { Component, OnInit,ViewEncapsulation } from '@angular/core';

import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexTitleSubtitle } from 'ng-apexcharts';
import { dashboardClientesService } from 'src/app/services/dashboard-clientes/dashboard-clientes.service';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-grafico-pie-campanias-preparacion',
  templateUrl: './grafico-pie-campanias-preparacion.component.html',
  styleUrls: ['./grafico-pie-campanias-preparacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraficoPieCampaniasPreparacionComponent  implements OnInit{
  public chartOptions: Partial<ChartOptions>;
  constructor(private dashboardClientesService: dashboardClientesService){
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
  actualizarGrafico(){
    this.dashboardClientesService.getDataCampaniasPreparacion().subscribe(
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
  ngOnInit(){
    this.actualizarGrafico();
  }
}

