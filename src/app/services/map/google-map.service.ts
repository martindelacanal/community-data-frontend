import { HttpClient, HttpParams } from '@angular/common/http';
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

  getLocationsMap(selectedLocationsId: string[], locationsEnabled: boolean){
    let params = new HttpParams();
    if (selectedLocationsId.length > 0) {
      params = params.append('ids', selectedLocationsId.join(','));
    }
    // si no se manda el locationsEnabled no se filtra por este campo, se trae todos los registros
    if (locationsEnabled !== undefined) {
      if (locationsEnabled === true) {
        params = params.append('enabled', 'Y');
      } else {
        params = params.append('enabled', 'N');
      }
    }
    console.log(params);
    return this.http.get<LocationMap>(`${environment.url_api}/map/locations`, { params });
  }

}
