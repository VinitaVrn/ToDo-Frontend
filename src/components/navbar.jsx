import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const links = [
    { path: '/', label: 'Todos' },
    { path: '/archived', label: 'Archived' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-lg">Todos</span>
      </div>
      <div className="flex items-center gap-1">
        {links.map(l => (
          <button
            key={l.path}
            onClick={() => navigate(l.path)}
            className={`text-md px-4 py-2 rounded-lg font-lg transition-colors
              ${pathname === l.path
                ? 'bg-violet-50 text-violet-800'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  )
}