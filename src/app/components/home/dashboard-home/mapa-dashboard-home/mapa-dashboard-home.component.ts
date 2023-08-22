import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { mapStyle } from 'src/app/models/mapa/map-styles';

@Component({
  selector: 'app-mapa-dashboard-home',
  templateUrl: './mapa-dashboard-home.component.html',
  styleUrls: ['./mapa-dashboard-home.component.scss']
})
export class MapaDashboardHomeComponent {

  @ViewChild('map') map: GoogleMap;
  @ViewChild('misionesDisponiblesButton') misionesDisponiblesButton: ElementRef;
  @ViewChild('misionesActivasButton') misionesActivasButton: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  mapStyle = mapStyle;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 34.84875916361835, lng: -117.36738960238455 }, // TO-DO buscar punto medio entre todas las coordenadas y colocar ese como centro
    zoom: 7,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
    },
    // styles: this.mapStyle
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: { position: google.maps.LatLngLiteral; label: string }[] = [
    { position: { lat: 35.75883296922264, lng: -117.37720911870885 }, label: 'Trona Senior Center' },
    { position: { lat: 34.05617481273772, lng: -117.17576132689786 }, label: 'Inland Empire Filipino SDA Church' },
    { position: { lat: 34.10424814861694, lng: -117.25626850216977 }, label: 'SAC Norton Clinic' },
    { position: { lat: 33.887156272643956, lng: -117.23245203066774 }, label: 'Moreno Valley Church' },
    { position: { lat: 33.748879156137484, lng: -116.99008197478759 }, label: 'Hemet Spanish SDA Church' },
    { position: { lat: 33.72851890691869, lng: -116.95461367337498 }, label: 'Hemet SDA Church' },
    { position: { lat: 33.83843555621586, lng: -117.28731680809182 }, label: 'The Concerned Family Ministry' },
    { position: { lat: 33.961218824926135, lng: -117.40821484723955 }, label: 'Riverside Community Church' },
  ];
  infoContent = '';

  constructor() { }

  ngAfterViewInit() {
    // Obtener una referencia al objeto map
    let map = this.map.googleMap;
    // Obtener una referencia a los botones personalizados
    let misionesDisponiblesButton = this.misionesDisponiblesButton.nativeElement;
    let misionesActivasButton = this.misionesActivasButton.nativeElement;
    // Agregar los botones personalizados al mapa como controles
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(misionesDisponiblesButton);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(misionesActivasButton);
  }

  openInfoWindow(marker: MapMarker, label: string) {
    this.infoContent = label;
    if (this.infoWindow != undefined) {
      this.infoWindow.open(marker);
    }
  }
}
