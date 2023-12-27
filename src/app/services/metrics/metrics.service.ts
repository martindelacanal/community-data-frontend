import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuestionMetrics } from 'src/app/models/metrics/question-metrics';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(
    private http: HttpClient
  ) { }

  getFileCSV(filters: any) {
    return this.http.post(`${environment.url_api}/metrics/download-csv`, filters, { responseType: 'text' });
  }

  getQuestions(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<QuestionMetrics[]>(`${environment.url_api}/metrics/questions`, filters, httpOptions);
  }
}
