import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './components/modal/modal.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { DistribuidoresComponent } from './components/distribuidores/distribuidores.component';
import { EjecutivosComponent } from './components/ejecutivos/ejecutivos.component';
import { IndicadoresventaComponent } from './components/indicadoresventa/indicadoresventa.component';
import { DatosclientesComponent } from './components/datosclientes/datosclientes.component';
import { ConsultapreciosComponent } from './components/consultaprecios/consultaprecios.component';
import { ConsultapedidosComponent } from './components/consultapedidos/consultapedidos.component';
import { RelacionpedidosComponent } from './components/relacionpedidos/relacionpedidos.component';
import { EstadocuentaComponent } from './components/estadocuenta/estadocuenta.component';
import { FichatecnicaComponent } from './components/fichatecnica/fichatecnica.component';
import { VentasarticuloComponent } from './components/ventasarticulo/ventasarticulo.component';
import { VentasclientearticuloComponent } from './components/ventasclientearticulo/ventasclientearticulo.component';
import { ReporteventasComponent } from './components/reporteventas/reporteventas.component';
import { ConsultainactivosComponent } from './components/consultainactivos/consultainactivos.component';
import { GuiasComponent } from './components/guias/guias.component';
import { OrdnretornoComponent } from './components/ordnretorno/ordnretorno.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './components/sidenav/sidenav.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service
import { AdminComponent } from "./components/admin/admin.component";
import { PaneladminComponent } from "./components/paneladmin/paneladmin.component";
import { TemplateComponent } from "./components/template/template.component";
import { CatalogointeractivoComponent } from './components/catalogointeractivo/catalogointeractivo.component';

//Pipes
import { SearchEstadoCuentaPipe } from './pipes/estadocuenta.pipe';
import { SearchConsultaPedidoPipe } from './pipes/consultapedidos.pipe';
import { SearchRelacionPedidosPipe } from './pipes/relacionpedidos.pipe';
import { SearchVentasClienteArticuloPipe } from './pipes/ventasclientearticulo.pipe';
import { SearchConsultaClientePipe } from './pipes/consultaBusquedaCliente.pipe';
import { SearchConsultaClientesInacPipe } from './pipes/consultaClientesInactivos.pipe';
import { PdfComponent } from './components/pdf/pdf.component';
import { InicioadminComponent } from './components/inicioadmin/inicioadmin.component';
import { EncabezadoComponent } from './components/encabezado/encabezado.component';

import { ServicioRelacionPedidoDet } from './services/relacionPedidosDet.service';
import { ListacfdisComponent } from './components/listacfdis/listacfdis.component';
import { DescargafactComponent } from './components/descargafact/descargafact.component';
import { ConsultaexistenciasComponent } from './components/consultaexistencias/consultaexistencias.component';
import { PedclteListaComponent } from './components/pedclte-lista/pedclte-lista.component';
import { PedclteMedidasComponent } from './components/pedclte-medidas/pedclte-medidas.component';
import { TestdrComponent } from './components/testdr/testdr.component';
import { Testdr2Component } from './components/testdr2/testdr2.component';
import { PedclteArticfactComponent } from './components/pedclte-articfact/pedclte-articfact.component';
import { Guias2025Component } from './components/guias2025/guias2025.component';
import { DocumArticulosComponent } from './components/docum-articulos/docum-articulos.component';
import { OrdretoarticulosComponent } from './components/ordnretorno/ordretoarticulos.component';
import { CotizacionComponent } from './components/cotizacion/cotizacion.component';
import { ArticulosReporteComponent } from './components/articulos-reporte/articulos-reporte.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    ErrorComponent,
    HomeComponent,
    DistribuidoresComponent,
    EjecutivosComponent,
    IndicadoresventaComponent,
    DatosclientesComponent,
    ConsultapreciosComponent,
    ConsultapedidosComponent,
    RelacionpedidosComponent,
    EstadocuentaComponent,
    FichatecnicaComponent,
    VentasarticuloComponent,
    VentasclientearticuloComponent,
    ReporteventasComponent,
    ConsultainactivosComponent,
    GuiasComponent,
    OrdnretornoComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    SearchEstadoCuentaPipe,
    SearchConsultaPedidoPipe,
    SearchRelacionPedidosPipe,
    SearchVentasClienteArticuloPipe,
    PdfComponent,
    SearchConsultaClientePipe,
    AdminComponent,
    PaneladminComponent,
    TemplateComponent,
    InicioadminComponent,
    SearchConsultaClientesInacPipe,
    CatalogointeractivoComponent,
    EncabezadoComponent,
    ListacfdisComponent,
    DescargafactComponent,
    ConsultaexistenciasComponent,
    PedclteListaComponent,
    PedclteMedidasComponent,
    TestdrComponent,
    Testdr2Component,
    PedclteArticfactComponent,
    Guias2025Component,
    DocumArticulosComponent,
    OrdretoarticulosComponent,
    CotizacionComponent,
    ArticulosReporteComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    DataTablesModule
  ],
  providers: [
    appRoutingProviders,
    BnNgIdleService,
    ServicioRelacionPedidoDet
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
