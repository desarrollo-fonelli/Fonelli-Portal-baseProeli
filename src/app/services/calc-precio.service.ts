/**
 * Este servicio usa una interface para recibir los parámetros usados
 * en la rutina de cálculo y otra interface para devolver el precio calculado
 * y otros datos complementarios, de esta forma puede ser llamado desde
 * componentes diferentes manteniendo los datos de entrada y retorno
 * consistentes sin importar su orígen o uso.
 */

import { Injectable } from '@angular/core';

import { CalcPrecParam } from 'src/app/models/calc-prec-param'
import { CalcPrecResponse } from 'src/app/models/calc-prec-response'

@Injectable({
  providedIn: 'root'
})
export class CalcPrecioService {

  constructor(
    private oParam: CalcPrecParam,
    private oResponse: CalcPrecResponse) { }
}
