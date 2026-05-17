interface MetricCardProps {
  title: string
  items: { label: string; value: string | number | null; unit?: string }[]
  color?: string
}

export default function MetricCard({ title, items, color = 'indigo' }: MetricCardProps) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200',
  }

  return (
    <div className={`rounded-xl border p-5 ${colorMap[color] || colorMap.indigo}`}>
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium text-gray-800">
              {item.value !== null && item.value !== undefined
                ? `${typeof item.value === 'number' ? item.value.toFixed(1) : item.value}${item.unit || ''}`
                : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
