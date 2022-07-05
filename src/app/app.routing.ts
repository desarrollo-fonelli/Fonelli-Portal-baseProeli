import { ModuleWithProviders } from "@angular/core";
import {Routes,RouterModule, Router}    from '@angular/router';


import { AppComponent } from './app.component';
import { HomeComponent } from "./components/home/home.component";
import { ErrorComponent } from "./components/error/error.component";
import { DistribuidoresComponent } from "./components/distribuidores/distribuidores.component";
import { EjecutivosComponent } from "./components/ejecutivos/ejecutivos.component";
import { IndicadoresventaComponent } from "./components/indicadoresventa/indicadoresventa.component";
import { DatosclientesComponent } from "./components/datosclientes/datosclientes.component";
import { ConsultapreciosComponent } from "./components/consultaprecios/consultaprecios.component";
import { ConsultapedidosComponent } from "./components/consultapedidos/consultapedidos.component";
import { RelacionpedidosComponent } from "./components/relacionpedidos/relacionpedidos.component";
import { EstadocuentaComponent } from "./components/estadocuenta/estadocuenta.component";
import { FichatecnicaComponent } from "./components/fichatecnica/fichatecnica.component";
import { VentasarticuloComponent } from "./components/ventasarticulo/ventasarticulo.component";
import { VentasclientearticuloComponent } from "./components/ventasclientearticulo/ventasclientearticulo.component";
import { ReporteventasComponent } from "./components/reporteventas/reporteventas.component";
import { ConsultainactivosComponent } from "./components/consultainactivos/consultainactivos.component";
import {SidenavComponent} from "./components/sidenav/sidenav.component";

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
      path: 'distribuidores',
      component: SidenavComponent,
      children: [
        { path: 'inicio', component: DistribuidoresComponent },
        { path: 'datoscliente', component: DatosclientesComponent },
        { path: 'consultaprecios', component: ConsultapreciosComponent },
        { path: 'consultapedidos', component: ConsultapedidosComponent },
        { path: 'relacionpedidos', component: RelacionpedidosComponent },
        { path: 'estadocuenta', component: EstadocuentaComponent },
        {
          path: 'ventasclientearticulo',
          component: VentasclientearticuloComponent,
        },
      ],
    },
  
    {
      path: 'asesores',
      component: SidenavComponent,
      children: [
        { path: 'inicio', component: EjecutivosComponent },
        { path: 'indicadoresventa', component: IndicadoresventaComponent },
        { path: 'datoscliente', component: DatosclientesComponent },
        { path: 'consultaprecios', component: ConsultapreciosComponent },
        { path: 'consultapedidos', component: ConsultapedidosComponent },
        { path: 'relacionpedidos', component: RelacionpedidosComponent },
        { path: 'estadocuenta', component: EstadocuentaComponent },
        { path: 'fichatecnica', component: FichatecnicaComponent },
        { path: 'ventasarticulo', component: VentasarticuloComponent },
        {
          path: 'ventasclientearticulo',
          component: VentasclientearticuloComponent,
        },
        { path: 'reporteventas', component: ReporteventasComponent },
        { path: 'consultainactivos', component: ConsultainactivosComponent },
      ],
    },
    { path: '**', component: ErrorComponent },
  ];


export const appRoutingProviders: any[] =[];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);