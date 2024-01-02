import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgeMetrics } from 'src/app/models/metrics/age-metrics';
import { EthnicityMetrics } from 'src/app/models/metrics/ethnicity-metrics';
import { GenderMetrics } from 'src/app/models/metrics/gender-metrics';
import { HouseholdMetrics } from 'src/app/models/metrics/household-metrics';
import { QuestionMetrics } from 'src/app/models/metrics/question-metrics';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(
    private http: HttpClient
  ) { }

  getHealthFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/metrics/health/download-csv`, filters, { responseType: 'text' });
  }
  getDemographicFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/metrics/demographic/download-csv`, filters, { responseType: 'text' });
  }

  getQuestions(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<QuestionMetrics[]>(`${environment.url_api}/metrics/health/questions`, filters, httpOptions);
  }

  getGenderMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<GenderMetrics[]>(`${environment.url_api}/metrics/demographic/gender`, filters, httpOptions);
  }

  getEthnicityMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<EthnicityMetrics[]>(`${environment.url_api}/metrics/demographic/ethnicity`, filters, httpOptions);
  }

  getHouseholdMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<HouseholdMetrics>(`${environment.url_api}/metrics/demographic/household`, filters, httpOptions);
  }

  getAgeMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<AgeMetrics>(`${environment.url_api}/metrics/demographic/age`, filters, httpOptions);
  }
}
