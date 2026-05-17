interface ScoreCardProps {
  overall: number
  summary: string
}

function ScoreRing({ score }: { score: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <svg width="140" height="140" className="mx-auto">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x="70" y="70" textAnchor="middle" dy="0.3em" fontSize="28" fontWeight="bold" fill="#1f2937">
        {score}
      </text>
      <text x="70" y="92" textAnchor="middle" fontSize="11" fill="#6b7280">/ 100</text>
    </svg>
  )
}

export default function ScoreCard({ overall, summary }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">総合スコア</h2>
      <ScoreRing score={overall} />
      <p className="text-gray-600 mt-4 text-sm leading-relaxed">{summary}</p>
    </div>
  )
}
