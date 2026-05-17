import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Voice Coach AI',
  description: '発声・話し方改善のためのAI音声分析ツール',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-600">Voice Coach AI</a>
            <nav className="flex gap-4 text-sm">
              <a href="/analyze" className="text-gray-600 hover:text-indigo-600">分析する</a>
              <a href="/history" className="text-gray-600 hover:text-indigo-600">履歴</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
