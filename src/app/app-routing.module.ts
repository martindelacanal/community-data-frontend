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

const routes: Routes = [
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
