import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { mapStyle } from 'src/app/models/map/map-styles';
import { GoogleMapService } from 'src/app/services/map/google-map.service';

@Component({
  selector: 'app-mapa-dashboard-home',
  templateUrl: './mapa-dashboard-home.component.html',
  styleUrls: ['./mapa-dashboard-home.component.scss']
})
export class MapaDashboardHomeComponent implements OnInit {

  @ViewChild('map') map: GoogleMap;
  @ViewChild('misionesDisponiblesButton') misionesDisponiblesButton: ElementRef;
  @ViewChild('misionesActivasButton') misionesActivasButton: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  @Input() selectedLocationsId: string[] = [];
  @Input() locationsEnabled: boolean;

  mapStyle = mapStyle;
  mapOptions: google.maps.MapOptions = {
    center: {lat: 34.84875916361835, lng: -117.36738960238455},
    zoom: 6,
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
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: { position: google.maps.LatLngLiteral; label: string }[] = [];
  infoContent = '';

  constructor(
    private googleMapService: GoogleMapService
  ) { }

  ngOnInit(): void {
    this.getLocationsMap();
  }

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

  private getLocationsMap() {
    this.googleMapService.getLocationsMap(this.selectedLocationsId, this.locationsEnabled).subscribe({
      next: (res) => {
        console.log("res", res)
        if (res.center.lat === 0 && res.center.lng === 0) {
          this.markerPositions = [];
          return;
        } else {
          this.markerPositions = res.locations;
          this.mapOptions = {
            ...this.mapOptions,
            center: res.center
          };
        }
      },
      error: (error) => {
        console.log(error);
        this.markerPositions = [];
      }
    });
  }
}
