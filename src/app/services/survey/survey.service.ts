import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SurveyModifyCheckbox } from 'src/app/models/survey/survey-modify-checkbox';
import { SurveyQuestion } from 'src/app/models/survey/survey-question';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(
    private http: HttpClient
  ) { }

  getSurveyQuestions(language: string) {
    return this.http.get<SurveyQuestion[]>(`${environment.url_api}/survey/questions?language=${language}`);
  }

  postToggleCheckbox(objectToModify: SurveyModifyCheckbox) {
    return this.http.post(`${environment.url_api}/survey/modify-checkbox`, objectToModify);
  }
}
