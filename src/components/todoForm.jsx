import { useState, useEffect } from 'react'
import { createTodo, updateTodo } from '../services/api'

const EMPTY = {
  title: '', description: '', type: 'task',
  status: 'todo', priority: 'medium',
  tags: '', dueDate: '', items: [''],
}

export default function TodoForm({ todo, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (todo) {
      setForm({
        ...todo,
        tags: todo.tags?.join(', ') || '',
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        items: todo.items?.map(i => i.content) || [''],
      })
    }
  }, [todo])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setItem = (i, val) => {
    const items = [...form.items]
    items[i] = val
    set('items', items)
  }

  const addItem = () => set('items', [...form.items, ''])
  const removeItem = (i) => set('items', form.items.filter((_, idx) => idx !== i))

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || undefined,
        type: form.type,
        status: form.status,
        priority: form.priority,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || undefined,
        items: form.type === 'checklist'
          ? form.items.filter(i => i.trim()).map(content => ({ content }))
          : undefined,
      }
      if (todo) {
        await updateTodo(todo.id, payload)
      } else {
        await createTodo(payload)
      }
      onSave()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{todo ? 'Edit todo' : 'New todo'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none"
              rows={2}
              placeholder="Optional details..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Type + Status + Priority */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Type', key: 'type', options: ['task', 'checklist'] },
              { label: 'Status', key: 'status', options: ['todo', 'in_progress', 'blocked', 'done', 'cancelled'] },
              { label: 'Priority', key: 'priority', options: ['low', 'medium', 'high', 'critical'] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-violet-400"
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                >
                  {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Tags + Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Tags (comma separated)</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                placeholder="backend, urgent"
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Due date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
              />
            </div>
          </div>

          {/* Checklist items */}
          {form.type === 'checklist' && (
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Checklist items</label>
              <div className="flex flex-col gap-2">
                {form.items.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-400"
                      placeholder={`Item ${i + 1}`}
                      value={item}
                      onChange={e => setItem(i, e.target.value)}
                    />
                    {form.items.length > 1 && (
                      <button onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-400 text-lg leading-none">&times;</button>
                    )}
                  </div>
                ))}
                <button onClick={addItem} className="text-xs text-violet-500 hover:text-violet-700 text-left mt-1">
                  + Add item
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.title.trim()}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Saving...' : todo ? 'Save changes' : 'Create todo'}
          </button>
        </div>
      </div>
    </div>
  )
}