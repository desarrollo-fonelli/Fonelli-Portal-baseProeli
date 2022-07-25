import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import { TemplateLlamada, TemplatePortal } from 'src/app/models/template';

//Servicios
import { ServicioTemplate } from 'src/app/services/template.service';


@Component({
  selector: 'app-distribuidores',
  templateUrl: './distribuidores.component.html',
  styleUrls: ['./distribuidores.component.css'],
  providers:[ServicioTemplate]


})
export class DistribuidoresComponent implements OnInit {
  mobileQuery: MediaQueryList;
  oTemplate: TemplatePortal; 
  oTemplateLlamada: TemplateLlamada; 


  private _mobileQueryListener: () => void;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private _servicioTemplate: ServicioTemplate) { 

      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
      this.oTemplate = {} as TemplatePortal;
      this.oTemplateLlamada = {} as TemplateLlamada;
    }
  

  ngOnInit(): void {

    const sCodigo :number | null = Number(sessionStorage.getItem('codigo'));
    const sTipo :string | null = sessionStorage.getItem('tipo');
    const sFilial :number | null = Number(sessionStorage.getItem('filial'));
    const sNombre :string | null = sessionStorage.getItem('nombre');


    //Se agrega validacion control de sesion distribuidores
    if(!sCodigo) {
      console.log('ingresa VALIDACION');
      this._router.navigate(['/']);
    }

    this._servicioTemplate    
    .Get()
    .subscribe(
      (Response: TemplateLlamada) => {

        console.log(Response);

        this.oTemplateLlamada = Response;       
               

        if(this.oTemplateLlamada.Codigo != 0){
         console.log("Error 1");
          return;
        }

       this.oTemplate = this.oTemplateLlamada.Contenido;
  

      },
      (error:TemplateLlamada) => {

        console.log("Error 2");
      
      }
    );
  }
}
