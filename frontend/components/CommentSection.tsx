import { Comments } from '@/lib/types'

interface CommentSectionProps {
  comments: Comments
}

export default function CommentSection({ comments }: CommentSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h3 className="font-semibold text-green-700 mb-2">良い点</h3>
        <ul className="space-y-1">
          {comments.strengths.map((s, i) => (
            <li key={i} className="text-sm text-green-800 flex gap-2">
              <span>✓</span><span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-700 mb-2">改善ポイント</h3>
        <ul className="space-y-1">
          {comments.improvements.map((s, i) => (
            <li key={i} className="text-sm text-amber-800 flex gap-2">
              <span>{i + 1}.</span><span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
        <h3 className="font-semibold text-indigo-700 mb-2">次回の練習メニュー</h3>
        <ul className="space-y-1">
          {comments.next_training.map((s, i) => (
            <li key={i} className="text-sm text-indigo-800 flex gap-2">
              <span>→</span><span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
