import Link from 'next/link'
import { allPractices } from '@/lib/practices'

const iconMap: Record<string, string> = {
  pause: '⏸',
  volume: '🔊',
  intonation: '📈',
  tone: '〰️',
  rhythm: '🎵',
  general: '🎤',
}

export default function PracticePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">練習メニュー</h1>
        <p className="text-sm text-gray-500 mt-1">苦手な項目を選んで練習しましょう</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {allPractices.map((p) => (
          <Link key={p.key} href={`/practice/${p.key}`}>
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-md hover:border-indigo-200 border border-transparent transition cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{iconMap[p.key]}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-800">{p.title}</h2>
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{p.focusMetric}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{p.subtitle}</p>
                  <p className="text-sm text-gray-600 mt-2">{p.description}</p>
                </div>
                <span className="text-gray-300 text-xl">›</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/analyze" className="block text-center text-sm text-indigo-600 hover:underline">
        ← 分析画面に戻る
      </Link>
    </div>
  )
}
