import { RegisterAnswer } from "./register-answer"

export interface RegisterQuestion{
  id: number,
  name: string,
  depends_on_question_id: number,
  depends_on_answer_id: number,
  answer_type_id: number,
  answers: RegisterAnswer[]
}
