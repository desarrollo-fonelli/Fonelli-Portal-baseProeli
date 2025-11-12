/**
 * Servicio que llama la API REST que devuelve las ubicaciones
 * de distribuidores sobresalientes activos.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { UbicacDistrib } from './mapa-distrib.modelos';

@Injectable({
  providedIn: 'root'
})
export class MapaDistribService {

  // constructor(private http: HttpClient) { }
  // // Propuesta para obtener los datos de una API REST real
  // getDistribuidoresFromApi(): Observable<Distribuidor[]> {
  // const url = 'miapi/ubicaciones.php';
  // return this.http.get<Distribuidor[]>(url);

  private distribuidores: UbicacDistrib[] = [
    {
      "id": 1,
      "nombre": "Tiendas Departamentales CIMACO Monclova",
      "domicilio": "Paseo Monclova Blvd Harold R. Pape No. 1000 Lote 1 Fracc. Estancias de San Juan Bautista CP 25733",
      "ciudad": "Monclova",
      "entidad": "Coahuila",
      "telefono": "",
      "latitud": 26.950905204135985,
      "longitud": -101.41746821660631
    },
    {
      "id": 2,
      "nombre": "Tiendas Departamentales CIMACO Hidalgo",
      "domicilio": "Av. Hidalgo No. 399 Pte. Col. Centro C.P. 27000 Torreón, Coahuila",
      "ciudad": "Torreón",
      "entidad": "Coahuila",
      "telefono": "(871) 729-29-00",
      "latitud": 25.536772512094746,
      "longitud": -103.45349562698877
    },
    {
      "id": 3,
      "nombre": "Tiendas Departamentales CIMACO Juarez",
      "domicilio": "Av. Tecnológico No. 2701 Col. El Marquéz Local K Plaza Juárez Mall C.P. 32439  Cd. Juárez, Chihuahua",
      "ciudad": "Cd. Juárez",
      "entidad": "Chihuahua",
      "telefono": "",
      "latitud": 31.705468501931815,
      "longitud": -106.42707705606028
    },
    {
      "id": 4,
      "nombre": "Tiendas Departamentales CIMACO Plaza Cuatro Caminos",
      "domicilio": "Blvd. Independencia No. 1300 Ote. Col.Navarro C.P. 27010 Torreón, Coahuila",
      "ciudad": "Torreón",
      "entidad": "Coahuila",
      "telefono": "(871) 747-22-00",
      "latitud": 25.560491460386178,
      "longitud": -103.43342947485762
    },
    {
      "id": 5,
      "nombre": "Tiendas Departamentales CIMACO Mazatlán",
      "domicilio": "Av. Reforma No. 2206, Local R-14 Gran Plaza Mall Fracc. Alameda C.P. 82123 Mazatlán, Sinaloa",
      "ciudad": "Mazatlán",
      "entidad": "Sinaloa",
      "telefono": "(669) 989-5700",
      "latitud": 23.23867075702835,
      "longitud": -106.43857027353538
    },
    {
      "id": 6,
      "nombre": "Tiendas Departamentales CIMACO Culiacán",
      "domicilio": "Plaza Ceiba Blvd. Pedro Infante No. 3000 Col.Congreso del Estado C.P. 80100 Culiacán, Sinaloa",
      "ciudad": "Culiacán",
      "entidad": "Sinaloa",
      "telefono": "",
      "latitud": 24.79957827125014,
      "longitud": -107.42328257906108
    },
    {
      "id": 7,
      "nombre": "Tiendas Departamentales CIMACO Saltillo",
      "domicilio": "Blvd. Eulalio Gutiérrez No. 365 Patio Saltillo Esq. Blvd. Jesús Valdéz Sánchez Ex. Hacienda Los Cerritos C.P. 25010",
      "ciudad": "Saltillo",
      "entidad": "Coahuila",
      "telefono": "",
      "latitud": 25.442133194047226,
      "longitud": -100.96085672755825
    },
    {
      "id": 10,
      "nombre": "El Gran Chapur Tienda 58",
      "domicilio": "C. 58 por 63 y 65, Centro, 97000 Mérida, Yuc",
      "ciudad": "Mérida",
      "entidad": "Yucatán",
      "telefono": "",
      "latitud": 20.966096500899884,
      "longitud": -89.62217399274348
    },
    {
      "id": 11,
      "nombre": "El Gran Chapur Tienda 63",
      "domicilio": "C. 63 474, Centro, 97000 Mérida, Yuc.",
      "ciudad": "Mérida",
      "entidad": "Yucatán",
      "telefono": "",
      "latitud": 20.965631339067887,
      "longitud": -89.61999627813016
    },
    {
      "id": 12,
      "nombre": "El Gran Chapur Tienda Via Vallejo",
      "domicilio": "Prol. Paseo de Montejo, Int. Vía Montejo, Mérida, Yucatán, C.P. 97204, Plaza comercial The Harbor Mérida",
      "ciudad": "Mérida",
      "entidad": "Yucatán",
      "telefono": "",
      "latitud": 21.04664320871737,
      "longitud": -89.63013174058312
    },
    {
      "id": 13,
      "nombre": "El Gran Chapur Tienda Cancún",
      "domicilio": "Plaza Malecón Américas, Av. Bonampak Mz1 Lote 1, 77500 Cancún, Q.R.",
      "ciudad": "Cancún",
      "entidad": "Quintana Roo",
      "telefono": "",
      "latitud": 21.148325045738247,
      "longitud": -86.82269749799939
    },
    {
      "id": 14,
      "nombre": "El Gran Chapur Tienda Norte",
      "domicilio": "C. 31 No. 106, entre Calle 26, Col. México, 97100 Mérida, Yuc.",
      "ciudad": "Mérida",
      "entidad": "Yucatán",
      "telefono": "",
      "latitud": 20.99780137467176,
      "longitud": -89.61333728885354
    },
    {
      "id": 20,
      "nombre": "Joyería Esmeralda",
      "domicilio": "JOSE MARIA PARAS Ext. 802 Int. 311 MONTERREY CENTRO, MONTERREY, NUEVO LEON, C.P. 64000",
      "ciudad": "Monterrey",
      "entidad": "Nuevo León",
      "telefono": "",
      "latitud": 25.66791954148419,
      "longitud": -100.3128318057426
    },
    {
      "id": 21,
      "nombre": "Joyas Diaro Suc. Morelos",
      "domicilio": "JOSE MARIA MORELOS Y PAVON No. 142 MONTERREY CENTRO, MONTERREY, NUEVO LEON, C.P. 64000",
      "ciudad": "Monterrey",
      "entidad": "Nuevo León",
      "telefono": "",
      "latitud": 25.667621353698966,
      "longitud": -100.31602243757105
    },
    {
      "id": 22,
      "nombre": "Joyas Diaro Suc. San Agustín",
      "domicilio": "REAL SAN AGUSTIN 314 E-5 ZONA SAN AGUSTIN, SAN PEDRO GARZA GARCIA, NUEVO LEON, C.P. 66260",
      "ciudad": "San Pedro Garza García",
      "entidad": "Nuevo León",
      "telefono": "",
      "latitud": 25.650470707708816,
      "longitud": -100.33842572938819
    },
    {
      "id": 23,
      "nombre": "Joyas Diaro Suc. San Jerónimo",
      "domicilio": "ROGELIO CANTU GOMEZ 900 LOCAL 6 COLINAS DE SAN JERONIMO, MONTERREY, NUEVO LEON, C.P. 64630",
      "ciudad": "Monterrey",
      "entidad": "Nuevo León",
      "telefono": "",
      "latitud": 25.694626029519313,
      "longitud": -100.37969117057033
    },


    {
      "id": 40,
      "nombre": "DANA Joyas",
      "domicilio": "FRANCISCO I. MADERO 59 LOCAL 15 CENTRO DE LA CIUDAD DE MEXICO AREA 1, CUAUHTEMOC CIUDAD DE MEXICO, C.P. 06000",
      "ciudad": "Ciudad de México",
      "entidad": "CDMX",
      "telefono": "",
      "latitud": 19.43326459114066,
      "longitud": -99.13541273753047
    },
    {
      "id": 41,
      "nombre": "Joyería Victoria",
      "domicilio": "FRANCISCO I MADERO 69 LOCAL 5  CENTRO DE LA CIUDAD DE MEXICO AREA 1, CUAUHTEMOC CIUDAD DE MEXICO, C.P. 06000",
      "ciudad": "Ciudad de México",
      "entidad": "CDMX",
      "telefono": "",
      "latitud": 19.43306452291659,
      "longitud": -99.13473569603148
    },


    {
      "id": 60,
      "nombre": "Joyería D Karen",
      "domicilio": "PASEO DEL HOSPICIO 22 2089  SAN JUAN DE DIOS, GUADALAJARA, JALISCO, C.P. 44360",
      "ciudad": "Guadalajara",
      "entidad": "Jalisco",
      "telefono": "",
      "latitud": 20.67644002564257,
      "longitud": -103.34074641589075
    },
    {
      "id": 61,
      "nombre": "PAULETTE JOYAS",
      "domicilio": "PASEO DEL HOSPICIO 22 LOCAL 2006  SAN JUAN DE DIOS, GUADALAJARA, JALISCO, C.P. 44360",
      "ciudad": "Guadalajara",
      "entidad": "Jalisco",
      "telefono": "",
      "latitud": 20.676437074858978,
      "longitud": -103.34074724155897
    },
    {
      "id": 62,
      "nombre": "PAULETTE JOYAS",
      "domicilio": "PASEO DEL HOSPICIO 65 R SAN JUAN DE DIOS, GUADALAJARA, JALISCO, C.P. 44360",
      "ciudad": "Guadalajara",
      "entidad": "Jalisco",
      "telefono": "",
      "latitud": 20.67716199071198,
      "longitud": -103.33906937324205
    },
    {
      "id": 63,
      "nombre": "Joyería y Regalos Casa Valencia",
      "domicilio": "FEDERICO DEL TORO 166 CIUDAD GUZMAN CENTRO, ZAPOTLAN EL GRANDE CIUDAD GUZMAN, JALISCO, C.P. 49000",
      "ciudad": "Ciudad Guzmán",
      "entidad": "Jalisco",
      "telefono": "",
      "latitud": 19.707491834157306,
      "longitud": -103.46331907054149
    },

  ];

  getDistribuidores(): Observable<UbicacDistrib[]> {
    return of(this.distribuidores);
  }

}
