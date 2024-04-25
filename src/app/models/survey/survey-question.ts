import { SurveyAnswer } from "./survey-answer"
import { SurveyLocation } from "./survey-location"

export interface SurveyQuestion {
  id: number,
  name: string,
  name_es: string,
  depends_on_question_id: number,
  depends_on_answer_id: number,
  answer_type_id: number,
  answer_type: string,
  enabled: string,
  loading: string,
  answers: SurveyAnswer[],
  locations: SurveyLocation[]
}
