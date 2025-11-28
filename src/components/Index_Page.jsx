// components/Index_Page.jsx - Updated with User Info and Session Management
import React, { useState, useEffect } from 'react';

export const Index_Page = ({ user, onLogout }) => {
  const [whatsappStatus, setWhatsappStatus] = useState({
    ready: false,
    hasQR: false,
    sessionExists: false,
    sessionType: '',
    environment: '',
    message: '',
    loading: true
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lastLogin, setLastLogin] = useState('');

  // ✅ DYNAMIC API BASE DETECTION
  const getApiBase = () => {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      return 'http://localhost:5000';
    } else {
      return 'https://baba-mob-backend.onrender.com';
    }
  };

  const API_BASE = getApiBase();

  // ✅ GET LAST LOGIN TIME
  useEffect(() => {
    const savedLastLogin = localStorage.getItem('lastLogin');
    if (savedLastLogin) {
      const loginDate = new Date(savedLastLogin);
      setLastLogin(loginDate.toLocaleString());
    }
  }, []);

  // Fetch WhatsApp status
  const fetchWhatsAppStatus = async () => {
    try {
      setWhatsappStatus(prev => ({ ...prev, loading: true }));
      
      const response = await fetch(`${API_BASE}/whatsapp/status`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setWhatsappStatus({
        ...data,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching WhatsApp status:', error);
      setWhatsappStatus({
        ready: false,
        hasQR: false,
        sessionExists: false,
        sessionType: '',
        environment: '',
        message: 'Cannot connect to backend service',
        loading: false
      });
    }
  };

  // Reset WhatsApp session
  const resetWhatsApp = async () => {
    try {
      setResetLoading(true);
      const response = await fetch(`${API_BASE}/whatsapp/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Reset failed');
      
      setTimeout(() => {
        fetchWhatsAppStatus();
        setResetLoading(false);
        window.open(`${API_BASE}/whatsapp/qr-display`, '_blank');
      }, 2000);
      
    } catch (error) {
      console.error('Error resetting WhatsApp:', error);
      setResetLoading(false);
      alert('Failed to reset WhatsApp: ' + error.message);
    }
  };

  const openQRPage = () => {
    const qrUrl = `${API_BASE}/whatsapp/qr-display`;
    window.open(qrUrl, '_blank');
  };

  // Load status on component mount
  useEffect(() => {
    fetchWhatsAppStatus();
    const interval = setInterval(fetchWhatsAppStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // ✅ WhatsApp Button
  const renderWhatsAppButton = () => {
    if (whatsappStatus.loading) {
      return (
        <div className="flex items-center space-x-2 bg-orange-700 px-3 py-1 rounded-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-xs font-medium">Checking...</span>
        </div>
      );
    }

    if (whatsappStatus.ready) {
      return (
        <span
          onClick={resetWhatsApp}
          disabled={resetLoading}
          className="flex items-center space-x-2 h-12 bg-black hover:bg-black border border border-black hover:border-green-500 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
        >
          {resetLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium">Resetting...</span>
            </>
          ) : (
            <>
              <span className="text-sm">✅</span>
              <span className="text-xs font-medium">Reset WhatsApp</span>
            </>
          )}
        </span>
      );
    }

    if (whatsappStatus.sessionExists && !whatsappStatus.ready) {
      return (
        <span
          onClick={openQRPage}
          className="flex items-center h-12 space-x-2 bg-black hover:bg-black px-3 py-1 rounded-lg transition-colors"
        >
          <span className="text-sm">🔄</span>
          <span className="text-xs font-medium">Reconnect</span>
        </span>
      );
    }

    return (
      <span
        onClick={openQRPage}
        className="flex items-center space-x-2 h-12 bg-black hover:bg-black border border border-black hover:border-blue-500 px-3 py-1 rounded-lg transition-colors"
      >
        <span className="text-sm">📱</span>
        <span className="text-xs font-medium">Add WhatsApp</span>
      </span>
    );
  };

  // ✅ Status Indicator
  const renderStatusIndicator = () => {
    let color = 'bg-red-400';
    if (whatsappStatus.ready) color = 'bg-green-400 animate-pulse';
    else if (whatsappStatus.sessionExists) color = 'bg-yellow-400 animate-pulse';
    else if (whatsappStatus.hasQR) color = 'bg-blue-400 animate-pulse';

    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-xs text-gray-300">
          {whatsappStatus.environment}
        </span>
      </div>
    );
  };

  // ✅ User Dropdown Menu with session info
  const renderUserMenu = () => (
    <div className="absolute right-0 top-12 w-64 bg-white border border-orange-300 rounded-lg shadow-lg z-50">
      <div className="p-3 border-b border-orange-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.initial || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
            <p className="text-xs text-orange-600">{user?.role}</p>
            {lastLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Last login: {lastLogin}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-2 space-y-1">
        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 rounded">
          💡 You will stay logged in for 30 days
        </div>
        <button
          onClick={onLogout}
          className="w-full text-center h-12 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white flex flex-col">
      <header className="bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between shadow-md">
        
        {/* Left - WhatsApp Connection */}
        <div className="flex items-center space-x-2">
          {renderWhatsAppButton()}
          {renderStatusIndicator()}
        </div>

        {/* Center - Title with Trial Period */}
        <div className="flex-1 text-center">
          <h1 className="text-md sm:text-lg font-bold tracking-tight font-serif">
            BAABA MOBILE WORLD
          </h1>
          {/* ✅ TRIAL PERIOD MESSAGE IN HEADER */}
          <div className="bg-yellow-500 text-white text-xs py-1 px-2 rounded-full mt-1 inline-block animate-pulse">
            ⏰ TRIAL PERIOD : 2 DAYS LEFT
          </div>
        </div>

        {/* Right - User Menu */}
        <div className="mr-7 user-menu-container relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 bg-orange-700 hover:bg-orange-800 px-3 py-1 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm font-bold">
                {user?.initial || 'U'}
              </span>
            </div>
            <span className="text-xs font-medium">{user?.username}</span>
          </button>

          {showUserMenu && renderUserMenu()}
        </div>
      </header>
    </div>
  );
};

export default Index_Page;