'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getHistory } from '@/lib/api'
import { HistoryItem } from '@/lib/types'

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const scoreColor = (s: number) =>
    s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">分析履歴</h1>
        <Link href="/analyze" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
          新しく分析する
        </Link>
      </div>

      {loading && <p className="text-gray-400 text-center py-10">読み込み中...</p>}
      {error && <p className="text-red-500 text-center py-10">{error}</p>}

      {!loading && history.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-4">まだ分析履歴がありません</p>
          <Link href="/analyze" className="text-indigo-600 hover:underline">
            最初の分析を始める
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {history.map((item) => (
          <Link key={item.analysis_id} href={`/result/${item.analysis_id}`}>
            <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700 truncate max-w-xs">{item.file_name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleString('ja-JP')}
                  {' · '}
                  {item.duration_sec.toFixed(0)}秒
                </p>
              </div>
              <div className={`text-2xl font-bold ${scoreColor(item.overall_score)}`}>
                {item.overall_score}
                <span className="text-sm font-normal text-gray-400 ml-1">点</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
