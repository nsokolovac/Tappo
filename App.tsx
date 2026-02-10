
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import PublicProfile from './components/PublicProfile';
import Login from './components/Login';
import Register from './components/Register';
import Pricing from './components/Pricing';
import { AppView, BusinessProfile, User } from './types';

const calculateNextBillingDate = (cycle: string): string => {
  const now = new Date();
  let monthsToAdd = 1;
  if (cycle === 'QUARTERLY') monthsToAdd = 3;
  if (cycle === 'BIANNUAL') monthsToAdd = 6;
  if (cycle === 'ANNUAL') monthsToAdd = 12;
  
  now.setMonth(now.getMonth() + monthsToAdd);
  return now.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }) + '.';
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleLogin = (email: string) => {
    setUser({ email });
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setProfiles([]);
    setSelectedProfileId(null);
    setCurrentView('LANDING');
  };

  const handleRegister = (data: any) => {
    const newUser: User = { email: data.email };
    setUser(newUser);
    
    const nextDate = calculateNextBillingDate(data.selectedPlanId);
    
    const firstProfile: BusinessProfile = {
      id: Math.random().toString(36).substr(2, 9),
      ownerEmail: data.email,
      name: data.businessName,
      description: 'Dobrodošli u naš novi objekat!',
      contact: data.contact,
      location: {
        address: data.location.address,
        lat: 44.812,
        lng: 20.457
      },
      socials: data.socials,
      menuGroups: [],
      offers: [],
      events: [],
      gallery: [],
      subscription: {
        billingCycle: data.selectedPlanId,
        nextBillingDate: nextDate,
        pricePerMonth: data.selectedPlanId === 'ANNUAL' ? 14 : data.selectedPlanId === 'BIANNUAL' ? 16 : data.selectedPlanId === 'QUARTERLY' ? 18 : 20
      }
    };

    setProfiles([firstProfile]);
    setSelectedProfileId(firstProfile.id);
    setCurrentView('DASHBOARD');
  };

  const handleUpdateProfile = (updatedProfile: BusinessProfile) => {
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  const handleCreateNewProfile = (newProfileData: Partial<BusinessProfile>) => {
    if (!user) return;
    const newProfile: BusinessProfile = {
      id: Math.random().toString(36).substr(2, 9),
      ownerEmail: user.email,
      name: newProfileData.name || 'Novi Objekat',
      description: '',
      contact: '',
      location: { address: '', lat: 44.812, lng: 20.457 },
      socials: {},
      menuGroups: [],
      offers: [],
      events: [],
      gallery: [],
      subscription: {
        billingCycle: 'MONTHLY',
        nextBillingDate: calculateNextBillingDate('MONTHLY'),
        pricePerMonth: 20
      }
    };
    setProfiles([...profiles, newProfile]);
  };

  const activeProfile = profiles.find(p => p.id === selectedProfileId);

  return (
    <div className="min-h-screen bg-white">
      {currentView !== 'PROFILE_PREVIEW' && (
        <Navbar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isLoggedIn={!!user} 
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView(user ? 'DASHBOARD' : 'LOGIN')}
        />
      )}

      <main>
        {currentView === 'LANDING' && <LandingPage onViewChange={setCurrentView} />}
        
        {currentView === 'DASHBOARD' && (
          <Dashboard 
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelectProfile={setSelectedProfileId}
            onUpdateProfile={handleUpdateProfile}
            onCreateProfile={handleCreateNewProfile}
            onViewChange={setCurrentView}
          />
        )}

        {currentView === 'PROFILE_PREVIEW' && activeProfile && (
          <PublicProfile profile={activeProfile} onBack={() => setCurrentView('DASHBOARD')} />
        )}

        {currentView === 'LOGIN' && (
          <Login onLogin={handleLogin} onBack={() => setCurrentView('LANDING')} />
        )}

        {currentView === 'REGISTER' && (
          <Register onRegister={handleRegister} onBack={() => setCurrentView('LANDING')} />
        )}

        {currentView === 'PRICING' && activeProfile && (
          <Pricing 
            activeCycle={activeProfile.subscription?.billingCycle} 
            onSelect={(id, cycle) => {
               const nextDate = calculateNextBillingDate(cycle);
               const updated = { 
                 ...activeProfile, 
                 subscription: { 
                   ...activeProfile.subscription!, 
                   billingCycle: cycle,
                   nextBillingDate: nextDate
                 } 
               };
               handleUpdateProfile(updated);
               setCurrentView('DASHBOARD');
            }} 
            onBack={() => setCurrentView('DASHBOARD')} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
