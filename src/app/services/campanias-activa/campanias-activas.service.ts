import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { campActivas } from 'src/app/models/campanias-activas/campanias-activas.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class campaniasActivasService {
    constructor(
        private http: HttpClient
    ){}
    
}