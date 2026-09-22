import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './LoginPage'
import Home from './Home'
import GalleryPage from './GalleryPage'

export default function App() {
  // Pure in-memory state: resets to false on EVERY browser refresh!
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Landing Page: Countdown & Login */}
        <Route
          path="/"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Protected Romantic Home Page */}
        <Route
          path="/home"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/" replace />
          }
        />

        {/* Protected Gallery Page */}
        <Route
          path="/gallery"
          element={
            isAuthenticated ? <GalleryPage /> : <Navigate to="/" replace />
          }
        />

        {/* Fallback to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
