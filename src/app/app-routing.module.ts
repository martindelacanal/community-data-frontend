import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClientesComponent } from './components/clientes/dashboard-clientes/dashboard-clientes.component';
import { DashboardDitorsComponent } from './components/ditors/dashboard-ditors/dashboard-ditors.component';
import { DashboardHomeComponent } from './components/home/dashboard-home/dashboard-home.component';
import { DashboardInternoComponent } from './components/interno/dashboard-interno/dashboard-interno.component';
import { InicioSesionComponent } from './components/login/inicio-sesion/inicio-sesion.component';
import { DashboardOperacionesComponent } from './components/operaciones/dashboard-operaciones/dashboard-operaciones.component';
import { NuevoComercioComponent } from './components/clientes/particular/nuevo-comercio/nuevo-comercio.component';
import { RoleGuard } from './guards/login/role.guard';
import { NuevoCampaniaComponent } from './components/clientes/particular/nuevo-campania/nuevo-campania.component';
import { NuevoArticuloComponent } from './components/clientes/particular/nuevo-articulo/nuevo-articulo.component';
import { ParticularClientesComponent } from './components/clientes/particular/particular-clientes/particular-clientes.component';
import { ResumenComponent } from './components/clientes/campanias/resumen/resumen.component';
import { CampaniasActivasComponent } from './components/clientes/campanias-activas/campanias-activas.component';
import { ReclamosComponent } from './components/clientes/reclamos/reclamos.component';
import { ComerciosComponent } from './components/clientes/particular/comercios/comercios.component';
import { AcercaDeComponent } from './components/clientes/particular/acerca-de/acerca-de.component';
import { ArticulosComponent } from './components/clientes/particular/articulos/articulos.component';
import { MisionesDisponiblesClientesComponent } from './components/clientes/misiones-disponibles-clientes/misiones-disponibles-clientes.component';
import { MisionesDisponiblesComponent } from './components/clientes/particular/misiones-disponibles/misiones-disponibles.component';
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
