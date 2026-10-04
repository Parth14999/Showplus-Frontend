import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar({ onNavigate, activeTab }) {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    if (onNavigate) onNavigate('home');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate && onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-2xl">🍿</span>
          <span className="text-xl font-black tracking-wider text-white group-hover:text-rose-500 transition">
            SHOW<span className="text-rose-500">Pulse</span>
          </span>
        </div>

        {/* Right Section Navigation */}
        <div className="flex items-center gap-4">
          
        
        

          {/* User Profile Menu / Login Button */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black uppercase text-[10px]">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span>{user.name || 'User'}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                  
                  {/* User info preview */}
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user.name || 'User'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email || 'user@example.com'}</p>
                  </div>

                  {/* Nav Links */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onNavigate) onNavigate('tickets');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition flex items-center gap-2"
                  >
                    <span>🎫</span> My Tickets
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onNavigate) onNavigate('home');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition flex items-center gap-2"
                  >
                    <span>🎬</span> Browse Movies
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-2"
                  >
                    <span>🚪</span> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}