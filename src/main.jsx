import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import TodosPage from './pages/todos-page'
import TodoDetailPage from './pages/todo-details-page'
import ArchivedPage from './pages/archived-page'

const router = createBrowserRouter([
  { path: '/', element: <TodosPage /> },
  { path: '/todo', element: <TodoDetailPage /> },
  { path: '/archived', element: <ArchivedPage /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)