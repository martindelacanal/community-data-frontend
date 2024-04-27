import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnswerType } from 'src/app/models/survey/answer-type';
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

  getAnswerTypes(){
    return this.http.get<AnswerType[]>(`${environment.url_api}/answer-types`);
  }

  postToggleCheckbox(objectToModify: SurveyModifyCheckbox) {
    return this.http.post(`${environment.url_api}/survey/modify-checkbox`, objectToModify);
  }

  postSurveyAnswer(surveyAnswerForm: any) {
    return this.http.post(`${environment.url_api}/survey/answer`, surveyAnswerForm);
  }

  postSurveyLocation(surveyLocationForm: any) {
    return this.http.post(`${environment.url_api}/survey/location`, surveyLocationForm);
  }

  postSurveyQuestion(surveyQuestionForm: any) {
    return this.http.post(`${environment.url_api}/survey/question`, surveyQuestionForm);
  }

}
