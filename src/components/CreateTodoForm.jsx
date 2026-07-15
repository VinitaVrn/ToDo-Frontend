import { useState } from "react";
import { createTodo } from "../services/api";
import { EMPTY_TODO } from "../types/todo-type";
import {
  TODO_PRIORITIES,
  TODO_STATUSES,
  TODO_TYPES,
} from "../types/todo-constant";
import { buildTodoPayload } from "../utils/todo-payload";

export default function CreateTodotodo({ onSave }) {
  const [todo, setTodo] = useState(EMPTY_TODO);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = (key, value) =>
    setTodo((prev) => ({
      ...prev,
      [key]: value,
    }));

  const updateCheckLIstItem = (i, val) => {
    const items = [...todo.items];
    items[i] = val;
    updateField("items", items);
  };

  const handleSubmit = async () => {
    if (!todo.title.trim()) return;
    setLoading(true);
    try {
      await createTodo(buildTodoPayload(todo));
      setTodo({
        ...EMPTY_TODO,
        items: [...EMPTY_TODO.items],
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSave?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800">Create New Todo</h2>

      {/* Title */}
      <div>
        <label className="text-md font-medium text-gray-700 block mb-1.5">
          Title
        </label>
        <input
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-md focus:outline-none focus:border-violet-500 transition-colors placeholder-gray-400"
          placeholder="What needs to be done?"
          value={todo.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-md font-medium text-gray-700 block mb-1.5">
          Description
        </label>
        <textarea
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none transition-colors placeholder-gray-400"
          placeholder="Add more details..."
          rows={3}
          value={todo.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* Type + Status + Priority */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "type", label: "Type", options: TODO_TYPES },
          { key: "status", label: "Status", options: TODO_STATUSES },
          { key: "priority", label: "Priority", options: TODO_PRIORITIES },
        ].map(({ key, label, options }) => (
          <div key={key}>
            <label className="text-md font-medium text-gray-700 block mb-1.5">
              {label}
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-violet-500 transition-colors bg-white"
              value={todo[key]}
              onChange={(e) => updateField(key, e.target.value)}
            >
              {options.map((o) => (
                <option key={o} value={o}>
                  {o.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Tags + Due date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-md font-medium text-gray-700 block mb-1.5">
            Tags
          </label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition-colors placeholder-gray-300"
            placeholder="backend, urgent"
            value={todo.tags}
            onChange={(e) => updateField("tags", e.target.value)}
          />
        </div>
        <div>
          <label className="text-md font-medium text-gray-700 block mb-1.5">
            Due date
          </label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 transition-colors text-gray-800"
            value={todo.dueDate}
            onChange={(e) => updateField("dueDate", e.target.value)}
          />
        </div>
      </div>

      {/* Checklist items */}
      {todo.type === "checklist" && (
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-2">
            Checklist items
          </label>
          <div className="flex flex-col gap-2">
            {todo.items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400"
                  placeholder={`Item ${i + 1}`}
                  value={item}
                  onChange={(e) => updateCheckLIstItem(i, e.target.value)}
                />
                {todo.items.length > 1 && (
                  <button
                    onClick={() =>
                      updateField(
                        "items",
                        todo.items.filter((_, idx) => idx !== i)
                      )
                    }
                    className="text-gray-300 hover:text-red-400 text-xl leading-none"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => updateField("items", [...todo.items, ""])}
              className="text-sm text-violet-500 hover:text-violet-700 text-left font-medium"
            >
              + Add item
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !todo.title.trim()}
        className="w-full py-3 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Saving..." : success ? "✓ Saved!" : "Save Todo"}
      </button>
    </div>
  );
}
