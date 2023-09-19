export interface QuestionMetrics {
  question_id: number,
  question: string,
  answers: {
    answer_id: number,
    answer: string,
    total: number
  }[]
}
