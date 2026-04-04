import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Hub from './pages/Hub';
import Onboarding from './pages/Onboarding';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './lib/api';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }
      try {
        await api.auth.me();
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-forge-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-forge-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Wrapper (Redirects to Hub if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        return;
      }
      try {
        await api.auth.me();
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) return null;
  return isAuthenticated ? <Navigate to="/hub" replace /> : <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <div className="min-h-screen bg-forge-bg text-forge-text selection:bg-forge-accent selection:text-white relative">
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/hub" element={<ProtectedRoute><Hub /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}
