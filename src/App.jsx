// App.jsx - Updated with Authentication
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Index_Page } from './components/Index_Page';
import { Billing_page } from './pages/Billing_page';
import { Footer } from './components/Footer';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication on app start
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('babaAuth') || '{}');
    const savedUser = localStorage.getItem('babaUser');
    
    // Check if authentication is still valid (2 hours)
    if (authData.expires > Date.now() && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    } else {
      // Clear expired authentication
      localStorage.removeItem('babaAuth');
      localStorage.removeItem('babaUser');
    }
  }, []);

  const handleLogin = (userData) => {
    const authData = {
      expires: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('babaAuth', JSON.stringify(authData));
    localStorage.setItem('babaUser', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('babaAuth');
    localStorage.removeItem('babaUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <>
      <Router>
        {isAuthenticated ? (
          <>
            <Index_Page user={user} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Billing_page />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer/>
          </>
        ) : (
          <Routes>
            <Route 
              path="*" 
              element={<Login onLogin={handleLogin} />} 
            />
          </Routes>
        )}
      </Router>
    </>
  )
}

export default App