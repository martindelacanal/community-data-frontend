import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './components/home/dashboard-home/dashboard-home.component';
import { InicioSesionComponent } from './components/login/inicio-sesion/inicio-sesion.component';
import { RoleGuard } from './guards/login/role.guard';
import { FormularioRegistroComponent } from './components/registro/formulario-registro/formulario-registro.component';
import { BeneficiaryHomeComponent } from './components/beneficiary/beneficiary-home/beneficiary-home.component';
import { DeliveryHomeComponent } from './components/delivery/delivery-home/delivery-home.component';
import { StockerHomeComponent } from './components/stocker/stocker-home/stocker-home.component';
import { HelpComponent } from './components/support/help/help.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MetricsComponent } from './components/metrics/metrics-health/metrics.component';
import { TableUserComponent } from './components/tables/user/table-user/table-user.component';
import { TableTicketComponent } from './components/tables/ticket/table-ticket/table-ticket.component';
import { TableProductComponent } from './components/tables/product/table-product/table-product.component';
import { TableNotificationComponent } from './components/tables/notification/table-notification/table-notification.component';
import { TableLocationComponent } from './components/tables/location/table-location/table-location.component';
import { ViewTicketComponent } from './components/view/view-ticket/view-ticket.component';
import { NewUserComponent } from './components/new/user/new-user/new-user.component';
import { TableDeliveredComponent } from './components/tables/delivered/table-delivered/table-delivered.component';
import { MetricsDemographicComponent } from './components/metrics/metrics-demographic/metrics-demographic.component';
import { MetricsParticipantComponent } from './components/metrics/metrics-participant/metrics-participant.component';
import { MetricsProductComponent } from './components/metrics/metrics-product/metrics-product.component';
import { ViewProductComponent } from './components/view/view-product/view-product.component';
import { ViewDeliveredComponent } from './components/view/view-delivered/view-delivered.component';
import { ViewLocationComponent } from './components/view/view-location/view-location.component';
import { ViewNotificationComponent } from './components/view/view-notification/view-notification.component';
import { ViewUserComponent } from './components/view/view-user/view-user.component';
import { NewProviderComponent } from './components/new/provider/new-provider/new-provider.component';
import { NewProductComponent } from './components/new/product/new-product/new-product.component';
import { NewLocationComponent } from './components/new/location/new-location/new-location.component';
import { NewClientComponent } from './components/new/client/new-client/new-client.component';
import { NewProductTypeComponent } from './components/new/product-type/new-product-type/new-product-type.component';
import { TableProviderComponent } from './components/tables/provider/table-provider/table-provider.component';
import { TableProductTypeComponent } from './components/tables/product-type/table-product-type/table-product-type.component';
import { TableClientComponent } from './components/tables/client/table-client/table-client.component';
import { ViewProductTypeComponent } from './components/view/view-product-type/view-product-type.component';
import { ViewProviderComponent } from './components/view/view-provider/view-provider.component';
import { ViewClientComponent } from './components/view/view-client/view-client.component';
import { ViewEthnicityComponent } from './components/view/view-ethnicity/view-ethnicity.component';
import { ViewGenderComponent } from './components/view/view-gender/view-gender.component';
import { NewEthnicityComponent } from './components/new/new-ethnicity/new-ethnicity.component';
import { NewGenderComponent } from './components/new/new-gender/new-gender.component';
import { TableEthnicityComponent } from './components/tables/table-ethnicity/table-ethnicity.component';
import { TableGenderComponent } from './components/tables/table-gender/table-gender.component';
import { SurveyComponent } from './components/survey/survey.component';
import { TableWorkerComponent } from './components/tables/worker/table-worker.component';
import { ViewWorkerComponent } from './components/view/view-worker/view-worker.component';
import { TableDeliveredByComponent } from './components/tables/delivered-by/table-delivered-by.component';
import { NewDeliveredByComponent } from './components/new/new-delivered-by/new-delivered-by.component';
import { ViewDeliveredByComponent } from './components/view/view-delivered-by/view-delivered-by.component';
import { VoluntarioRegistroComponent } from './components/registro/voluntario-registro/voluntario-registro.component';
import { ViewTransportedByComponent } from './components/view/view-transported-by/view-transported-by.component';
import { NewTransportedByComponent } from './components/new/new-transported-by/new-transported-by.component';
import { TableTransportedByComponent } from './components/tables/transported-by/table-transported-by.component';

