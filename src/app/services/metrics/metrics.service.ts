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

  getFileCSV(from_date: string, to_date: string) {
    return this.http.get(`${environment.url_api}/metrics/download-csv?from_date=${from_date}&to_date=${to_date}`, { responseType: 'text' });
  }

  getQuestions(language: string, filters: any) {
    const httpOptions = {
      params: new HttpParams().set('language', language)
    };
    return this.http.post<QuestionMetrics[]>(`${environment.url_api}/metrics/questions`, filters, httpOptions);
  }
}
