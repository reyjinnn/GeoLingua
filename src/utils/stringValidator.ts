export function wordCount(text: string): number { return text.trim() ? text.trim().split(/\s+/u).length : 0 }
export function containsWord(text: string, word: string): boolean {
  const words: string[] = text.toLocaleLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []
  return words.includes(word.toLocaleLowerCase())
}