const routes: Routes = [
  { path: 'survey', component: SurveyComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/product-type/:id', component: ViewProductTypeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/delivered-by/:id', component: ViewDeliveredByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/transported-by/:id', component: ViewTransportedByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/gender/:id', component: ViewGenderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/ethnicity/:id', component: ViewEthnicityComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/provider/:id', component: ViewProviderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client']} },
  { path: 'view/client/:id', component: ViewClientComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/delivered/:id', component: ViewDeliveredComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client']} },
  { path: 'view/location/:id', component: ViewLocationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'opsmanager', 'director']} },
  { path: 'view/notification/:id', component: ViewNotificationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'view/product/:id', component: ViewProductComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'opsmanager', 'director']} },
  { path: 'view/ticket/:id', component: ViewTicketComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'opsmanager', 'director', 'stocker', 'auditor']} },
  { path: 'view/user/:id', component: ViewUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client']} },
  { path: 'view/worker/:id', component: ViewWorkerComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'opsmanager', 'director']} },
  { path: 'edit/ticket/:id', component: StockerHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'stocker', 'auditor']} },
  { path: 'edit/product/:id', component: NewProductComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/product-type/:id', component: NewProductTypeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/delivered-by/:id', component: NewDeliveredByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/transported-by/:id', component: NewTransportedByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/gender/:id', component: NewGenderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/ethnicity/:id', component: NewEthnicityComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/provider/:id', component: NewProviderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/location/:id', component: NewLocationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'opsmanager']} },
  { path: 'edit/client/:id', component: NewClientComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'edit/user/:id', component: NewUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/product', component: NewProductComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/product-type', component: NewProductTypeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/delivered-by', component: NewDeliveredByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/transported-by', component: NewTransportedByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/gender', component: NewGenderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/ethnicity', component: NewEthnicityComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/provider', component: NewProviderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/location', component: NewLocationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'opsmanager']} },
  { path: 'new/client', component: NewClientComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/user', component: NewUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/client', component: TableClientComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/delivered', component: TableDeliveredComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/location', component: TableLocationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'opsmanager', 'director']} },
  { path: 'table/notification', component: TableNotificationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/product', component: TableProductComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'opsmanager', 'director']} },
  { path: 'table/product-type', component: TableProductTypeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/delivered-by', component: TableDeliveredByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/transported-by', component: TableTransportedByComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/gender', component: TableGenderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/ethnicity', component: TableEthnicityComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/provider', component: TableProviderComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/ticket', component: TableTicketComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'opsmanager', 'director', 'stocker', 'auditor']} },
  { path: 'table/worker', component: TableWorkerComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'opsmanager', 'director']} },
  { path: 'table/user', component: TableUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/user/:search', component: TableUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client']} },
  { path: 'metrics/product', component: MetricsProductComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'director', 'auditor']} },
  { path: 'metrics/participant', component: MetricsParticipantComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'director']} },
  { path: 'metrics/demographic', component: MetricsDemographicComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'director']} },
  { path: 'metrics/health', component: MetricsComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'director']} },
  { path: 'settings', component: SettingsComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'stocker', 'delivery', 'beneficiary', 'opsmanager', 'director', 'auditor']} },
  { path: 'help', component: HelpComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'stocker', 'delivery', 'beneficiary', 'opsmanager', 'director', 'auditor']} },
  { path: 'delivery/home', component: DeliveryHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['delivery']} },
  { path: 'stocker/home', component: StockerHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'stocker', 'opsmanager']} },
  { path: 'beneficiary/home', component: BeneficiaryHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['beneficiary']} },
  { path: 'home', component: DashboardHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client', 'director']} },
  { path: 'register', component: FormularioRegistroComponent },
  { path: 'register/volunteer', component: VoluntarioRegistroComponent },
  { path: 'login', component: InicioSesionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
