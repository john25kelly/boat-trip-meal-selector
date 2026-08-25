import { createContext, useContext, useMemo, useState } from 'react'

const SESSION_STORAGE_KEY = import.meta.env.VITE_AUTH_SESSION_KEY || 'boat-trip-meal-selector-session'

const AuthContext = createContext(null)

function readSession() {
  const cached = localStorage.getItem(SESSION_STORAGE_KEY)

  if (!cached) {
    return null
  }

  try {
    return JSON.parse(cached)
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readSession())

  const login = async ({ name }) => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      throw new Error('Please enter your name to continue.')
    }

    const nextSession = {
      user: {
        displayName: trimmedName,
      },
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
    return nextSession
  }

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setSession(null)
  }

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
