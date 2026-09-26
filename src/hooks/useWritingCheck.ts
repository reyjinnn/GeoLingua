import { containsWord, wordCount } from '../utils/stringValidator'

export function useWritingCheck(text: string, required: string[], minimum: number) {
  const count = wordCount(text)
  const missing = required.filter((word) => !containsWord(text, word))
  return { count, missing, ready: count >= minimum && missing.length === 0 }
}
