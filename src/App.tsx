import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Hub from './pages/Hub';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <div className="min-h-screen bg-forge-bg text-forge-text selection:bg-forge-accent selection:text-white relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}
