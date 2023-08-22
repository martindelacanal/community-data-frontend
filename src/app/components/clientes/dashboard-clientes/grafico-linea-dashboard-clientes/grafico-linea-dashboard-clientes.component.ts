import { Component, Input, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Color, NgxChartsModule, ScaleType, tickFormat } from '@swimlane/ngx-charts';
import { format } from 'date-fns';
import { delay, from, map, mergeMap, of, scan, toArray } from 'rxjs';
import { Contador } from 'src/app/models/contador/contador.model';
import { GraficoLinea } from 'src/app/models/grafico-linea/grafico-linea.model';
import { MisionesRevision } from 'src/app/models/misiones-en-revision/misiones-revision.model';
import {  dashboardClientesService } from 'src/app/services/dashboard-clientes/dashboard-clientes.service';

@Component({
  selector: 'app-grafico-linea-dashboard-clientes',
  templateUrl: './grafico-linea-dashboard-clientes.component.html',
  styleUrls: ['./grafico-linea-dashboard-clientes.component.scss']
})
export class GraficoLineaDashboardClientesComponent implements OnInit{

  @Input() selectedTab: string;

  multi: any[];
  view: [number,number] = [undefined, 270];

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
  misionesRevision: MisionesRevision[];
  totalMisionesRevision:Contador;
  colorScheme: Color = {
    name: 'my-color-scheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#28A745']
  };
  formattedChartData: any[] = [];
  constructor(
    private dashboardClientesService: dashboardClientesService
  ) {

  }
  ngOnInit(){
    // this.getMisionesRevision();
    this.getClientesMes();
  }


  getMisionesRevision(){
    this.dashboardClientesService.getMisionesRevision().pipe(
      mergeMap((response: MisionesRevision[]) => {
        return from(response).pipe(
          delay(10), // Añade un retardo para simular la carga progresiva
          toArray()
        );
      })).subscribe((formattedData: any[]) => {
        this.formattedChartData = [
          {
            name: 'Misiones',
            series: formattedData.map((item: MisionesRevision) => {
              return {
                name: item.name,
                value: item.value
              };
            })
          }
        ];
      });
  }
  getClientesMes(){
   
    this.dashboardClientesService.getClientesMes().pipe(
      mergeMap((response: GraficoLinea[]) => {
        return from(response).pipe(
          delay(10), // Añade un retardo para simular la carga progresiva
          toArray()
        );
      })).subscribe((formattedData: any[]) => {
        this.formattedChartData = [
          {
            name: 'Clientes',
            series: formattedData.map((item: GraficoLinea) => {
              return {
                name: item.name,
                value: item.value
              };
            })
          }
        ]
       
      });
      
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
    const [day, month] =tick.split('/'); 
    let fecha = new Date();
    fecha.setDate(day);
    fecha.setMonth(month - 1);
    return format(new Date(fecha), 'dd/MM');
  }
}


