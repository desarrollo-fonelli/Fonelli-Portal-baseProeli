import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing,appRoutingProviders } from './app.routing';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';



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
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NgbdTablePagination } from './components/tabla/table-pagination';
import { MatSnackBarModule} from '@angular/material/snack-bar';
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
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    NgbdTablePagination,
    SearchEstadoCuentaPipe ,
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
    CatalogointeractivoComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    routing,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule 
  ],
  providers: [
    appRoutingProviders,
    BnNgIdleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
