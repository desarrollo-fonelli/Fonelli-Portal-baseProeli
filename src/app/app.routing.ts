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


const appRoutes: Routes = [

    {path:"",component:HomeComponent},
    {path:"distribuidores",component:DistribuidoresComponent},
    {path:"ejecutivos",component:EjecutivosComponent},

    {path:"ejecutivos/indicadoresventa/:tipo",component:IndicadoresventaComponent},
    {path:"ejecutivos/datoscliente/:tipo",component:DatosclientesComponent},
    {path:"ejecutivos/consultaprecios/:tipo",component:ConsultapreciosComponent},
    {path:"ejecutivos/consultapedidos/:tipo",component:ConsultapedidosComponent},
    {path:"ejecutivos/relacionpedidos/:tipo",component:RelacionpedidosComponent},
    {path:"ejecutivos/estadocuenta/:tipo",component:EstadocuentaComponent},
    {path:"ejecutivos/fichatecnica/:tipo",component:FichatecnicaComponent},
    {path:"ejecutivos/ventasarticulo/:tipo",component:VentasarticuloComponent},
    {path:"ejecutivos/ventasclientearticulo/:tipo",component:VentasclientearticuloComponent},
    {path:"ejecutivos/reporteventas/:tipo",component:ReporteventasComponent},
    {path:"ejecutivos/consultainactivos/:tipo",component:ConsultainactivosComponent},

    {path:"distribuidores/datoscliente/:tipo",component:DatosclientesComponent},
    {path:"distribuidores/consultaprecios/:tipo",component:ConsultapreciosComponent},
    {path:"distribuidores/consultapedidos/:tipo",component:ConsultapedidosComponent},
    {path:"distribuidores/relacionpedidos/:tipo",component:RelacionpedidosComponent},
    {path:"distribuidores/estadocuenta/:tipo",component:EstadocuentaComponent},
    {path:"distribuidores/ventasclientearticulo/:tipo",component:VentasclientearticuloComponent},
    {path:"distribuidores/reporteventas/:tipo",component:ReporteventasComponent},

    {path:"**",component:ErrorComponent}
];


export const appRoutingProviders: any[] =[];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);