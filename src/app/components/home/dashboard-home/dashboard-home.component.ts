import { Component, OnInit } from '@angular/core';
import { delay, from, mergeMap, toArray } from 'rxjs';
import { GraficoLinea } from 'src/app/models/grafico-linea/grafico-linea.model';
import { dashboardClientesService } from 'src/app/services/dashboard-clientes/dashboard-clientes.service';
import { DashboardGeneralService } from 'src/app/services/dashboard/dashboard-general.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {


  // clientesPositivo = true;
  // comerciosPositivo = false;
  // ditorsPositivo = true;
  // misionesPositivo = true;
  selectedTab ='';

  poundsDelivered: number = 0;
  totalLocations: number = 0;
  totalDaysOperation: number = 0;
  totalStockers: number = 0;
  totalDeliveries: number = 0;
  totalBeneficiaries: number = 0;
  totalBeneficiariesServed: number = 0;
  totalBeneficiariesQualified: number = 0;
  totalEnabledUsers: number = 0;
  totalTicketsUploaded: number = 0;


  constructor(
    private dashboardGeneralService: DashboardGeneralService
  ) {
    this.selectedTab = 'pounds';
  }


  ngOnInit(){
    this.getPoundsDelivered();
    this.getTotalLocations();
    this.getTotalDaysOperation();
    this.getTotalStockers();
    this.getTotalDeliveries();
    this.getTotalBeneficiaries();
    this.getTotalBeneficiariesServed();
    this.getTotalBeneficiariesQualified();
    this.getTotalEnabledUsers();
    this.getTotalTicketsUploaded();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  private getPoundsDelivered() {
    this.dashboardGeneralService.getPoundsDelivered().subscribe(
      (res) => {
        console.log(res)
        this.poundsDelivered = res;
      }
    );
  }

  private getTotalLocations() {
    this.dashboardGeneralService.getTotalLocations().subscribe(
      (res) => {
        this.totalLocations = res;
      }
    );
  }

  private getTotalDaysOperation() {
    this.dashboardGeneralService.getTotalDaysOperation().subscribe(
      (res) => {
        this.totalDaysOperation = res;
      }
    );
  }

  private getTotalStockers() {
    this.dashboardGeneralService.getTotalStockers().subscribe(
      (res) => {
        this.totalStockers = res;
      }
    );
  }

  private getTotalDeliveries() {
    this.dashboardGeneralService.getTotalDeliveries().subscribe(
      (res) => {
        this.totalDeliveries = res;
      }
    );
  }

  private getTotalBeneficiaries() {
    this.dashboardGeneralService.getTotalBeneficiaries().subscribe(
      (res) => {
        this.totalBeneficiaries = res;
      }
    );
  }

  private getTotalBeneficiariesServed() {
    this.dashboardGeneralService.getTotalBeneficiariesServed().subscribe(
      (res) => {
        this.totalBeneficiariesServed = res;
      }
    );
  }

  private getTotalBeneficiariesQualified() {
    this.dashboardGeneralService.getTotalBeneficiariesQualified().subscribe(
      (res) => {
        this.totalBeneficiariesQualified = res;
      }
    );
  }

  private getTotalEnabledUsers() {
    this.dashboardGeneralService.getTotalEnabledUsers().subscribe(
      (res) => {
        this.totalEnabledUsers = res;
      }
    );
  }

  private getTotalTicketsUploaded() {
    this.dashboardGeneralService.getTotalTicketsUploaded().subscribe(
      (res) => {
        this.totalTicketsUploaded = res;
      }
    );
  }

}
