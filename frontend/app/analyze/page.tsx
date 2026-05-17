'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Recorder from '@/components/Recorder'
import FileUploader from '@/components/FileUploader'
import AudioPlayer from '@/components/AudioPlayer'
import { analyzeAudio } from '@/lib/api'

const PROMPT_TEXT = `こんにちは。私はこれから、自分の話し方をより聞き取りやすくするために、発声トレーニングを行います。
相手に伝わりやすい声の大きさ、話すスピード、間の取り方を意識して話します。`

type AnalyzingStatus = 'idle' | 'waking' | 'analyzing'

export default function AnalyzePage() {
  const router = useRouter()
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [status, setStatus] = useState<AnalyzingStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleAudioReady = useCallback((blob: Blob, filename: string) => {
    setAudioBlob(blob)
    setAudioFile(new File([blob], filename, { type: blob.type }))
    setError(null)
  }, [])

  const handleFileSelected = useCallback((file: File) => {
    const blob = new Blob([file], { type: file.type })
    setAudioBlob(blob)
    setAudioFile(file)
    setError(null)
  }, [])

  const handleAnalyze = async () => {
    if (!audioFile) { setError('音声ファイルを選択してください。'); return }
    setError(null)

    // まずサーバーを起こす（スリープ対策）
    setStatus('waking')
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/`, { method: 'GET' })
    } catch {
      // 起動中でも無視して続行
    }

    setStatus('analyzing')
    try {
      const result = await analyzeAudio(audioFile, 'reading', PROMPT_TEXT)
      router.push(`/result/${result.analysis_id}`)
    } catch (e: any) {
      const msg = e.message || '分析に失敗しました。'
      if (msg.includes('fetch') || msg.includes('network') || msg.toLowerCase().includes('failed')) {
        setError('サーバーの起動中です。10〜30秒後にもう一度「分析する」を押してください。')
      } else {
        setError(msg)
      }
    } finally {
      setStatus('idle')
    }
  }

  const isLoading = status !== 'idle'

  const statusMessage = {
    idle: '分析する',
    waking: 'サーバー起動中... (初回は最大60秒かかります)',
    analyzing: '分析中...',
  }[status]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">音声分析</h1>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
        <h2 className="font-semibold text-indigo-700 mb-2">今日の練習文</h2>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{PROMPT_TEXT}</p>
      </div>

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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!audioFile || isLoading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
            {statusMessage}
          </span>
        ) : '分析する'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        対応形式: wav / mp3 / m4a / webm（最大30MB・3分）
      </p>
    </div>
  )
}
