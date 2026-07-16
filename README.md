# Todo Management Frontend

A modern Todo Management frontend built using **React**, **Vite**, and **Tailwind CSS**. The application provides authentication, todo management, search, filtering, archiving, checklists, and responsive UI.

---

## Features

- User Authentication
- Create Todo
- Edit Todo
- Delete Todo
- Archive / Restore Todo
- Todo Details Page
- Checklist Support
- Search Todos
- Filter by Status
- Filter by Priority
- Sort Todos
- Pagination
- Due Date Support
- Tags Support
- Pin Todo
- Toast Notifications
- Responsive UI

---

## Tech Stack

- React
- Vite
- JavaScript (ES6)
- Tailwind CSS
- Axios
- React Router DOM
- React Toastify

---

## Folder Structure

```text
src
│
├── components
│   ├── CreateTodoForm.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── TodoCard.jsx
│
├── pages
│   ├── LoginPage.jsx
│   ├── TodosPage.jsx
│   ├── TodoDetailPage.jsx
│   └── ArchivedPage.jsx
│
├── services
│   └── api.js
│
├── types
│   ├── todo-constant.js
│   └── todo-type.js
│
├── utils
│   ├── auth.js
│   ├── error-message.js
│   └── todo-payload.js
│
├── App.jsx
├── main.jsx
├── index.css
└── App.css
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/VinitaVrn/ToDo-Frontend.git
```

Move into the project

```bash
cd ToDo-Frontend
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
VITE_API_URL=http://localhost:4000/api
```

---

## Running the Project

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

---

## Available Pages

| Route | Description |
|--------|-------------|
| `/login` | Login Page |
| `/` | Dashboard |
| `/todo/:id` | Todo Details |
| `/archived` | Archived Todos |

---

## Main Functionalities

### Dashboard

- View Todos
- Search
- Filter
- Sort
- Pagination
- Create Todo

### Todo Details

- Update Todo
- Archive Todo
- Pin Todo
- Update Checklist
- View Activity
- Delete Todo

### Archived Todos

- Restore Todo
- Permanently Delete Todo

---

## API Communication

All API requests are managed using **Axios** inside:

```
src/services/api.js
```

Authentication uses JWT stored in local storage and automatically attaches the Authorization header.

---

## UI Features

- Responsive Layout
- Tailwind CSS
- Loading Skeletons
- Toast Notifications
- Form Validation
- Clean Dashboard UI

---

## Future Improvements

- Dark Mode
- Drag & Drop Todos
- Calendar View
- Reminder Notifications
- Labels & Categories
- Profile Management

---

## Author

Vinita