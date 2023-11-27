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
import { MetricsComponent } from './components/metrics/metrics.component';
import { TableUserComponent } from './components/tables/user/table-user/table-user.component';
import { TableTicketComponent } from './components/tables/ticket/table-ticket/table-ticket.component';
import { TableProductComponent } from './components/tables/product/table-product/table-product.component';
import { TableNotificationComponent } from './components/tables/notification/table-notification/table-notification.component';
import { TableLocationComponent } from './components/tables/location/table-location/table-location.component';
import { ViewTicketComponent } from './components/view/ticket/view-ticket/view-ticket.component';
import { NewUserComponent } from './components/new/user/new-user/new-user.component';
import { TableDeliveredComponent } from './components/tables/delivered/table-delivered/table-delivered.component';

const routes: Routes = [
  { path: 'view/ticket/:id', component: ViewTicketComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'new/user', component: NewUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/delivered', component: TableDeliveredComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/notification', component: TableNotificationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/location', component: TableLocationComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/product', component: TableProductComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/ticket', component: TableTicketComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/user', component: TableUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'table/user/:search', component: TableUserComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin']} },
  { path: 'metrics', component: MetricsComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client']} },
  { path: 'settings', component: SettingsComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client','stocker','delivery','beneficiary']} },
  { path: 'help', component: HelpComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client','stocker','delivery','beneficiary']} },
  { path: 'delivery/home', component: DeliveryHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['delivery']} },
  { path: 'stocker/home', component: StockerHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['stocker']} },
  { path: 'beneficiary/home', component: BeneficiaryHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['beneficiary']} },
  { path: 'home', component: DashboardHomeComponent, canActivate: [RoleGuard], data: {expectedRoles: ['admin', 'client']} },
  { path: 'register', component: FormularioRegistroComponent },
  { path: 'login', component: InicioSesionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
