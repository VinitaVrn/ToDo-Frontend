import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTodos, deleteTodo, updateTodo } from "../services/api";
import Navbar from "../components/navbar";
import { toast } from "react-toastify";

export default function ArchivedPage() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await getTodos({ isArchived: true });
      setTodos(res.data.data?.todos || res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleUnarchive = async (id) => {
    try {
      const res = await updateTodo(id, { isArchived: false });
      toast.success("Todo restored successfully.");
        fetchTodos();
    } catch (err) {
      toast.error( "Failed to restore todo.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this todo?")) return;
    try {
      const res = await deleteTodo(id);

      toast.success(res.data.message || "Todo deleted permanently.");

      fetchTodos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete todo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Archived</h1>
            <p className="text-md text-gray-400 mt-0.5">
              {todos.length} archived todos
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 h-20 animate-pulse"
              />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🗃️</p>
            <p className="text-md text-gray-500 mb-2">No archived todos</p>
            <button
              onClick={() => navigate("/")}
              className="text-xs text-violet-600 hover:underline"
            >
              Back to todos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white border border-gray-300 rounded-xl px-5 py-6 flex items-center gap-3 group"
              >
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/todo?id=${todo.id}`)}
                >
                  <p className="text-lg font-medium text-gray-800 line-through truncate">
                    {todo.title}
                  </p>
                  <p className="text-[15px] text-gray-400 mt-0.5">
                    {new Date(todo.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleUnarchive(todo.id)}
                    className="text-md px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-colors"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-md px-5 py-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
