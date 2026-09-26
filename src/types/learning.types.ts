export interface VocabularyItem { id: number; word: string; pronunciation: string; part_of_speech: string; difficulty: string; translation: string; definition: string; example_sentence: string; example_translation: string }
export interface AnswerOption { id: number; text: string }
export interface DrillQuestion { id: number; question_type: 'mcq_meaning' | 'typing'; prompt: string; options?: AnswerOption[]; placeholder?: string }
export interface DrillResult { is_correct: boolean; correct_answer: string; explanation: string }
export interface WritingPrompt { id: number; instruction: string; writing_prompt: string; required_vocabulary: string[]; minimum_words: number }
export interface WritingResult { passed_validation: boolean; word_count: number; missing_required_words: string[]; benchmark_answer: string; evaluation_guide: string }
export interface QuizQuestion { id: number; question_text: string; options: AnswerOption[] }
export interface ModuleQuiz { quiz_id: number; title: string; passing_score: number; questions: QuizQuestion[] }
export interface QuizResult { score: number; passing_score: number; is_passed: boolean; next_module_unlocked: boolean; unlocked_module_id: number | null }
