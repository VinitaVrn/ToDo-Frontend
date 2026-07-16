import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => api.post("/auth/login", data);

export const getTodos = (params) => api.get("/todos/get", { params });
export const createTodo = (data) => api.post("/todos/create", data);
export const getTodoById = (id) => api.get(`/todos/getById/${id}`);
export const updateTodo = (id, data) => api.patch(`/todos/update/${id}`, data);
export const deleteTodo = (id) => api.delete(`/todos/delete/${id}`);

export default api();
