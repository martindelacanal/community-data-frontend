import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(
    private http: HttpClient
  ) { }

  getFileCSV() {
    return this.http.get(`${environment.url_api}/download-csv`, { responseType: 'text' });
  }

}
