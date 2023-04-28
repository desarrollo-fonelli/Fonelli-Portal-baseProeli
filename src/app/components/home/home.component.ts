import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
declare let AOS: any;

// dRendon 28.04.2023
declare var require: any;


//Modelos
import {TemplateLlamada , TemplatePortal } from 'src/app/models/template';

//Servicios
import { ServicioTemplate } from 'src/app/services/template.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ServicioTemplate]
})
export class HomeComponent implements OnInit {

  mobileQuery: MediaQueryList;
  oTemplate: TemplatePortal; 

  oTemplateLlamada: TemplateLlamada; 

  private _mobileQueryListener: () => void;

  //dRendon 28.04.2023
  private config: {version: string};

  // dRendon 28.04.2023 - se agrega private httpClient: HttpClient
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _servicioTemplate: ServicioTemplate,private httpClient: HttpClient) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.oTemplate = {} as TemplatePortal;
    this.oTemplateLlamada = {} as TemplateLlamada;
  }

  ngOnInit(): void {

    // ---- dRendon 28.04.2023
    this.config = require('src/assets/config.json');
    console.log(this.config.version);

    const headers = new HttpHeaders()
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');

    this.httpClient
      .get<{ version: string }>("/assets/config.json",{headers})
      .subscribe(config => {
        if(config.version !== this.config.version) {          
          location.reload();
          console.log('Se cargo la versión:', this.config.version);
        }
      })
    // ---- Fin dRendon 28.04.2023


    this.mobileQuery.removeListener(this._mobileQueryListener);
    AOS.init();

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