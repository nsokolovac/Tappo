
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
            <h2 className="text-4xl font-black mb-6 leading-tight tracking-tighter uppercase">Tappo Nalog</h2>
            <p className="text-indigo-100 font-medium">Upravljajte svojim lokacijama sa jednog mesta.</p>
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

        <div className="md:w-2/3 p-12">
          <button onClick={step > 1 ? () => setStep(step - 1) : onBack} className="text-gray-400 hover:text-indigo-600 mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">Nazad</button>
          
          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase">Nalog</h3>
                <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Email"/>
                <input required name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Lozinka"/>
                <input required name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Potvrda lozinke"/>
                <button type="button" onClick={nextStep} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Nastavi</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase">Prvi objekat</h3>
                <input required name="businessName" type="text" value={formData.businessName} onChange={handleInputChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Naziv Lokala"/>
                <input required name="address" type="text" value={formData.location.address} onChange={handleLocationChange} className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl font-bold" placeholder="Adresa (Grad, Ulica)"/>
                <button type="button" onClick={nextStep} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Nastavi</button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase tracking-tight">Pretplata</h3>
                <div className="grid gap-3">
                  {SUBSCRIPTION_OPTIONS.map((option) => (
                    <label key={option.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer ${formData.selectedPlanId === option.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-50'}`}>
                      <input type="radio" name="selectedPlanId" value={option.id} checked={formData.selectedPlanId === option.id} onChange={handleInputChange} className="hidden"/>
                      <span className="font-black text-gray-900 uppercase text-[10px]">{option.name}</span>
                      <span className="font-black text-gray-900 text-sm">€{option.pricePerMonth}</span>
                    </label>
                  ))}
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Završi registraciju</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
