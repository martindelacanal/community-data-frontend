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
   ResetPasswordComponent

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
