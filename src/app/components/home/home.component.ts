import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
declare let AOS: any;

//Modelos
import {TemplateLlamada , TemplatePortal } from 'src/app/models/template';

//Servicios
import { ServicioTemplate } from 'src/app/services/template.service';

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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private _servicioTemplate: ServicioTemplate) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.oTemplate = {} as TemplatePortal;
    this.oTemplateLlamada = {} as TemplateLlamada;
  }

  ngOnInit(): void {
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