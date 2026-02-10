
import React from 'react';
import { AppView } from '../types';

interface LandingPageProps {
  onViewChange: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onViewChange }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Jedan Dodir, <br/>
                <span className="text-indigo-600">Beskrajne Mogućnosti.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Pretvorite vaše NFC tagove u moćne digitalne portale. Prikažite menije, 
                specijalne ponude i događaje vašim gostima u sekundi, bez ikakvih aplikacija.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => onViewChange('DASHBOARD')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-200"
                >
                  Kreiraj svoj profil
                </button>
                <button className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all">
                  Pogledaj demo
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <img 
                src="https://picsum.photos/seed/nfc/800/600" 
                alt="NFC Technology" 
                className="rounded-3xl shadow-2xl relative z-10 border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Zašto Tappo?</h2>
            <p className="text-gray-600">Modernizujte vaše poslovanje uz najnoviju tehnologiju.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Digitalni Meni', 
                desc: 'Ažurirajte cene i artikle u realnom vremenu bez troškova štampanja.', 
                icon: '📋' 
              },
              { 
                title: 'Automatske Akcije', 
                desc: 'Neka vaši gosti zaprate vaše društvene mreže ili ostave recenziju jednim dodirom.', 
                icon: '⚡' 
              },
              { 
                title: 'Analitika', 
                desc: 'Pratite broj tapova i popularnost ponuda kroz našu kontrolnu tablu.', 
                icon: '📊' 
              },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
