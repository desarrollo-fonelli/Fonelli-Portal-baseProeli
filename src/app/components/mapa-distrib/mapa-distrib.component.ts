/**
 * Controla presentación del mapa con la ubicación de distribuidores 
 * sobresalientes. Por indicaciones del Director General, se utiliza
 * la API de google-maps.
 * Creación: drendon 10.11.2025
 */
import {
  Component, OnInit, ViewChild, QueryList,
  ViewChildren, AfterViewInit, ElementRef
} from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

import { UbicacDistrib } from './mapa-distrib.modelos';
import { MapaDistribService } from './mapa-distrib.service';

@Component({
  selector: 'app-mapa-distrib',
  templateUrl: './mapa-distrib.component.html',
  styleUrls: ['./mapa-distrib.component.css']
})
export class MapaDistribComponent implements OnInit {

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;
  @ViewChild('listContainer') listContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('distribuidorMarker') mapMarkers!: QueryList<MapMarker>;

  // --- Propiedades para Datos ---
  allDistribuidores: UbicacDistrib[] = [];
  filteredDistribuidores: UbicacDistrib[] = [];
  selectedDistribuidor: UbicacDistrib | null = null;
  searchTerm: string = '';

  // --- Propiedades para el Mapa ---
  center: google.maps.LatLngLiteral = { lat: 19.432608, lng: -99.133209 }; // Centro de CDMX como fallback
  zoom = 6;
  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    mapId: 'FONELI_MAP_ID' // Opcional: para estilos personalizados desde Google Cloud
  };

  // --- Marcador de Ubicación del Usuario ---
  userLocation: google.maps.LatLngLiteral | null = null;

  userLocationMarkerOptions: google.maps.MarkerOptions = {
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  };
  // --- Marcadores de Distribuidores ---
  distribuidorMarkerOptions: google.maps.MarkerOptions = {
    // Es mejor usar una URL completa si el activo no se encuentra fácilmente.
    // O puedes usar un icono de la librería de Material Icons si la tienes.


    // azul estándar de google
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'

    // // no le gustó a Matías
    // icon: {
    //   url: `assets/marcadormapa-diamante-azul.png`,
    //   scaledSize: new google.maps.Size(32, 32),
    //   anchor: new google.maps.Point(16, 32)
    // }

    // azul personalizado cuerpo del icono
    // icon: {
    //   path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    //   fillColor: '#24a4cc',
    //   fillOpacity: 1,
    //   strokeColor: '#FFFFFF',
    //   strokeWeight: 1.5,
    //   anchor: new google.maps.Point(12, 22),
    //   scale: 1.5
    // }

  };

  // // Nuevo objeto de opciones para que se vea el punto interior en el marcador
  // distribuidorDotOptions: google.maps.MarkerOptions = {
  //   icon: {
  //     // Trazado SVG estándar para un círculo
  //     path: google.maps.SymbolPath.CIRCLE,
  //     fillColor: '#000000', // Color negro
  //     fillOpacity: 1,
  //     strokeWeight: 0, // Sin borde
  //     anchor: new google.maps.Point(0, 2.5), // Ajuste de posición vertical para centrarlo
  //     scale: 3 // Tamaño del punto (ajusta según tu gusto)
  //   },
  //   // Hacemos que el punto no sea clickeable para que el clic siempre lo reciba el pin azul
  //   clickable: false
  // };


  // --- Contenido del InfoWindow ---
  infoWindowContent = '';

  constructor(private distribuidorService: MapaDistribService) { }

  ngOnInit(): void {
    this.distribuidorService.getDistribuidores().subscribe(data => {
      this.allDistribuidores = data;
      this.filteredDistribuidores = data;

      // Intentamos ajustar el mapa aquí. Si el mapa ya está listo, funcionará.
      // Si no, ngAfterViewInit se encargará. Esto cubre ambas posibilidades.
      if (this.map && this.allDistribuidores.length > 0) {
        this.fitMapToBounds(this.allDistribuidores);
      }
    });

    this.getUserLocation();
  }

  ngAfterViewInit(): void {
    // Si los datos llegaron antes de que el mapa estuviera listo,
    // ajustamos los límites ahora que tenemos la garantía de que 'this.map' existe.
    if (this.allDistribuidores.length > 0) {
      this.fitMapToBounds(this.allDistribuidores);
    }
  }


  // --- MÉTODO PARA AJUSTAR EL MAPA ---
  private fitMapToBounds(distribuidores: UbicacDistrib[]): void {
    if (!this.map || distribuidores.length === 0) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    distribuidores.forEach(distribuidor => {
      bounds.extend({ lat: distribuidor.latitud, lng: distribuidor.longitud });
    });
    this.map.fitBounds(bounds);

    // Opcional: Añadir un poco de padding para que los marcadores no queden en el borde.
    // El valor 50 significa 50px de padding en todos los lados.
    this.map.googleMap?.setOptions({
      // Puedes ajustar el padding aquí si es necesario
      // padding: { top: 50, bottom: 50, left: 50, right: 50 }
    });
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // this.centerMapOn(this.userLocation);   ya no, ahora se muestra toda la republica mexicana
        // this.zoom = 12;
      }, () => {
        // Error al obtener ubicación, se mantiene el fallback (CDMX)
        console.warn("No se pudo obtener la ubicación del usuario.");
      });
    } else {
      console.error("Geolocalización no permitida en este navegador.");
    }
  }

  centerOnUserLocation(): void {
    if (this.userLocation) {
      this.centerMapOn(this.userLocation);
    } else {
      alert("No se puede obtener la ubicación");
    }
  }

  // filterDistribuidores(): void {
  //   const term = this.searchTerm.toLowerCase();
  //   if (!term) {
  //     this.filteredDistribuidores = this.allDistribuidores;
  //     return;
  //   }
  //   this.filteredDistribuidores = this.allDistribuidores.filter(d =>
  //     d.nombre.toLowerCase().includes(term) ||
  //     d.ciudad.toLowerCase().includes(term) ||
  //     d.entidad.toLowerCase().includes(term) ||
  //     d.domicilio.toLowerCase().includes(term)
  //   );
  // }

  filterDistribuidores(): void {
    // 1. Si no hay término de búsqueda, mostramos todo y salimos.
    if (!this.searchTerm) {
      this.filteredDistribuidores = this.allDistribuidores;
      return;
    }

    // 2. Normalizamos el término de búsqueda una sola vez para ser eficientes.
    const term = this.normalizeString(this.searchTerm);

    // 3. Filtramos la lista comparando siempre versiones normalizadas.
    this.filteredDistribuidores = this.allDistribuidores.filter(d => {
      // Concatenamos todos los campos en una sola cadena larga para buscar en todos a la vez
      // o puedes hacerlo campo por campo si prefieres más precisión.
      // Aquí normalizamos campo por campo para mayor claridad:

      const nombreNorm = this.normalizeString(d.nombre);
      const ciudadNorm = this.normalizeString(d.ciudad);
      const entidadNorm = this.normalizeString(d.entidad);
      const domicilioNorm = this.normalizeString(d.domicilio);

      return nombreNorm.includes(term) ||
        ciudadNorm.includes(term) ||
        entidadNorm.includes(term) ||
        domicilioNorm.includes(term);
    });
  }

  /**
     * Método auxiliar para normalizar texto:
     * 1. Convierte a minúsculas.
     * 2. Elimina acentos y diacríticos (á -> a, ñ -> n, ü -> u).
     */
  private normalizeString(text: string): string {
    if (!text) return '';

    return text
      .toLowerCase() // Convertir a minúsculas
      .normalize("NFD") // Descompone los caracteres (ej: 'á' se convierte en 'a' + '´')
      .replace(/[\u0300-\u036f]/g, ""); // Elimina los caracteres de acento (el rango unicode de marcas diacríticas)
  }


  openInfoWindow(marker: MapMarker, distribuidor: UbicacDistrib): void {
    this.selectedDistribuidor = distribuidor;

    // Modificación para agregar enlace "como llegar"
    const destination = `${distribuidor.latitud},${distribuidor.longitud}`;
    let directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    // Si tenemos la ubicación del usuario, la añadimos como punto de partida
    if (this.userLocation) {
      const origin = `${this.userLocation.lat},${this.userLocation.lng}`;
      directionsUrl += `&origin=${origin}`;
    }

    this.infoWindowContent = `
      <div class="map-info-window-content">
          <div class="h6 mb-1">${distribuidor.nombre}</div>
          <p class="mb-2">${distribuidor.ciudad}, ${distribuidor.entidad}</p>
          <a href="${directionsUrl}" target="_blank" rel="noopener">
            Cómo llegar
          </a>
          <p class="mb-2">${distribuidor.domicilio}</p>
      </div>`;


    this.infoWindow.open(marker);

    // Sincronizar con la lista
    const distribuidorElement = document.getElementById(`distribuidor-${this.allDistribuidores.indexOf(distribuidor)}`);
    if (distribuidorElement) {
      //distribuidorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.scrollListItemIntoView(distribuidor.id);
    }
  }

  selectDistribuidorFromList(distribuidor: UbicacDistrib, index: number): void {
    // 1. Actualiza el distribuidor seleccionado para que la lista resalte el ítem correcto.
    this.selectedDistribuidor = distribuidor;

    // 2. Obtenemos la referencia al marcador físico en el mapa.
    // Usamos el 'index' del array filtrado que estamos recorriendo en el HTML.
    const markerArray = this.mapMarkers.toArray();
    const targetMarker = markerArray[index];

    if (targetMarker && this.map) {

      // 3. Centramos el mapa
      const position = { lat: distribuidor.latitud, lng: distribuidor.longitud };
      this.map.panTo(position);

      // 3. Abrimos el InfoWindow inmediatamente.
      // El método 'openInfoWindow' ya se encarga de preparar el contenido.
      this.openInfoWindow(targetMarker, distribuidor);

      // AUNQUE openInfoWindow ya lo llama, lo ponemos aquí para asegurar
      // que la lista se desplace incluso si el popup no se abre.
      this.scrollListItemIntoView(distribuidor.id);
    }

  }

  private centerMapOn(position: google.maps.LatLngLiteral): void {
    this.map.panTo(position);
  }

  // Función trackBy para optimizar el rendimiento de *ngFor ---
  trackById(index: number, distribuidor: UbicacDistrib): number {
    return distribuidor.id;
  }

  // --- NUEVO MÉTODO PRIVADO PARA EL SCROLL ---
  private scrollListItemIntoView(distribuidorId: number): void {
    // Asegurarnos de que el contenedor y el ID existen
    if (!this.listContainer || !distribuidorId) {
      return;
    }

    const containerElement = this.listContainer.nativeElement;
    const itemElement = document.getElementById(`distribuidor-${distribuidorId}`);

    if (containerElement && itemElement) {
      // Calculamos la posición a la que debemos hacer scroll para centrar el elemento
      const containerHeight = containerElement.clientHeight;
      const itemHeight = itemElement.clientHeight;
      const itemOffsetTop = itemElement.offsetTop;

      const newScrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);

      // Usamos el método 'scrollTo' del contenedor con un efecto suave
      containerElement.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Restablece la vista del mapa para que todos los distribuidores sean visibles.
   * Este método es llamado por el nuevo botón "Vista completa".
   */
  public resetMapView(): void {
    // Simplemente reutilizamos la lógica que ya teníamos,
    // asegurándonos de pasarle la lista COMPLETA de distribuidores.
    if (this.allDistribuidores && this.allDistribuidores.length > 0) {
      this.fitMapToBounds(this.allDistribuidores);
    }
  }
}
