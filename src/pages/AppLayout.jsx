import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AppLayout() {
  const { session, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="top-bar card">
        <div>
          <p className="eyebrow">EDYC crew space</p>
          <h1>Meal Selections</h1>
        </div>
        <nav>
          <Link to="/app">Participants</Link>
        </nav>
        <div className="top-bar-actions">
          <p>{session?.user?.displayName}</p>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
