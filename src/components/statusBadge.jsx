const STATUS_STYLES = {
  todo:        'bg-gray-100 text-gray-600',
  in_progress: 'bg-amber-100 text-amber-700',
  blocked:     'bg-red-100 text-red-600',
  done:        'bg-green-100 text-green-700',
  cancelled:   'bg-gray-100 text-gray-400 line-through',
}

const PRIORITY_STYLES = {
  low:      'bg-blue-50 text-blue-600',
  medium:   'bg-yellow-50 text-yellow-700',
  high:     'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600',
}

const LABELS = {
  todo: 'Todo', in_progress: 'In Progress', blocked: 'Blocked',
  done: 'Done', cancelled: 'Cancelled',
  low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
}

export function StatusBadge({ value }) {
  const style = STATUS_STYLES[value] || 'bg-gray-100 text-gray-500'
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${style}`}>
      {LABELS[value] || value}
    </span>
  )
}

export function PriorityBadge({ value }) {
  const style = PRIORITY_STYLES[value] || 'bg-gray-100 text-gray-500'
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${style}`}>
      {LABELS[value] || value}
    </span>
  )
}