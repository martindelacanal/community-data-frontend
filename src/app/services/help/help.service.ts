import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(
    private http: HttpClient,
  ) { }

  uploadMessage(form: any) {
    return this.http.post(`${environment.url_api}/message`, form);
  }
}
