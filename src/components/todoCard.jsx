import { useNavigate } from 'react-router-dom'

const STATUS_STYLES = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-amber-100 text-amber-700',
  blocked: 'bg-red-100 text-red-600',
  done: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-400',
}

const PRIORITY_DOT = {
  low: 'bg-blue-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500',
}

export default function TodoCard({ todo, onDelete }) {
  const navigate = useNavigate()

  const completedItems = todo.items?.filter(i => i.isDone).length || 0
  const totalItems = todo.items?.length || 0
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'done'
  const updatedAt = new Date(todo.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div
      onClick={() => navigate(`/todo?id=${todo.id}`)}
      className={`bg-white border rounded-xl px-4 py-3 cursor-pointer hover:shadow-sm hover:border-gray-300 transition-all group
        ${todo.isPinned ? 'border-l-[3px] border-l-violet-400 border-gray-200' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className={`text-sm font-medium leading-snug flex-1 min-w-0 truncate
          ${todo.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {todo.isPinned && <span className="text-violet-400 mr-1">📌</span>}
          {todo.title}
        </p>
        <button
          onClick={e => { e.stopPropagation(); onDelete(todo.id) }}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0 p-0.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[todo.status]}`}>
          {todo.status?.replace('_', ' ')}
        </span>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[todo.priority]}`} title={todo.priority} />
        {todo.type === 'checklist' && totalItems > 0 && (
          <span className="text-[11px] text-gray-400">{completedItems}/{totalItems} done</span>
        )}
        {todo.dueDate && (
          <span className={`text-[11px] ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {isOverdue ? '⚠ ' : ''}
            {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
        {todo.tags?.slice(0, 1).map(tag => (
          <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-500">{tag}</span>
        ))}
      </div>

      {todo.type === 'checklist' && totalItems > 0 && (
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-green-400 rounded-full"
            style={{ width: `${Math.round((completedItems / totalItems) * 100)}%` }}
          />
        </div>
      )}

      <p className="text-[11px] text-gray-400">Updated {updatedAt}</p>
    </div>
  )
}