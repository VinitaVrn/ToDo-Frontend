import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

export const getTodos = (params) => api.get('/', { params })
export const createTodo = (data) => api.post('/', data)
export const getTodoById = (id) => api.get(`/todos/${id}`)
export const updateTodo = (id, data) => api.patch(`/todos/${id}`, data)
export const deleteTodo = (id) => api.delete(`/todos/${id}`)

export default api