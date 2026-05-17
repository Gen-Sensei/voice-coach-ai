'use client'
import { useRef, useState } from 'react'

interface FileUploaderProps {
  onFileSelected: (file: File) => void
}

const ACCEPTED = '.wav,.mp3,.m4a,.webm'

export default function FileUploader({ onFileSelected }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setError(null)
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['wav', 'mp3', 'm4a', 'webm'].includes(ext || '')) {
      setError('wav, mp3, m4a, webm形式に対応しています。')
      return
    }
    if (file.size > 30 * 1024 * 1024) {
      setError('30MB以下のファイルをアップロードしてください。')
      return
    }
    setFileName(file.name)
    onFileSelected(file)
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">ファイルをアップロード</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        <p className="text-gray-500 text-sm">クリックまたはドラッグ&ドロップ</p>
        <p className="text-xs text-gray-400 mt-1">wav / mp3 / m4a / webm（最大30MB）</p>
        {fileName && <p className="text-indigo-600 mt-2 text-sm font-medium">{fileName}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
