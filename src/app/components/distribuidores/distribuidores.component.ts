import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';



@Component({
  selector: 'app-distribuidores',
  templateUrl: './distribuidores.component.html',
  styleUrls: ['./distribuidores.component.css']


})
export class DistribuidoresComponent implements OnInit {

  constructor(private _route: ActivatedRoute,
    private _router: Router) { 

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
  }
}
