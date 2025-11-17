// Index_Page.jsx - Fixed version
import React, { useState, useEffect } from 'react';

export const Index_Page = () => {
  const [whatsappStatus, setWhatsappStatus] = useState({
    ready: false,
    hasQR: false,
    message: '',
    loading: true
  });
  const [resetLoading, setResetLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://baba-mob-backend.onrender.com';

  // Fetch WhatsApp status with better error handling
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

  // Load status on component mount
  useEffect(() => {
    fetchWhatsAppStatus();
    
    // Refresh status every 10 seconds
    const interval = setInterval(fetchWhatsAppStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white flex flex-col">
      {/* Header - Shop Details */}
      <header className="bg-orange-600 text-white px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between shadow-md">
        
        {/* Left - WhatsApp Connection Button */}
        <div className="flex items-center space-x-2">
          {whatsappStatus.loading ? (
            <div className="flex items-center space-x-2 bg-orange-700 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Checking...</span>
            </div>
          ) : whatsappStatus.ready ? (
            <button
              onClick={resetWhatsApp}
              disabled={resetLoading}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
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
          ) : (
            <button
              onClick={() => window.open(`${API_BASE}/whatsapp/qr-display`, '_blank')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
            >
              <span className="text-sm">📱</span>
              <span className="text-xs font-medium">Add WhatsApp</span>
            </button>
          )}
          
          {/* Status Indicator */}
          <div className={`w-2 h-2 rounded-full ${
            whatsappStatus.ready ? 'bg-green-400 animate-pulse' : 
            whatsappStatus.hasQR ? 'bg-yellow-400 animate-pulse' : 
            'bg-red-400'
          }`} title={whatsappStatus.message}></div>
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