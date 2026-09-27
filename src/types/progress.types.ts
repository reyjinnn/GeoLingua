export interface QuizAttempt {
  id: number
  module_id: number
  module_code: string
  module_title: string
  score: number
  is_passed: boolean
  attempted_at: string
}

export interface ProgressSummary {
  vocabulary_from_completed_modules: number
  completed_modules: number
  average_quiz_score: number | null
  quiz_attempts: QuizAttempt[]
}
