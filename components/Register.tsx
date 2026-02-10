
import React, { useState } from 'react';
import { SUBSCRIPTION_OPTIONS } from '../constants';

interface RegisterProps {
  onRegister: (data: any) => void;
  onBack: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onBack }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    contact: '',
    selectedPlanId: 'MONTHLY',
    location: {
      address: '',
    },
    socials: {
      instagram: '',
      facebook: '',
      tiktok: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ 
      ...formData, 
      location: { ...formData.location, address: e.target.value } 
    });
  };

  const validateStep = () => {
    const newErrors = [];
    if (step === 1) {
      if (!formData.email.includes('@')) newErrors.push('Unesite validan email.');
      if (formData.password.length < 6) newErrors.push('Lozinka mora imati bar 6 karaktera.');
      if (formData.password !== formData.confirmPassword) newErrors.push('Lozinke se ne podudaraju.');
    } else if (step === 2) {
      if (!formData.businessName) newErrors.push('Naziv lokala je obavezan.');
      if (!formData.location.address) newErrors.push('Adresa je obavezna.');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      onRegister(formData);
    }
  };

  const selectedPlan = SUBSCRIPTION_OPTIONS.find(opt => opt.id === formData.selectedPlanId);

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        <div className="md:w-1/3 bg-indigo-600 p-12 text-white flex flex-col justify-between">
          <div>
            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-md">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 18a10.003 10.003 0 01-5.697-1.76l-.054-.09m14.752-1.42a10.003 10.003 0 000-11.314M12 3c4.418 0 8 3.582 8 8s-3.582 8-8 8M12 3v1m0 16v1m9-9h-1M3 12h1m11.293-6.293l-.707.707M5.414 18.586l.707-.707M18.586 18.586l-.707-.707M5.414 5.414l.707.707" /></svg>
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight tracking-tighter uppercase">Tappo Nalog</h2>
            <p className="text-indigo-100 font-medium">Kreirajte nalog i upravljajte svim svojim lokacijama sa jednog mesta.</p>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex items-center gap-4 transition-opacity duration-300 ${step === s ? 'opacity-100' : 'opacity-30'}`}>
                <span className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-black text-sm">{s}</span>
                <span className="font-black uppercase text-[10px] tracking-widest">{s === 1 ? 'Nalog' : s === 2 ? 'Lokal' : 'Pretplata'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-2/3 p-12 md:p-16">
          <button onClick={step > 1 ? () => setStep(step - 1) : onBack} className="text-gray-400 hover:text-indigo-600 mb-10 flex items-center gap-2 transition-colors font-black uppercase text-[10px] tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Nazad
          </button>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-tight">
              {errors.map((err, i) => <p key={i}>{err}</p>)}
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Podaci o nalogu</h3>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Email adresa (Username)</label>
                  <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="vlasnik@lokala.com"/>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Lozinka</label>
                    <input required name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="••••••••"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Potvrdi lozinku</label>
                    <input required name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="••••••••"/>
                  </div>
                </div>
                <button type="button" onClick={nextStep} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all">Nastavi na podatke o lokalu</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Vaš prvi objekat</h3>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Naziv Lokala</label>
                  <input required name="businessName" type="text" value={formData.businessName} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="npr. Central Coffee"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Adresa (Ulica, broj, grad)</label>
                  <input required name="address" type="text" value={formData.location.address} onChange={handleLocationChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="Knez Mihailova 1, Beograd"/>
                </div>
                <button type="button" onClick={nextStep} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl transition-all">Nastavi na izbor pretplate</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <h3 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Izbor pretplate</h3>
                <div className="grid gap-3">
                  {SUBSCRIPTION_OPTIONS.map((option) => (
                    <label key={option.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.selectedPlanId === option.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-50 bg-white'}`}>
                      <input type="radio" name="selectedPlanId" value={option.id} checked={formData.selectedPlanId === option.id} onChange={handleInputChange} className="hidden"/>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.selectedPlanId === option.id ? 'border-indigo-600' : 'border-gray-200'}`}>
                          {formData.selectedPlanId === option.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                        </div>
                        <span className="font-black text-gray-900 uppercase text-[10px] tracking-tight">{option.name}</span>
                      </div>
                      <span className="font-black text-gray-900 text-sm">€{option.pricePerMonth}</span>
                    </label>
                  ))}
                </div>
                <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-2xl mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400">Ukupno</p>
                      <p className="text-2xl font-black">€{selectedPlan?.totalPrice.toFixed(2)}</p>
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all">Završi registraciju</button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
