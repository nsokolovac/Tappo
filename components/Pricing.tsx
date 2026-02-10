
import React from 'react';
import { SUBSCRIPTION_OPTIONS } from '../constants';

interface PricingProps {
  activeCycle?: string;
  onSelect: (planId: any, cycle: string) => void;
  onBack: () => void;
}

const Pricing: React.FC<PricingProps> = ({ activeCycle, onSelect, onBack }) => {
  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <button onClick={onBack} className="mb-8 text-indigo-600 font-bold flex items-center gap-2 mx-auto hover:underline uppercase text-[10px] tracking-widest">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Nazad na tablu
          </button>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight text-center">Plan Naplate</h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto text-center">
            Izaberi period pretplate koji najbolje odgovara tvom biznisu. Što je duži period, veća je ušteda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 items-stretch">
          {SUBSCRIPTION_OPTIONS.map((option) => {
            const isActive = activeCycle === option.id;
            return (
              <div 
                key={option.id} 
                className={`bg-white rounded-[3rem] p-10 shadow-xl flex flex-col items-center text-center transition-all h-full relative ${
                  isActive 
                  ? 'border-4 border-indigo-600 ring-8 ring-indigo-50 scale-105 z-10' 
                  : 'border border-gray-100 hover:scale-[1.02]'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 transform -translate-y-1/2 bg-indigo-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Vaš Trenutni Plan
                  </div>
                )}
                
                <div className="h-6 flex items-center mb-6">
                  <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {option.discountLabel}
                  </div>
                </div>
                
                <h3 className="text-lg font-black text-gray-900 mb-2 min-h-[3rem] flex items-center justify-center leading-tight">
                  {option.name}
                </h3>
                
                <div className="my-6">
                  <span className={`text-4xl font-black ${isActive ? 'text-indigo-600' : 'text-gray-900'}`}>€{option.pricePerMonth}</span>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">po mesecu</p>
                </div>

                <div className="bg-gray-50 w-full p-4 rounded-2xl mb-8 mt-auto">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-1">Ukupno za uplatu:</p>
                  <p className="text-xl font-black text-gray-900">€{option.totalPrice}</p>
                </div>

                <button 
                  onClick={() => !isActive && onSelect('BASIC', option.id)}
                  disabled={isActive}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                    isActive 
                    ? 'bg-gray-100 text-gray-400 cursor-default shadow-none' 
                    : 'bg-gray-900 text-white hover:bg-indigo-600'
                  }`}
                >
                  {isActive ? 'Aktivan' : 'Aktiviraj'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
