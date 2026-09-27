export interface Language { id: number; code: string; name: string; native_name: string }
export interface Level { id: number; code: string; name: string; order_index: number }
export interface CourseOption { id: number; title: string; base_language_code: string; target_language_code: string }
export interface LearningPreferences { base_language_code: string; target_language_code: string; level_code: string }
export interface ModuleSummary { id: number; module_code: string; title: string; topic: string; order_index: number; status: 'locked' | 'unlocked' | 'in_progress' | 'completed'; progress_percentage: number; is_completed: boolean }
export interface LessonSummary { id: number; lesson_name: string; order_index: number; vocabulary_count: number }
export interface ModuleDetail { id: number; module_code: string; title: string; description: string; learning_objectives: string; estimated_duration_minutes: number; lessons: LessonSummary[]; quiz: { id: number; title: string; passing_score: number } }
