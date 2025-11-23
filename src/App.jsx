// App.jsx - Updated with Persistent Authentication
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Index_Page } from './components/Index_Page';
import { Billing_page } from './pages/Billing_page';
import { Footer } from './components/Footer';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ CHECK FOR PERSISTENT SESSION ON APP STARTUP
  useEffect(() => {
    const checkPersistentSession = () => {
      try {
        const savedSession = localStorage.getItem('userSession');
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        
        console.log('🔍 Checking for existing session...');
        
        if (savedSession && sessionExpiry) {
          const now = new Date().getTime();
          const expiryTime = parseInt(sessionExpiry);
          
          if (now < expiryTime) {
            // Session is valid
            const userData = JSON.parse(savedSession);
            console.log('✅ Valid session found, auto-login:', userData.email);
            setUser(userData);
          } else {
            // Session expired
            console.log('❌ Session expired, clearing...');
            localStorage.removeItem('userSession');
            localStorage.removeItem('sessionExpiry');
            localStorage.removeItem('lastLogin');
          }
        } else {
          console.log('ℹ️ No existing session found');
        }
      } catch (error) {
        console.error('Error checking persistent session:', error);
        // Clear corrupted session data
        localStorage.removeItem('userSession');
        localStorage.removeItem('sessionExpiry');
        localStorage.removeItem('lastLogin');
      } finally {
        setIsLoading(false);
      }
    };

    checkPersistentSession();
  }, []);

  const handleLogin = (userData) => {
    const sessionData = {
      ...userData,
      sessionId: 'session_' + Date.now(),
      loginTime: new Date().toISOString()
    };
    
    // ✅ SAVE SESSION DATA FOR PERSISTENT LOGIN (30 days)
    const expiryTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
    
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    localStorage.setItem('lastLogin', new Date().toISOString());
    
    console.log('✅ Session saved for persistent login');
    setUser(sessionData);
  };

  const handleLogout = () => {
    console.log('👋 User logging out:', user?.email);
    
    // ✅ CLEAR ALL SESSION DATA
    localStorage.removeItem('userSession');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('isLocked');
    localStorage.removeItem('lockTime');
    
    setUser(null);
  };

  // Show loading while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Checking Session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Router>
        {user ? (
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