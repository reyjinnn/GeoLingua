export function formatPercent(value: number): string { return `${Math.max(0, Math.min(100, Math.round(value)))}%` }
