import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { LocationMap } from 'src/app/models/map/location-map';
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
  @Input() selectedLocationsPoints: LocationMap = { center: { lat: 0, lng: 0 }, locations: [] };
  @Input() locationsEnabled: boolean;
  @Input() fullLocationsMap: boolean = false;
  @Input() disableButtonsLocations: boolean = false;

  mapStyle = mapStyle;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 34.11390359586909, lng: -117.29533790728009 },
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocationsId']) {
      this.getLocationsMap();
    } else {
      if (changes['selectedLocationsPoints']) {
        this.getLocationsMapPoints();
      }
    }
  }

  ngOnInit(): void {
    if (this.fullLocationsMap) {
      this.getLocationsMap();
    }
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

  getEnabledLocations() {
    this.locationsEnabled = true;
    this.getLocationsMap();
  }

  getTotalLocations() {
    this.locationsEnabled = undefined;
    this.getLocationsMap();
  }

  private getLocationsMapPoints() {
    if (this.selectedLocationsPoints.locations.length > 0) {  // Si ya se tienen las coordenadas
      this.markerPositions = this.selectedLocationsPoints.locations;
      this.mapOptions = {
        ...this.mapOptions,
        center: this.selectedLocationsPoints.center
      };
    } else {
      this.markerPositions = [];
    }
  }

  private getLocationsMap() {
    this.googleMapService.getLocationsMap(this.selectedLocationsId, this.locationsEnabled).subscribe({
      next: (res) => {
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
