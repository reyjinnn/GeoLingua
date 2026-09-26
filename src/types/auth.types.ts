export interface ActiveCourse { id: number; base_language: string; target_language: string; current_level: string }
export interface UserProfile { id: number; full_name: string; email: string; role: 'learner' | 'admin'; active_course?: ActiveCourse | null }
export interface AuthSession { token: string; user: UserProfile }
export interface LoginInput { email: string; password: string }
export interface RegisterInput extends LoginInput { full_name: string }
