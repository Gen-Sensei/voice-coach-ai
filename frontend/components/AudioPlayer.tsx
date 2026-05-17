'use client'
import { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  blob: Blob | null
}

export default function AudioPlayer({ blob }: AudioPlayerProps) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) { setUrl(null); return }
    const u = URL.createObjectURL(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])

  if (!url) return null

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-2">録音を確認</h2>
      <audio controls src={url} className="w-full" />
    </div>
  )
}
