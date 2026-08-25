import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AppLayout } from '../pages/AppLayout'
import { LandingPage } from '../pages/LandingPage'
import { ParticipantsPage } from '../pages/ParticipantsPage'

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<ParticipantsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
