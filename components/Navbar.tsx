
import React, { useState } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onDashboardClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, isLoggedIn, onLogout, onDashboardClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => {
              onViewChange('LANDING');
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="bg-indigo-600 p-2 rounded-xl mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-100">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-5.697-1.76l-.054-.09m14.752-1.42a10.003 10.003 0 000-11.314M12 3c4.418 0 8 3.582 8 8s-3.582 8-8 8M12 3v1m0 16v1m9-9h-1M3 12h1m11.293-6.293l-.707.707M5.414 18.586l.707-.707M18.586 18.586l-.707-.707M5.414 5.414l.707.707" />
              </svg>
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700 tracking-tighter">
              Tappo
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <button 
              onClick={() => onViewChange('LANDING')}
              className={`${currentView === 'LANDING' ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-500 font-bold transition-colors text-sm uppercase tracking-widest`}
            >
              Početna
            </button>
            <button 
              onClick={onDashboardClick}
              className={`${currentView === 'DASHBOARD' ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-500 font-bold transition-colors text-sm uppercase tracking-widest`}
            >
              Moja Tabla
            </button>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button 
                   onClick={onLogout}
                   className="text-gray-400 hover:text-red-500 text-sm font-bold transition-colors"
                >
                  Odjavi se
                </button>
                <button 
                  onClick={onDashboardClick}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onViewChange('LOGIN')}
                  className="text-gray-500 hover:text-indigo-600 text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Prijava
                </button>
                <button 
                  onClick={() => onViewChange('REGISTER')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  Registracija
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
           <button 
            onClick={() => {
              onViewChange('LANDING');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-bold text-gray-700 uppercase text-xs tracking-widest"
          >
            Početna
          </button>
          <button 
            onClick={() => {
              onDashboardClick();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-bold text-gray-700 uppercase text-xs tracking-widest"
          >
            Moja Tabla
          </button>
          {isLoggedIn ? (
            <button 
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 font-bold text-red-500 uppercase text-xs tracking-widest"
            >
              Odjavi se
            </button>
          ) : (
            <div className="space-y-4 pt-4 border-t">
              <button 
                onClick={() => {
                  onViewChange('LOGIN');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-center py-2 font-bold text-gray-500 uppercase text-xs tracking-widest"
              >
                Prijava
              </button>
              <button 
                onClick={() => {
                  onViewChange('REGISTER');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-center uppercase text-xs tracking-widest"
              >
                Započni / Registracija
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
