/**
 * dRendon 22/abr/2025 
 * Este componente no se utiliza actualmente, pero se ha dejado aquí para
 * futuras implementaciones.
 * La lógica se escribió en el componente "padre" listacfdis.component.ts
 */


import { Component, Injectable, OnInit } from '@angular/core';
import { DescargafactService } from 'src/app/services/descargafact.service';

@Injectable()

@Component({
  selector: 'app-descargafact',
  templateUrl: './descargafact.component.html',
})
export class DescargafactComponent implements OnInit {

  constructor(private descargafactService: DescargafactService) { }

  ngOnInit(): void {
  }

  descargarFactura(oCliente: any, oCfdi: any) {
    const fecha = new Date(oCfdi.Fecha);
    const mes = fecha.getMonth() + 1;     // enero = 0
    const anio = fecha.getFullYear();
    /*
        this.descargafactService.descargarFactura(oCliente, oCfdi)
          .subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FON900101R36_` + oCliente.ClienteRfc + `_` + oCfdi.Serie + `_` + oCfdi.Folio;
          })
          */

  }

}
