import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgeMetrics } from 'src/app/models/metrics/age-metrics';
import { EmailMetrics } from 'src/app/models/metrics/email-metrics';
import { EthnicityMetrics } from 'src/app/models/metrics/ethnicity-metrics';
import { GenderMetrics } from 'src/app/models/metrics/gender-metrics';
import { HouseholdMetrics } from 'src/app/models/metrics/household-metrics';
import { KindOfProductMetrics } from 'src/app/models/metrics/kindOfProduct-metrics';
import { PhoneMetrics } from 'src/app/models/metrics/phone-metrics';
import { PoundsPerLocationMetrics } from 'src/app/models/metrics/poundsPerLocation-metrics';
import { PoundsPerProductMetrics } from 'src/app/models/metrics/poundsPerProduct-metrics';
import { QuestionMetrics } from 'src/app/models/metrics/question-metrics';
import { ReachMetrics } from 'src/app/models/metrics/reach-metrics';
import { RegisterMetrics } from 'src/app/models/metrics/register-metrics';
import { TotalPoundsMetrics } from 'src/app/models/metrics/totalPounds-metrics';
import { VolunteerLocationMetrics } from 'src/app/models/metrics/volunteer-location-metrics';
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

  getGenderVolunteerMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<GenderMetrics[]>(`${environment.url_api}/metrics/volunteer/gender`, filters, httpOptions);
  }

  getEthnicityVolunteerMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<EthnicityMetrics[]>(`${environment.url_api}/metrics/volunteer/ethnicity`, filters, httpOptions);
  }

  getLocationVolunteerMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<VolunteerLocationMetrics>(`${environment.url_api}/metrics/volunteer/location`, filters, httpOptions);
  }

  getAgeVolunteerMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<AgeMetrics>(`${environment.url_api}/metrics/volunteer/age`, filters, httpOptions);
  }

  getRegisterHistoryMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<TotalPoundsMetrics>(`${environment.url_api}/metrics/participant/register_history`, filters, httpOptions);
  }

  getLocationNewRecurringMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<TotalPoundsMetrics>(`${environment.url_api}/metrics/participant/location_new_recurring`, filters, httpOptions);
  }

  getRegisterMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<RegisterMetrics>(`${environment.url_api}/metrics/participant/register`, filters, httpOptions);
  }

  getEmailMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<EmailMetrics[]>(`${environment.url_api}/metrics/participant/email`, filters, httpOptions);
  }

  getPhoneMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<PhoneMetrics[]>(`${environment.url_api}/metrics/participant/phone`, filters, httpOptions);
  }

  getReachMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<ReachMetrics>(`${environment.url_api}/metrics/product/reach`, filters, httpOptions);
  }

  getTotalPoundsMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<TotalPoundsMetrics>(`${environment.url_api}/metrics/product/total_pounds`, filters, httpOptions);
  }

  getNumberOfTripsMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<TotalPoundsMetrics>(`${environment.url_api}/metrics/product/number_of_trips`, filters, httpOptions);
  }

  getKindOfProductMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<KindOfProductMetrics[]>(`${environment.url_api}/metrics/product/kind_of_product`, filters, httpOptions);
  }

  getPoundsPerLocationMetrics(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<PoundsPerLocationMetrics>(`${environment.url_api}/metrics/product/pounds_per_location`, filters, httpOptions);
  }

  getPoundsPerProductMetrics(language: string, filters: any, page: number) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<PoundsPerProductMetrics>(`${environment.url_api}/metrics/product/pounds_per_product?page=${page}`, filters, httpOptions);
  }
}
