// Index_Page.jsx - Updated with environment detection
import React, { useState, useEffect } from 'react';

export const Index_Page = () => {
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

  // ✅ DYNAMIC API BASE DETECTION
  const getApiBase = () => {
    // Check if we're in development (localhost)
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      return 'http://localhost:5000'; // Local backend
    } else {
      return 'https://baba-mob-backend.onrender.com'; // Render backend
    }
  };

  const API_BASE = getApiBase();
  console.log('🌐 Using API Base:', API_BASE);

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📱 WhatsApp Status:', data);
      
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
      
      if (!response.ok) {
        throw new Error('Reset failed');
      }
      
      const result = await response.json();
      console.log('🔄 Reset result:', result);
      
      // Refresh status and open QR page
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

  // Open QR page based on environment
  const openQRPage = () => {
    const qrUrl = `${API_BASE}/whatsapp/qr-display`;
    console.log(`📱 Opening QR page: ${qrUrl}`);
    console.log(`💾 Session will be stored in: ${whatsappStatus.sessionType}`);
    window.open(qrUrl, '_blank');
  };

  // Load status on component mount
  useEffect(() => {
    fetchWhatsAppStatus();
    
    // Refresh status every 10 seconds
    const interval = setInterval(fetchWhatsAppStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ DYNAMIC BUTTON RENDERING
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
        <button
          onClick={resetWhatsApp}
          disabled={resetLoading}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
          title={`Connected via ${whatsappStatus.sessionType} (${whatsappStatus.environment})`}
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
        </button>
      );
    }

    if (whatsappStatus.sessionExists && !whatsappStatus.ready) {
      return (
        <button
          onClick={openQRPage}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-lg transition-colors"
          title={`Session exists in ${whatsappStatus.sessionType} - Click to reconnect`}
        >
          <span className="text-sm">🔄</span>
          <span className="text-xs font-medium">Reconnect</span>
        </button>
      );
    }

    // No session exists - show Add WhatsApp button
    return (
      <button
        onClick={openQRPage}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
        title={`Connect WhatsApp - Session will be stored in ${whatsappStatus.sessionType}`}
      >
        <span className="text-sm">📱</span>
        <span className="text-xs font-medium">Add WhatsApp</span>
      </button>
    );
  };

  // ✅ STATUS INDICATOR WITH ENVIRONMENT INFO
  const renderStatusIndicator = () => {
    let color = 'bg-red-400';
    let title = whatsappStatus.message;

    if (whatsappStatus.ready) {
      color = 'bg-green-400 animate-pulse';
      title = `Connected (${whatsappStatus.sessionType} on ${whatsappStatus.environment})`;
    } else if (whatsappStatus.sessionExists) {
      color = 'bg-yellow-400 animate-pulse';
      title = `Session exists - Reconnecting (${whatsappStatus.sessionType} on ${whatsappStatus.environment})`;
    } else if (whatsappStatus.hasQR) {
      color = 'bg-blue-400 animate-pulse';
      title = 'QR Code Ready - Scan to Connect';
    }

    return (
      <div className="flex items-center space-x-2">
        <div 
          className={`w-2 h-2 rounded-full ${color}`} 
          title={title}
        ></div>
        <span className="text-xs text-gray-300" title={`Environment: ${whatsappStatus.environment}`}>
          {whatsappStatus.environment}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white flex flex-col">
      <header className="bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between shadow-md">
        
        {/* Left - WhatsApp Connection Button */}
        <div className="flex items-center space-x-2">
          {renderWhatsAppButton()}
          {renderStatusIndicator()}
        </div>

        {/* Center - Mobile Shop Billing */}
        <h1 className="text-md sm:text-lg font-bold text-center tracking-tight font-serif flex-1 text-center">
          Mobile Shop Billing
        </h1>

        {/* Right - Empty space for balance */}
        <div className="w-20"></div>
      </header>
    </div>
  );
};