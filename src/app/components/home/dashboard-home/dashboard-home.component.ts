import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { delay, from, mergeMap, toArray } from 'rxjs';
import { GraficoLinea } from 'src/app/models/grafico-linea/grafico-linea.model';
import { Usuario } from 'src/app/models/login/usuario';
import { dashboardClientesService } from 'src/app/services/dashboard-clientes/dashboard-clientes.service';
import { DashboardGeneralService } from 'src/app/services/dashboard/dashboard-general.service';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  usuario: Usuario;

  // clientesPositivo = true;
  // comerciosPositivo = false;
  // ditorsPositivo = true;
  // misionesPositivo = true;
  selectedTab = '';
  locationsEnabled: boolean = true;

  poundsDelivered: number = 0;
  totalLocations: number = 0;
  totalDaysOperation: number = 0;
  houseHoldSizeAverage: number = 0;
  totalStockers: number = 0;
  totalDeliveries: number = 0;
  totalBeneficiaries: number = 0;
  totalBeneficiariesServed: number = 0;
  totalBeneficiariesWithoutHealthInsurance: number = 0;
  totalBeneficiariesRegisteredToday: number = 0;
  totalBeneficiariesRecurringTodayScanned: number = 0;
  totalBeneficiariesRecurringTodayNotScanned: number = 0;
  totalBeneficiariesQualified: number = 0;
  totalClients: number = 0;
  totalEnabledUsers: number = 0;
  totalTicketsUploaded: number = 0;
  totalLocationsEnabled: number = 0;
  totalProductsUploaded: number = 0;
  totalDelivered: number = 0;
  seeMore: boolean = false;


  constructor(
    private dashboardGeneralService: DashboardGeneralService,
    private breakpointObserver: BreakpointObserver,
    private decodificadorService: DecodificadorService
  ) {
    this.selectedTab = 'pounds';
    this.usuario = this.decodificadorService.getUsuario();
  }


  ngOnInit() {
    this.breakpointObserver.observe([
      '(max-width: 800px)'
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });

    // this.breakpointObserver.observe([
    //   Breakpoints.Tablet,
    //   '(min-width: 801px) and (max-width: 1024px)'
    // ]).subscribe(result => {
    //   this.isTablet = result.matches;
    // });

    this.getPoundsDelivered();
    this.getTotalLocations();
    // this.getTotalStockers();
    // this.getTotalDeliveries();
    this.getTotalBeneficiaries();

    this.getTotalBeneficiariesRegisteredToday();
    this.getTotalBeneficiariesRecurringTodayScanned();
    this.getTotalBeneficiariesRecurringTodayNotScanned();
    this.getTotalBeneficiariesQualified();
    this.getTotalTicketsUploaded();
    this.getTotalLocationsEnabled();
    this.getTotalProductsUploaded();
    this.getTotalDelivered();
    this.getTotalEnabledUsers();
    if (this.usuario.role === 'admin' || this.usuario.role === 'director') {
      this.getTotalClients();
      this.getTotalDaysOperation();
      this.getTotalBeneficiariesServed();
    } else {
      this.getHouseHoldSizeAverage();
      this.getTotalBeneficiariesWithoutHealthInsurance();
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  toggleSeeMore() {
    this.seeMore = !this.seeMore;
    // scroll to bottom
    setTimeout(() => {
      const element = document.getElementById('footer');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    }, 50);
  }

  private getPoundsDelivered() {
    this.dashboardGeneralService.getPoundsDelivered().subscribe(
      (res) => {
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

  private getHouseHoldSizeAverage() {
    this.dashboardGeneralService.getHouseHoldSizeAverage().subscribe(
      (res) => {
        this.houseHoldSizeAverage = res;
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

  private getTotalBeneficiariesWithoutHealthInsurance() {
    this.dashboardGeneralService.getTotalBeneficiariesWithoutHealthInsurance().subscribe(
      (res) => {
        this.totalBeneficiariesWithoutHealthInsurance = res;
      }
    );
  }

  private getTotalBeneficiariesRegisteredToday() {
    this.dashboardGeneralService.getTotalBeneficiariesRegisteredToday().subscribe(
      (res) => {
        this.totalBeneficiariesRegisteredToday = res;
      }
    );
  }

  private getTotalBeneficiariesRecurringTodayScanned() {
    this.dashboardGeneralService.getTotalBeneficiariesRecurringTodayScanned().subscribe(
      (res) => {
        this.totalBeneficiariesRecurringTodayScanned = res;
      }
    );
  }

  private getTotalBeneficiariesRecurringTodayNotScanned() {
    this.dashboardGeneralService.getTotalBeneficiariesRecurringTodayNotScanned().subscribe(
      (res) => {
        this.totalBeneficiariesRecurringTodayNotScanned = res;
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

  private getTotalClients() {
    this.dashboardGeneralService.getTotalClients().subscribe(
      (res) => {
        this.totalClients = res;
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

  private getTotalLocationsEnabled() {
    this.dashboardGeneralService.getTotalLocationsEnabled().subscribe(
      (res) => {
        this.totalLocationsEnabled = res;
      }
    );
  }

  private getTotalProductsUploaded() {
    this.dashboardGeneralService.getTotalProductsUploaded().subscribe(
      (res) => {
        this.totalProductsUploaded = res;
      }
    );
  }

  private getTotalDelivered() {
    this.dashboardGeneralService.getTotalDelivered().subscribe(
      (res) => {
        this.totalDelivered = res;
      }
    );
  }

}
