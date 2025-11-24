// components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // User database - you can expand this later
  const users = [
    { email: 'admin@baaba.com', password: 'admin123', username: 'Admin', role: 'Super Admin' },
    { email: 'manager@baaba.com', password: 'manager123', username: 'Manager', role: 'Manager' },
  ];

  const maxAttempts = 3;
  const lockoutTime = 300000; // 5 minutes

  // ✅ CHECK FOR EXISTING SESSION ON COMPONENT MOUNT
  useEffect(() => {
    const checkExistingSession = () => {
      const savedSession = localStorage.getItem('userSession');
      const sessionExpiry = localStorage.getItem('sessionExpiry');
      
      if (savedSession && sessionExpiry) {
        const now = new Date().getTime();
        if (now < parseInt(sessionExpiry)) {
          // Session is still valid
          const userData = JSON.parse(savedSession);
          console.log('🔄 Auto-login with existing session');
          onLogin(userData);
          navigate('/');
        } else {
          // Session expired
          localStorage.removeItem('userSession');
          localStorage.removeItem('sessionExpiry');
          console.log('❌ Session expired');
        }
      }
    };

    checkExistingSession();
  }, [onLogin, navigate]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load attempts and lock status from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('loginAttempts');
    const savedLockStatus = localStorage.getItem('isLocked');
    const savedLockTime = localStorage.getItem('lockTime');
    
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
    
    if (savedLockStatus === 'true') {
      const lockTime = parseInt(savedLockTime);
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lockTime;
      
      if (timeElapsed < lockoutTime) {
        setIsLocked(true);
        const remainingTime = lockoutTime - timeElapsed;
        const initialTimeLeft = Math.ceil(remainingTime / 1000);
        setTimeLeft(initialTimeLeft);
        setError(`Too many failed attempts! Account locked for ${formatTime(initialTimeLeft)} minutes.`);
        
        const interval = setInterval(() => {
          setTimeLeft(prev => {
            const newTime = prev - 1;
            if (newTime <= 0) {
              clearInterval(interval);
              handleUnlock();
              return 0;
            }
            return newTime;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        handleUnlock();
      }
    }
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    setAttempts(0);
    setTimeLeft(0);
    localStorage.removeItem('isLocked');
    localStorage.removeItem('lockTime');
    localStorage.removeItem('loginAttempts');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Account locked. Please wait ${formatTime(timeLeft)} minutes.`);
      return;
    }
    
    setIsLoading(true);
    
    // Check if credentials match any user
    const matchedUser = users.find(user => 
      user.email === email && user.password === password
    );
    
    if (matchedUser) {
      // Reset attempts on successful login
      setAttempts(0);
      setIsLocked(false);
      setTimeLeft(0);
      
      try {
        const userData = { 
          email: matchedUser.email,
          username: matchedUser.username, 
          role: matchedUser.role,
          initial: matchedUser.username.charAt(0).toUpperCase(),
          loginTime: new Date().toISOString()
        };
        
        // ✅ SAVE SESSION DATA FOR PERSISTENT LOGIN
        const sessionData = {
          ...userData,
          sessionId: 'session_' + Date.now()
        };
        
        // Save session to localStorage with 30-day expiry
        const expiryTime = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days
        
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        localStorage.setItem('sessionExpiry', expiryTime.toString());
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        console.log('✅ Session saved for persistent login');
        
        // Call the onLogin prop with user data
        onLogin(sessionData);
        
        // Clear login attempt data
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('isLocked');
        localStorage.removeItem('lockTime');
        
        navigate('/');
        setError('');
      } catch (error) {
        setError('Login failed. Please try again.');
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      if (newAttempts >= maxAttempts) {
        const initialTime = Math.ceil(lockoutTime / 1000);
        setTimeLeft(initialTime);
        setIsLocked(true);
        localStorage.setItem('isLocked', 'true');
        localStorage.setItem('lockTime', new Date().getTime().toString());
        
        setError(`Too many failed attempts! Account locked for ${formatTime(initialTime)} minutes.`);
        
        const interval = setInterval(() => {
          setTimeLeft(prev => {
            const newTime = prev - 1;
            if (newTime <= 0) {
              clearInterval(interval);
              handleUnlock();
              return 0;
            }
            return newTime;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        setError(`Invalid credentials. ${maxAttempts - newAttempts} attempts remaining.`);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      {/* Main Container - Centered properly */}
      <div className="w-full max-w-md mx-auto">
        


        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-500 rounded">
          
          {/* Header Section with Branding */}
          <div className="bg-orange-500 py-6 px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-25 h-25 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/logo_2.png" 
                alt="Baaba Mobile World Logo" 
                className="w-50 h-50 object-contain p-1"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Fallback text if image fails to load */}
              <span className="text-orange-500 text-2xl font-bold hidden">B</span>
            </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">BAABA MOBILE WORLD</h1>
            <p className="text-orange-100 text-sm">Billing System Login</p>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className={`bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center ${isLocked ? 'animate-pulse' : ''}`}>
                  {error}
                </div>
              )}
              
              {/* Email Field */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-orange-300 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter your email"
                  required
                  disabled={isLocked || isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-orange-300 text-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  disabled={isLocked || isLoading}
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className={`w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 ${
                  isLoading || isLocked ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02]'
                }`}
                disabled={isLocked || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>PROCESSING...</span>
                  </div>
                ) : isLocked ? (
                  'ACCOUNT LOCKED'
                ) : (
                  'LOGIN'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-semibold mb-2">DEMO ACCOUNTS</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>admin@baaba.com</span>
                    <span className="text-orange-500 font-medium">admin123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>manager@baaba.com</span>
                    <span className="text-orange-500 font-medium">manager123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-4">
          <p className="text-orange-100 text-xs">Secure Billing System • Version 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;