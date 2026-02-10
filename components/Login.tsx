import React, { useState } from 'react';

interface LoginProps {
  // Changed onLogin type to match handleLogin in App.tsx
  onLogin: (email: string) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Pass the current email state to the onLogin callback
      onLogin(email);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <button onClick={onBack} className="text-gray-400 hover:text-indigo-600 mb-6 flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Nazad
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dobrodošli nazad</h2>
        <p className="text-gray-500 mb-8">Prijavite se da biste upravljali vašim NFC profilom.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email adresa</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="vlasnik@lokala.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lozinka</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Prijavi se'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Nemate nalog? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Započnite saradnju</span>
        </p>
      </div>
    </div>
  );
};

export default Login;