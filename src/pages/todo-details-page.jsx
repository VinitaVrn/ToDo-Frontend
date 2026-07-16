import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getTodoById, updateTodo, deleteTodo } from "../services/api";
import Navbar from "../components/navbar";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["todo", "in_progress", "blocked", "done", "cancelled"];
const PRIORITY_OPTIONS = ["low", "medium", "high", "critical"];

const STATUS_STYLES = {
  todo: "bg-gray-100 text-gray-600",
  in_progress: "bg-amber-100 text-amber-700",
  blocked: "bg-red-100 text-red-600",
  done: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-400",
};

export default function TodoDetailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchTodo = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getTodoById(id);

      const data = res.data.data;
      setTodo(data);
      setForm({
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        type: data.type,
        dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
        isPinned: data.isPinned,
        isArchived: data.isArchived,
        tags: data.tags?.join(", ") || "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [id]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    console.log(form);
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (form.dueDate) {
        payload.dueDate = form.dueDate;
      } else {
        delete payload.dueDate;
      }

      await updateTodo(id, payload);

      toast.success("Todo updated successfully.");
      await fetchTodo();
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update todos.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this todo?")) return;
    await deleteTodo(id);
    toast.success("Todo deleted successfully.");
    if (err) {
      toast.error(err.response?.data?.message || "Failed to delete todos.");
    }
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center text-sm text-gray-400">
          Loading...
        </div>
      </div>
    );

  if (!todo)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 mb-4">Todo not found.</p>
          <button
            onClick={() => navigate("/")}
            className="text-violet-600 hover:underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );

  const isOverdue =
    todo.dueDate &&
    new Date(todo.dueDate) < new Date() &&
    todo.status !== "done";

  const handleToggleItem = async (item) => {
    try {
      await updateTodo(id, {
        items: [
          {
            id: item.id,
            isDone: !item.isDone,
          },
        ],
      });

      await fetchTodo();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-md text-gray-600 mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-violet-600 transition-colors"
          >
            Todos
          </button>
          <span>/</span>
          <span className="text-gray-800 truncate">{todo.title}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editMode ? (
                <input
                  className="w-full text-3xl font-bold text-gray-900 border-b border-violet-300 focus:outline-none pb-1 bg-transparent"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              ) : (
                <h1
                  className={`text-3xl font-bold ${
                    todo.status === "done"
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {todo.isPinned && "📌 "}
                  {todo.title}
                </h1>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className={`text-md px-2.5 py-0.5 rounded-full font-medium capitalize ${
                    STATUS_STYLES[todo.status]
                  }`}
                >
                  {todo.status?.replace("_", " ")}
                </span>
                <span className="text-md text-gray-600 capitalize">
                  {todo.priority} priority
                </span>
                <span className="text-md text-gray-600 capitalize">
                  {todo.type}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-md px-3.5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="text-md px-4 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-md px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-md px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Description */}
            <div>
              <p className="text-lg font-semibold text-gray-800 uppercase tracking-wider mb-2">
                Description
              </p>
              {editMode ? (
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-md focus:outline-none focus:border-violet-400 resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Add a description..."
                />
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {todo.description || (
                    <span className="text-gray-500 italic">No description</span>
                  )}
                </p>
              )}
            </div>

            {/* Fields grid */}
            <div>
              <p className="text-md font-semibold text-gray-800 uppercase tracking-wider mb-3">
                Details
              </p>
              <div className="grid grid-cols-2 gap-3">
                {editMode ? (
                  <>
                    <div>
                      <label className="text-[20px] text-gray-800 block mb-1">
                        Status
                      </label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-md focus:outline-none focus:border-violet-400"
                        value={form.status}
                        onChange={(e) => set("status", e.target.value)}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[20px] text-gray-800 block mb-1">
                        Priority
                      </label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-md focus:outline-none focus:border-violet-400"
                        value={form.priority}
                        onChange={(e) => set("priority", e.target.value)}
                      >
                        {PRIORITY_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[20px] text-gray-800 block mb-1">
                        Due date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-md focus:outline-none focus:border-violet-400"
                        value={form.dueDate}
                        onChange={(e) => set("dueDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[20px] text-gray-800 block mb-1">
                        Tags
                      </label>
                      <input
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text- focus:outline-none focus:border-violet-400"
                        placeholder="backend, urgent"
                        value={form.tags}
                        onChange={(e) => set("tags", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-4 col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isPinned}
                          onChange={(e) => set("isPinned", e.target.checked)}
                          className="accent-violet-600"
                        />
                        <span className="text-md text-gray-800">Pinned</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isArchived}
                          onChange={(e) => set("isArchived", e.target.checked)}
                          className="accent-violet-600"
                        />
                        <span className="text-md text-gray-800">Archived</span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    {[
                      {
                        label: "Status",
                        value: todo.status?.replace("_", " "),
                      },
                      { label: "Priority", value: todo.priority },
                      { label: "Type", value: todo.type },
                      {
                        label: "Due date",
                        value: todo.dueDate ? (
                          <span
                            className={
                              isOverdue ? "text-red-500 font-medium" : ""
                            }
                          >
                            {new Date(todo.dueDate).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric", year: "numeric" }
                            )}
                            {isOverdue && " · overdue"}
                          </span>
                        ) : (
                          "—"
                        ),
                      },
                      { label: "Pinned", value: todo.isPinned ? "Yes" : "No" },
                      {
                        label: "Archived",
                        value: todo.isArchived ? "Yes" : "No",
                      },
                      {
                        label: "Created",
                        value: new Date(todo.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        ),
                      },
                      {
                        label: "Updated",
                        value: new Date(todo.updatedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        ),
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-base font-semibold text-gray-700 mb-2">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-gray-700 capitalize">
                          {value}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Tags display */}
            {!editMode && todo.tags?.length > 0 && (
              <div>
                <p className="text-md font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {todo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-md px-3 py-1 rounded-full bg-violet-50 text-violet-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Checklist */}
            {todo.type === "checklist" && todo.items?.length > 0 && (
              <div>
                <p className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  Checklist · {todo.items.filter((i) => i.isDone).length}/
                  {todo.items.length}
                </p>
                <div className="h-1.5 bg-gray-300 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${Math.round(
                        (todo.items.filter((i) => i.isDone).length /
                          todo.items.length) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                {todo.items
                  .sort((a, b) => a.position - b.position)
                  .map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={item.isDone}
                        onChange={() => {
                          handleToggleItem(item);
                        }}
                        className="w-5 h-5 accent-violet-600 cursor-pointer"
                      />

                      <span
                        className={`text-base ${
                          item.isDone
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {item.content}
                      </span>
                    </label>
                  ))}
              </div>
            )}

            {/* Activity log */}
            {todo.history?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Activity
                </p>
                <div className="flex flex-col gap-0">
                  {todo.history.map((h, i) => (
                    <div
                      key={h.id}
                      className={`flex gap-3 pb-3 ${
                        i < todo.history.length - 1
                          ? "border-b border-gray-50"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-violet-300 mt-1 flex-shrink-0" />
                        {i < todo.history.length - 1 && (
                          <div className="w-px flex-1 bg-gray-100 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">{h.changedField}</span>
                          {h.oldValue && h.newValue && (
                            <>
                              {" "}
                              · {h.oldValue} → {h.newValue}
                            </>
                          )}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {new Date(h.changedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
