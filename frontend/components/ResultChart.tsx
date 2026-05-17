'use client'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Scores } from '@/lib/types'

interface ResultChartProps {
  scores: Scores
}

export default function ResultChart({ scores }: ResultChartProps) {
  const data = [
    { subject: '抑揚', value: scores.intonation },
    { subject: '間', value: scores.pause },
    { subject: '声量安定', value: scores.volume_stability },
    { subject: '録音品質', value: scores.recording_quality },
  ]

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold text-gray-700 mb-4 text-center">スコア詳細</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13 }} />
          <Radar name="スコア" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
          <Tooltip formatter={(v: number) => [`${v}点`]} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((d) => (
          <div key={d.subject} className="flex justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-500">{d.subject}</span>
            <span className="font-bold text-indigo-600">{d.value}点</span>
          </div>
        ))}
      </div>
    </div>
  )
}
