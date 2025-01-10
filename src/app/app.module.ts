import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './components/login/inicio-sesion/inicio-sesion.component';
import { DashboardHomeComponent } from './components/home/dashboard-home/dashboard-home.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './services/login/token-interceptor.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenuComponent } from './components/navegacion/menu/menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraficoLineaDashboardHomeComponent } from './components/home/dashboard-home/grafico-linea-dashboard-home/grafico-linea-dashboard-home.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapaDashboardHomeComponent } from './components/home/dashboard-home/mapa-dashboard-home/mapa-dashboard-home.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule , MatTableDataSourcePaginator} from '@angular/material/table';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ResetPasswordComponent } from './components/dialog/reset-password/reset-password.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SettingsComponent } from './components/settings/settings.component';
import { MetricsComponent } from './components/metrics/metrics-health/metrics.component';
import { DisclaimerRegisterComponent } from './components/dialog/disclaimer-register/disclaimer-register/disclaimer-register.component';
import { TableUserComponent } from './components/tables/user/table-user/table-user.component';
import { TableTicketComponent } from './components/tables/ticket/table-ticket/table-ticket.component';
import { TableLocationComponent } from './components/tables/location/table-location/table-location.component';
import { TableProductComponent } from './components/tables/product/table-product/table-product.component';
import { TableNotificationComponent } from './components/tables/notification/table-notification/table-notification.component';
import { DisclaimerResetPasswordComponent } from './components/dialog/disclaimer-reset-password/disclaimer-reset-password/disclaimer-reset-password.component';
import { ViewTicketComponent } from './components/view/view-ticket/view-ticket.component';
import { NewUserComponent } from './components/new/user/new-user/new-user.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TableDeliveredComponent } from './components/tables/delivered/table-delivered/table-delivered.component';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { SelectionDeliveredCsvComponent } from './components/dialog/selection-delivered-csv/selection-delivered-csv/selection-delivered-csv.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { DisclaimerRegisterLocationComponent } from './components/dialog/disclaimer-register-location/disclaimer-register-location.component';
import { MetricsFiltersComponent } from './components/dialog/metrics-filters/metrics-filters.component';
import { MetricsDemographicComponent } from './components/metrics/metrics-demographic/metrics-demographic.component';
import { MetricsParticipantComponent } from './components/metrics/metrics-participant/metrics-participant.component';
import { MetricsProductComponent } from './components/metrics/metrics-product/metrics-product.component';
import { ViewProductComponent } from './components/view/view-product/view-product.component';
import { ViewNotificationComponent } from './components/view/view-notification/view-notification.component';
import { ViewLocationComponent } from './components/view/view-location/view-location.component';
import { ViewDeliveredComponent } from './components/view/view-delivered/view-delivered.component';
import { ViewUserComponent } from './components/view/view-user/view-user.component';
import { NewProductComponent } from './components/new/product/new-product/new-product.component';
import { NewProviderComponent } from './components/new/provider/new-provider/new-provider.component';
import { NewClientComponent } from './components/new/client/new-client/new-client.component';
import { NewLocationComponent } from './components/new/location/new-location/new-location.component';
import { NewProductTypeComponent } from './components/new/product-type/new-product-type/new-product-type.component';
import { TableClientComponent } from './components/tables/client/table-client/table-client.component';
import { TableProductTypeComponent } from './components/tables/product-type/table-product-type/table-product-type.component';
import { TableProviderComponent } from './components/tables/provider/table-provider/table-provider.component';
import { ViewProviderComponent } from './components/view/view-provider/view-provider.component';
import { ViewProductTypeComponent } from './components/view/view-product-type/view-product-type.component';
import { ViewClientComponent } from './components/view/view-client/view-client.component';
import { TableGenderComponent } from './components/tables/table-gender/table-gender.component';
import { TableEthnicityComponent } from './components/tables/table-ethnicity/table-ethnicity.component';
import { ViewGenderComponent } from './components/view/view-gender/view-gender.component';
import { ViewEthnicityComponent } from './components/view/view-ethnicity/view-ethnicity.component';
import { NewEthnicityComponent } from './components/new/new-ethnicity/new-ethnicity.component';
import { NewGenderComponent } from './components/new/new-gender/new-gender.component';
import { DisclaimerEnableDisableElementComponent } from './components/dialog/disclaimer-enable-disable-element/disclaimer-enable-disable-element.component';
import {MatChipsModule} from '@angular/material/chips';
import { SurveyComponent } from './components/survey/survey.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { SelectListComponent } from './components/dialog/select-list/select-list.component';
import { TableWorkerComponent } from './components/tables/worker/table-worker.component';
import { ViewWorkerComponent } from './components/view/view-worker/view-worker.component';
import { TableDeliveredByComponent } from './components/tables/delivered-by/table-delivered-by.component';
import { NewDeliveredByComponent } from './components/new/new-delivered-by/new-delivered-by.component';
import { ViewDeliveredByComponent } from './components/view/view-delivered-by/view-delivered-by.component';
import { VoluntarioRegistroComponent } from './components/registro/voluntario-registro/voluntario-registro.component';
import { NewTransportedByComponent } from './components/new/new-transported-by/new-transported-by.component';
import { TableTransportedByComponent } from './components/tables/transported-by/table-transported-by.component';
import { ViewTransportedByComponent } from './components/view/view-transported-by/view-transported-by.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    DashboardHomeComponent,
    MenuComponent,
    GraficoLineaDashboardHomeComponent,
    MapaDashboardHomeComponent,
   FormularioRegistroComponent,
   BeneficiaryHomeComponent,
   StockerHomeComponent,
   DeliveryHomeComponent,
   HelpComponent,
   ResetPasswordComponent,
   SettingsComponent,
   MetricsComponent,
   DisclaimerRegisterComponent,
   TableUserComponent,
   TableTicketComponent,
   TableLocationComponent,
   TableProductComponent,
   TableNotificationComponent,
   DisclaimerResetPasswordComponent,
   ViewTicketComponent,
   NewUserComponent,
   TableDeliveredComponent,
   OnlyNumberDirective,
   SelectionDeliveredCsvComponent,
   CarouselComponent,
   DisclaimerRegisterLocationComponent,
   MetricsFiltersComponent,
   MetricsDemographicComponent,
   MetricsParticipantComponent,
   MetricsProductComponent,
   ViewProductComponent,
   ViewNotificationComponent,
   ViewLocationComponent,
   ViewDeliveredComponent,
   ViewUserComponent,
   NewProductComponent,
   NewProviderComponent,
   NewClientComponent,
   NewLocationComponent,
   NewProductTypeComponent,
   TableClientComponent,
   TableProductTypeComponent,
   TableProviderComponent,
   ViewProviderComponent,
   ViewProductTypeComponent,
   ViewClientComponent,
   TableGenderComponent,
   TableEthnicityComponent,
   ViewGenderComponent,
   ViewEthnicityComponent,
   NewEthnicityComponent,
   NewGenderComponent,
   DisclaimerEnableDisableElementComponent,
   SurveyComponent,
   SelectListComponent,
   TableWorkerComponent,
   ViewWorkerComponent,
   TableDeliveredByComponent,
   NewDeliveredByComponent,
   ViewDeliveredByComponent,
   VoluntarioRegistroComponent,
   NewTransportedByComponent,
   TableTransportedByComponent,
   ViewTransportedByComponent

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
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonToggleModule,
    NgImageSliderModule,
    MatChipsModule,
    MatExpansionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
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
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
