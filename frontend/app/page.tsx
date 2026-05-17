import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Voice Coach AI</h1>
        <p className="text-lg text-gray-600 mb-8">
          発声・話し方改善のためのAI音声分析ツール
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/analyze"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-indigo-700 transition shadow"
          >
            録音して分析する
          </Link>
          <Link
            href="/analyze?mode=upload"
            className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl text-lg font-medium hover:bg-indigo-50 transition"
          >
            音声ファイルをアップロード
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {[
          { title: 'ピッチ分析', desc: '声の高さの変化や抑揚を数値で確認できます' },
          { title: '間の分析', desc: '話の間の取り方を客観的に把握できます' },
          { title: '声量分析', desc: '声の大きさと安定性を確認できます' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        <p className="font-semibold mb-1">ご利用にあたって</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>本アプリは発声練習・話し方改善を目的としたセルフトレーニングツールです。</li>
          <li>医療的な診断、疾患の判定、治療方針の判断には使用できません。</li>
          <li>録音内容には個人情報や機密情報を含めないでください。</li>
        </ul>
      </div>
    </div>
  )
}
