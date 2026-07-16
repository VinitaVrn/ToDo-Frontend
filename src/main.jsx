import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import LoginPage from "./pages/login-page";
import TodosPage from "./pages/todos-page";
import TodoDetailPage from "./pages/todo-details-page";
import ArchivedPage from "./pages/archived-page";
import ProtectedRoute from "./components/protected-routes";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <TodosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/todo/:id",
    element: (
      <ProtectedRoute>
        <TodoDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/archived",
    element: (
      <ProtectedRoute>
        <ArchivedPage />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  </React.StrictMode>
);