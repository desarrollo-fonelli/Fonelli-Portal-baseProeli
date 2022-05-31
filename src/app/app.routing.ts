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

    {path:"ejecutivos/indicadoresventa/",component:IndicadoresventaComponent},
    {path:"ejecutivos/datoscliente/",component:DatosclientesComponent},
    {path:"ejecutivos/consultaprecios/",component:ConsultapreciosComponent},
    {path:"ejecutivos/consultapedidos/",component:ConsultapedidosComponent},
    {path:"ejecutivos/relacionpedidos/",component:RelacionpedidosComponent},
    {path:"ejecutivos/estadocuenta/",component:EstadocuentaComponent},
    {path:"ejecutivos/fichatecnica/",component:FichatecnicaComponent},
    {path:"ejecutivos/ventasarticulo/",component:VentasarticuloComponent},
    {path:"ejecutivos/ventasclientearticulo/",component:VentasclientearticuloComponent},
    {path:"ejecutivos/reporteventas/",component:ReporteventasComponent},
    {path:"ejecutivos/consultainactivos/",component:ConsultainactivosComponent},

    {path:"distribuidores/datoscliente",component:DatosclientesComponent},
    {path:"distribuidores/consultaprecios",component:ConsultapreciosComponent},
    {path:"distribuidores/consultapedidos",component:ConsultapedidosComponent},
    {path:"distribuidores/relacionpedidos",component:RelacionpedidosComponent},
    {path:"distribuidores/estadocuenta",component:EstadocuentaComponent},
    {path:"distribuidores/ventasclientearticulo",component:VentasclientearticuloComponent},
    {path:"distribuidores/reporteventas",component:ReporteventasComponent},

    {path:"**",component:ErrorComponent}
];


export const appRoutingProviders: any[] =[];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);