import { useState } from 'react'
import { createTodo } from '../services/api'

const EMPTY = {
  title: '', description: '', type: 'task',
  status: 'todo', priority: 'medium',
  tags: '', dueDate: '', items: [''],
}

export default function CreateTodoForm({ onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setItem = (i, val) => {
    const items = [...form.items]
    items[i] = val
    set('items', items)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    setLoading(true)
    try {
      await createTodo({
        title: form.title.trim(),
        description: form.description || undefined,
        type: form.type,
        status: form.status,
        priority: form.priority,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || undefined,
        items: form.type === 'checklist'
          ? form.items.filter(i => i.trim()).map((content, position) => ({ content, position }))
          : undefined,
      })
      setForm(EMPTY)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onSave()
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
    <h2 className="text-base font-semibold text-gray-800">Create New Todo</h2>

    {/* Title */}
    <div>
      <label className="text-md font-medium text-gray-700 block mb-1.5">Title</label>
      <input
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-md focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-400"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={e => set('title', e.target.value)}
      />
    </div>

    {/* Description */}
    <div>
      <label className="text-md font-medium text-gray-700 block mb-1.5">Description</label>
      <textarea
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors placeholder-gray-400"
        placeholder="Add more details..."
        rows={3}
        value={form.description}
        onChange={e => set('description', e.target.value)}
      />
    </div>

    {/* Type + Status + Priority */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { key: 'type', label: 'Type', options: ['task', 'checklist'] },
        { key: 'status', label: 'Status', options: ['todo', 'in_progress', 'blocked', 'done', 'cancelled'] },
        { key: 'priority', label: 'Priority', options: ['low', 'medium', 'high', 'critical'] },
      ].map(({ key, label, options }) => (
        <div key={key}>
          <label className="text-md font-medium text-gray-700 block mb-1.5">{label}</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-violet-500 transition-colors bg-white"
            value={form[key]}
            onChange={e => set(key, e.target.value)}
          >
            {options.map(o => (
              <option key={o} value={o}>{o.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      ))}
    </div>

    {/* Tags + Due date */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-md font-medium text-gray-700 block mb-1.5">Tags</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition-colors placeholder-gray-300"
          placeholder="backend, urgent"
          value={form.tags}
          onChange={e => set('tags', e.target.value)}
        />
      </div>
      <div>
        <label className="text-md font-medium text-gray-700 block mb-1.5">Due date</label>
        <input
          type="date"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition-colors text-gray-800"
          value={form.dueDate}
          onChange={e => set('dueDate', e.target.value)}
        />
      </div>
    </div>

    {/* Checklist items */}
    {form.type === 'checklist' && (
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-2">Checklist items</label>
        <div className="flex flex-col gap-2">
          {form.items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400"
                placeholder={`Item ${i + 1}`}
                value={item}
                onChange={e => setItem(i, e.target.value)}
              />
              {form.items.length > 1 && (
                <button
                  onClick={() => set('items', form.items.filter((_, idx) => idx !== i))}
                  className="text-gray-300 hover:text-red-400 text-xl leading-none"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => set('items', [...form.items, ''])}
            className="text-sm text-violet-500 hover:text-violet-700 text-left font-medium"
          >
            + Add item
          </button>
        </div>
      </div>
    )}

    <button
      onClick={handleSubmit}
      disabled={loading || !form.title.trim()}
      className="w-full py-3 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
    >
      {loading ? 'Saving...' : success ? '✓ Saved!' : 'Save Todo'}
    </button>
  </div>
)
}