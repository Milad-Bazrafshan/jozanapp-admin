import type { LucideIcon } from 'lucide-react'

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string | number
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-sm hover:border-neutral-300 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
          <Icon className="w-5 h-5 text-neutral-700" strokeWidth={2} />
        </div>
      </div>
      <p className="text-2xl font-bold text-neutral-900 tracking-tight" dir="ltr">
        {value}
      </p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </div>
  )
}
