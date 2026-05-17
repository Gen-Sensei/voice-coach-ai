import { AnalysisResult, HistoryItem } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function analyzeAudio(
  file: File,
  taskType: string = 'reading',
  promptText?: string
): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('task_type', taskType)
  if (promptText) formData.append('prompt_text', promptText)

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || '分析に失敗しました。')
  }

  return res.json()
}

export async function getHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/api/history`)
  if (!res.ok) throw new Error('履歴の取得に失敗しました。')
  return res.json()
}

export async function getResult(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/api/result/${id}`)
  if (!res.ok) throw new Error('結果の取得に失敗しました。')
  return res.json()
}
