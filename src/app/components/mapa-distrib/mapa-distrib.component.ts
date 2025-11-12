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
    // icon: './assets/fonelli-diamante.ico' // Angular puede tener problemas con .ico
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  };

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

  filterDistribuidores(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredDistribuidores = this.allDistribuidores;
      return;
    }

    this.filteredDistribuidores = this.allDistribuidores.filter(d =>
      d.nombre.toLowerCase().includes(term) ||
      d.ciudad.toLowerCase().includes(term) ||
      d.entidad.toLowerCase().includes(term) ||
      d.domicilio.toLowerCase().includes(term)
    );
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
}
