import Link from 'next/link'
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
        <h3 className="font-semibold text-indigo-700 mb-3">次回の練習メニュー</h3>
        <ul className="space-y-2">
          {comments.next_training.map((item) => (
            <li key={item.key}>
              <Link
                href={`/practice/${item.key}`}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-indigo-200 hover:border-indigo-400 hover:shadow-sm transition group"
              >
                <span className="text-sm text-indigo-800 font-medium">{item.label}</span>
                <span className="text-indigo-400 group-hover:text-indigo-600 transition text-lg">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/practice" className="block text-center text-xs text-indigo-500 hover:underline mt-3">
          すべての練習メニューを見る
        </Link>
      </div>
    </div>
  )
}
