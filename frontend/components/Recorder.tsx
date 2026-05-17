'use client'
import { useState, useRef, useCallback } from 'react'

interface RecorderProps {
  onAudioReady: (blob: Blob, filename: string) => void
}

export default function Recorder({ onAudioReady }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    setError(null)
    setRecordedBlob(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordedBlob(blob)
        onAudioReady(blob, 'recording.webm')
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorder.start()
      setIsRecording(true)
    } catch (e) {
      setError('マイクへのアクセスが許可されていません。')
    }
  }, [onAudioReady])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  const reset = useCallback(() => {
    setRecordedBlob(null)
    setError(null)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">マイクで録音</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex gap-3 flex-wrap">
        {!isRecording && !recordedBlob && (
          <button
            onClick={startRecording}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition"
          >
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
            録音開始
          </button>
        )}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 animate-pulse transition"
          >
            <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
            録音停止
          </button>
        )}
        {recordedBlob && (
          <>
            <span className="text-green-600 text-sm flex items-center">録音完了</span>
            <button
              onClick={reset}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              再録音
            </button>
          </>
        )}
      </div>
    </div>
  )
}
