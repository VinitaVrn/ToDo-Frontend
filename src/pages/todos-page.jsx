import { useState, useEffect, useCallback } from "react";
import { getTodos, deleteTodo } from "../services/api";
import Navbar from "../components/navbar";
import TodoCard from "../components/todoCard";
import CreateTodoForm from "../components/CreateTodoForm";
import { TODO_STATUSES, PAGE_SIZE } from "../types/todo-constant";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/error-message";

const statusTabs = ["all", ...TODO_STATUSES];

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeStatus, setActiveStatus] = useState("all");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const params = { isArchived: false };
      if (activeStatus !== "all") params.status = activeStatus;
      if (priority) params.priority = priority;
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      const res = await getTodos(params);
      setTodos(res.data.data?.todos || res.data.data || []);
      setPage(1);
    }catch (err) {
  toast.error(
    err.response?.data?.message || "Failed to fetch todos."
  );
} finally {
      setLoading(false);
    }
  }, [activeStatus, priority, debouncedSearch]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

 const handleDelete = async (id) => {
  if (!confirm("Delete this todo?")) return;

  try {
    const res = await deleteTodo(id);

    toast.success(
      res.data.message || "Todo deleted successfully."
    );

    fetchTodos();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to delete todo."
    );
  }
};

  // Sort client-side
  const sorted = [...todos].sort((a, b) => {
    if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "updated")
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    if (sort === "due")
      return new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999");
    return 0;
  });

  // Pinned first
  const pinned = sorted.filter((t) => t.isPinned);
  const rest = sorted.filter((t) => !t.isPinned);
  const all = [...pinned, ...rest];

  // Pagination
  const totalPages = Math.ceil(all.length / PAGE_SIZE);
  const paginated = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full px-[10%] py-8">
        <div className="grid grid-cols-10 gap-6">
          {/* Left — Create form */}
          <div className="col-span-4">
            <CreateTodoForm onSave={fetchTodos} />
          </div>

          {/* Right — Todo list */}
          <div className="col-span-6">
            {/* Filters row */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <input
                className="flex-1 min-w-60 bg-white border border-gray-600 rounded-xl px-6 py-4 text-md text-gray-900 placeholder-gray-600 focus:outline-none focus:border-violet-600 transition-colors"
                placeholder="Search todos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-violet-400"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              
            </div>

            {/* Status tabs */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
              {statusTabs.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setActiveStatus(s);
                    setPage(1);
                  }}
                  className={`flex-shrink-0 text-md px-5 py-3 rounded-lg font-medium capitalize transition-colors whitespace-nowrap
                  ${
                    activeStatus === s
                      ? "bg-violet-700 text-white"
                      : "bg-white border border-gray-400 text-gray-800 hover:border-violet-400 hover:text-violet-600"
                  }`}
                >
                  {s.replace("_", " ")}
                  <span className="ml-1 opacity-60">
                    {s === "all"
                      ? todos.length
                      : todos.filter((t) => t.status === s).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Cards */}
            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 p-4 h-24 animate-pulse"
                  />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm text-gray-500">No todos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {paginated.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} onDelete={handleDelete} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5">
                <p className="text-xs text-gray-400">
                  {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, all.length)} of {all.length}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 text-xs rounded-lg border transition-colors
                      ${
                        page === p
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-gray-200 bg-white text-gray-600 hover:border-violet-300"
                      }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-violet-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
