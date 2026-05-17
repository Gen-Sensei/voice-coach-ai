'use client'
import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { practices, PracticeKey } from '@/lib/practices'
import Recorder from '@/components/Recorder'
import FileUploader from '@/components/FileUploader'
import AudioPlayer from '@/components/AudioPlayer'
import { analyzeAudio } from '@/lib/api'
import { AnalysisResult } from '@/lib/types'

type AnalyzingStatus = 'idle' | 'waking' | 'analyzing'

export default function PracticeDetailPage() {
  const { type } = useParams<{ type: string }>()
  const router = useRouter()
  const practice = practices[type as PracticeKey]

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [status, setStatus] = useState<AnalyzingStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  if (!practice) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500">練習メニューが見つかりません。</p>
        <Link href="/practice" className="text-indigo-600 hover:underline mt-4 block">
          練習一覧に戻る
        </Link>
      </div>
    )
  }

  const handleAudioReady = useCallback((blob: Blob, filename: string) => {
    setAudioBlob(blob)
    setAudioFile(new File([blob], filename, { type: blob.type }))
    setError(null)
    setResult(null)
  }, [])

  const handleFileSelected = useCallback((file: File) => {
    setAudioBlob(new Blob([file], { type: file.type }))
    setAudioFile(file)
    setError(null)
    setResult(null)
  }, [])

  const handleAnalyze = async () => {
    if (!audioFile) { setError('音声ファイルを選択してください。'); return }
    setError(null)
    setStatus('waking')
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/`)
    } catch {}
    setStatus('analyzing')
    try {
      const res = await analyzeAudio(audioFile, practice.taskType, practice.promptText)
      setResult(res)
    } catch (e: any) {
      const msg = e.message || '分析に失敗しました。'
      setError(msg.includes('fetch') || msg.includes('Failed')
        ? 'サーバーの起動中です。10〜30秒後にもう一度押してください。'
        : msg)
    } finally {
      setStatus('idle')
    }
  }

  const isLoading = status !== 'idle'
  const scoreColor = (s: number) => s >= 80 ? 'text-green-600' : s >= 60 ? 'text-amber-600' : 'text-red-500'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/practice" className="text-gray-400 hover:text-gray-600 text-sm">← 練習一覧</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-600">{practice.title}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">{practice.title}</h1>
        <p className="text-gray-500 text-sm mt-1">{practice.subtitle}</p>
      </div>

      {/* 説明 */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 space-y-3">
        <p className="text-gray-700 text-sm leading-relaxed">{practice.description}</p>
        <div>
          <p className="text-indigo-700 font-semibold text-sm mb-2">練習のコツ</p>
          <ul className="space-y-1">
            {practice.tips.map((tip, i) => (
              <li key={i} className="text-sm text-indigo-800 flex gap-2">
                <span className="text-indigo-400">✓</span><span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 練習文 */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-3">練習文</h2>
        <p className="text-gray-700 text-sm leading-loose whitespace-pre-line border-l-4 border-indigo-200 pl-4">
          {practice.promptText}
        </p>
      </div>

      {/* 録音 */}
      <Recorder onAudioReady={handleAudioReady} />
      <div className="text-center text-gray-400 text-sm">または</div>
      <FileUploader onFileSelected={handleFileSelected} />
      {audioBlob && <AudioPlayer blob={audioBlob} />}

      {status === 'waking' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm flex items-center gap-2">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"></span>
          サーバーを起動しています。初回は最大60秒かかる場合があります...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!audioFile || isLoading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
            {status === 'waking' ? 'サーバー起動中...' : '分析中...'}
          </span>
        ) : '録音して分析する'}
      </button>

      {/* 結果（インライン表示） */}
      {result && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">分析結果</h2>
            <p className="text-5xl font-bold text-indigo-600 mb-1">{result.scores.overall}</p>
            <p className="text-gray-400 text-sm mb-3">/ 100点</p>
            <p className="text-gray-600 text-sm">{result.comments.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '抑揚', value: result.scores.intonation },
              { label: '間', value: result.scores.pause },
              { label: '声量安定', value: result.scores.volume_stability },
              { label: '録音品質', value: result.scores.recording_quality },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${scoreColor(s.value)}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {result.comments.improvements.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-700 mb-2">改善ポイント</h3>
              <ul className="space-y-1">
                {result.comments.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-800 flex gap-2">
                    <span>{i + 1}.</span><span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setResult(null); setAudioBlob(null); setAudioFile(null) }}
              className="flex-1 border border-indigo-600 text-indigo-600 py-2.5 rounded-xl hover:bg-indigo-50 transition font-medium text-sm"
            >
              もう一度練習する
            </button>
            <Link href={`/result/${result.analysis_id}`} className="flex-1 text-center bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium text-sm">
              詳細結果を見る
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
