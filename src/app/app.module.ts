import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './components/login/inicio-sesion/inicio-sesion.component';
import { DashboardHomeComponent } from './components/home/dashboard-home/dashboard-home.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './services/login/token-interceptor.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenuComponent } from './components/navegacion/menu/menu.component';
import { DashboardClientesComponent } from './components/clientes/dashboard-clientes/dashboard-clientes.component';
import { DashboardDitorsComponent } from './components/ditors/dashboard-ditors/dashboard-ditors.component';
import { DashboardOperacionesComponent } from './components/operaciones/dashboard-operaciones/dashboard-operaciones.component';
import { DashboardInternoComponent } from './components/interno/dashboard-interno/dashboard-interno.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NuevoComercioComponent } from './components/clientes/particular/nuevo-comercio/nuevo-comercio.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraficoLineaDashboardHomeComponent } from './components/home/dashboard-home/grafico-linea-dashboard-home/grafico-linea-dashboard-home.component';
import { NuevoCampaniaComponent } from './components/clientes/particular/nuevo-campania/nuevo-campania.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapaDashboardHomeComponent } from './components/home/dashboard-home/mapa-dashboard-home/mapa-dashboard-home.component';
import { NuevoArticuloComponent } from './components/clientes/particular/nuevo-articulo/nuevo-articulo.component';
import { GraficoLineaDashboardClientesComponent } from './components/clientes/dashboard-clientes/grafico-linea-dashboard-clientes/grafico-linea-dashboard-clientes.component';
import { GraficoPieChartCampaniasActivasComponent } from './components/clientes/dashboard-clientes/grafico-pie-chart-campanias-activas/grafico-pie-chart-campanias-activas.component';
import { ParticularClientesComponent } from './components/clientes/particular/particular-clientes/particular-clientes.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CampaniasActivasComponent } from './components/clientes/campanias-activas/campanias-activas.component';
import { MatTableModule , MatTableDataSourcePaginator} from '@angular/material/table';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { ResumenComponent } from './components/clientes/campanias/resumen/resumen.component';
import { TablasComponent } from './components/tablas/tablas.component';
import { ReclamosComponent } from './components/clientes/reclamos/reclamos.component';
import { ComerciosComponent } from './components/clientes/particular/comercios/comercios.component';
import { AcercaDeComponent } from './components/clientes/particular/acerca-de/acerca-de.component';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import { ArticulosComponent } from './components/clientes/particular/articulos/articulos.component';
import {MatCardModule} from '@angular/material/card';
import { MisionesDisponiblesComponent } from './components/clientes/particular/misiones-disponibles/misiones-disponibles.component';
import { MisionesDisponiblesClientesComponent } from './components/clientes/misiones-disponibles-clientes/misiones-disponibles-clientes.component';
import { CapacidadMisionesComponent } from './components/ditors/capacidad-misiones/capacidad-misiones.component';
import { CampaniasPausadasComponent } from './components/ditors/campanias-pausadas/campanias-pausadas.component';
import { SaldosRetirosComponent } from './components/ditors/saldos-retiros/saldos-retiros.component';
import { DitorParticularComponent } from './components/ditors/ditor-particular/ditor-particular.component';
import { DitorReclamosComponent } from './components/ditors/reclamos/ditor-reclamos.component';
import { VerPerfilCompletoComponent } from './components/ditors/ver-perfil-completo/ver-perfil-completo.component';
import { SaldosRetirosParticularComponent } from './components/ditors/ditor-particular/saldos-retiros-particular/saldos-retiros-particular.component';
import { EntrenamientosYCertificacionesComponent } from './components/ditors/ditor-particular/entrenamientos-y-certificaciones/entrenamientos-y-certificaciones.component';
import { MisionesParticularComponent } from './components/ditors/ditor-particular/misiones-particular/misiones-particular.component';
import { ReferidosComponent } from './components/ditors/referidos/referidos.component';
import { ListadoClientesComponent } from './components/clientes/dashboard-clientes/listado-clientes/listado-clientes/listado-clientes.component';
import { ComerciosClienteComponent } from './components/clientes/comercios-cliente/comercios-cliente/comercios-cliente.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GraficoPieCampaniasPreparacionComponent } from './components/clientes/dashboard-clientes/grafico-pie-campanias-preparacion/grafico-pie-campanias-preparacion.component';
import { FormularioRegistroComponent } from './components/registro/formulario-registro/formulario-registro.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { BeneficiaryHomeComponent } from './components/beneficiary/beneficiary-home/beneficiary-home.component';
import { StockerHomeComponent } from './components/stocker/stocker-home/stocker-home.component';
import { DeliveryHomeComponent } from './components/delivery/delivery-home/delivery-home.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgQrScannerModule } from 'angular2-qrscanner';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HelpComponent } from './components/support/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    DashboardHomeComponent,
    MenuComponent,
    DashboardClientesComponent,
    DashboardDitorsComponent,
    DashboardOperacionesComponent,
    DashboardInternoComponent,
    NuevoComercioComponent,
    GraficoLineaDashboardHomeComponent,
    NuevoCampaniaComponent,
    MapaDashboardHomeComponent,
    NuevoArticuloComponent,
    GraficoLineaDashboardClientesComponent,
    GraficoPieChartCampaniasActivasComponent,
    ParticularClientesComponent,
    CampaniasActivasComponent,
    ResumenComponent,
    TablasComponent,
    ReclamosComponent,
    ComerciosComponent,
    AcercaDeComponent,
    ArticulosComponent,
   MisionesDisponiblesClientesComponent,
   MisionesDisponiblesComponent,
   CapacidadMisionesComponent,
   CampaniasPausadasComponent,
   SaldosRetirosComponent,
   DitorParticularComponent,
   DitorReclamosComponent,
   VerPerfilCompletoComponent,
   SaldosRetirosParticularComponent,
   EntrenamientosYCertificacionesComponent,
   MisionesParticularComponent,
   ReferidosComponent,
   ListadoClientesComponent,
   ComerciosClienteComponent,
   GraficoPieCampaniasPreparacionComponent,
   FormularioRegistroComponent,
   BeneficiaryHomeComponent,
   StockerHomeComponent,
   DeliveryHomeComponent,
   HelpComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    NgxChartsModule,
    GoogleMapsModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatCardModule,
    NgApexchartsModule,
    MatStepperModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTooltipModule,
    NgxQRCodeModule,
    NgQrScannerModule,
    MatSelectModule,
    MatAutocompleteModule

  ],
  providers: [
    // JWT
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    // Token interceptor
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
