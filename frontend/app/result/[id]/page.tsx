'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getResult } from '@/lib/api'
import { AnalysisResult } from '@/lib/types'
import ScoreCard from '@/components/ScoreCard'
import MetricCard from '@/components/MetricCard'
import ResultChart from '@/components/ResultChart'
import CommentSection from '@/components/CommentSection'

export default function ResultPage() {
  const { id } = useParams<{ id: string }>()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getResult(id).then(setResult).catch((e) => setError(e.message))
  }, [id])

  if (error) return (
    <div className="max-w-2xl mx-auto text-center py-20 text-red-500">{error}</div>
  )
  if (!result) return (
    <div className="max-w-2xl mx-auto text-center py-20 text-gray-400">読み込み中...</div>
  )

  const fmt = (v: number | null, d = 1) => v != null ? v.toFixed(d) : '—'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">分析結果</h1>
        <Link href="/analyze" className="text-sm text-indigo-600 hover:underline">
          もう一度分析する
        </Link>
      </div>

      <ScoreCard overall={result.scores.overall} summary={result.comments.summary} />

      <ResultChart scores={result.scores} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          title="基本情報"
          color="indigo"
          items={[
            { label: '音声長', value: fmt(result.duration_sec), unit: '秒' },
            { label: '発話時間', value: fmt(result.basic.speech_sec), unit: '秒' },
            { label: '無音時間', value: fmt(result.basic.silence_sec), unit: '秒' },
            { label: '発話率', value: fmt(result.basic.speech_ratio * 100), unit: '%' },
          ]}
        />
        <MetricCard
          title="ピッチ（声の高さ）"
          color="purple"
          items={[
            { label: '平均', value: fmt(result.pitch.mean_hz), unit: 'Hz' },
            { label: '最低', value: fmt(result.pitch.min_hz), unit: 'Hz' },
            { label: '最高', value: fmt(result.pitch.max_hz), unit: 'Hz' },
            { label: '変動幅', value: fmt(result.pitch.range_hz), unit: 'Hz' },
          ]}
        />
        <MetricCard
          title="音量"
          color="green"
          items={[
            { label: '平均音量', value: fmt(result.intensity.mean_db), unit: 'dB' },
            { label: '最小音量', value: fmt(result.intensity.min_db), unit: 'dB' },
            { label: '最大音量', value: fmt(result.intensity.max_db), unit: 'dB' },
            { label: '変動（標準偏差）', value: fmt(result.intensity.std_db), unit: 'dB' },
          ]}
        />
        <MetricCard
          title="間・無音"
          color="orange"
          items={[
            { label: '無音回数', value: result.silence.count, unit: '回' },
            { label: '長い無音', value: result.silence.long_count, unit: '回' },
            { label: '平均無音時間', value: fmt(result.silence.avg_sec), unit: '秒' },
            { label: '最長無音', value: fmt(result.silence.max_sec), unit: '秒' },
          ]}
        />
      </div>

      {result.voice_quality.hnr_db != null && (
        <MetricCard
          title="声質"
          color="indigo"
          items={[
            { label: 'HNR（声のクリアさ）', value: fmt(result.voice_quality.hnr_db), unit: 'dB' },
          ]}
        />
      )}

      <CommentSection comments={result.comments} />

      <div className="flex gap-4">
        <Link href="/analyze" className="flex-1 text-center bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium">
          もう一度分析する
        </Link>
        <Link href="/history" className="flex-1 text-center border border-indigo-600 text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition font-medium">
          履歴を見る
        </Link>
      </div>
    </div>
  )
}
