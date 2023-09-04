import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationMap } from 'src/app/models/map/location-map';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  constructor(
    private http: HttpClient
  ) { }

  getLocationsMap() {
    return this.http.get<LocationMap>(`${environment.url_api}/map/locations`);
  }

}
