import { useState } from 'react'
import type { DrillQuestion, DrillResult } from '../types/learning.types'
import { learningApi } from '../api/learningApi'

export function useDrillEngine(questions: DrillQuestion[]) {
  const [index, setIndex] = useState(0)
  const [result, setResult] = useState<DrillResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const question = questions[index]
  async function check(answer: string) {
    if (!question || checking) return
    setChecking(true); setError('')
    try { setResult(await learningApi.answerDrill(question.id, answer)) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Jawaban gagal diperiksa.') }
    finally { setChecking(false) }
  }
  function next() { setResult(null); setIndex((current) => Math.min(current + 1, questions.length)) }
  return { question, index, result, checking, error, check, next, done: index >= questions.length }
}
