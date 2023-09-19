import { HttpClient } from '@angular/common/http';
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

  getFileCSV() {
    return this.http.get(`${environment.url_api}/download-csv`, { responseType: 'text' });
  }

  getQuestions(language: string, locationId?: string) {
    return this.http.get<QuestionMetrics[]>(`${environment.url_api}/metrics/questions/${locationId}?language=${language}`);
  }

}
