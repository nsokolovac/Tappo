
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BusinessProfile, AppView, MenuGroup, MenuItem, Offer, Event } from '../types';
import { generateDescription } from '../services/geminiService';
import { SUBSCRIPTION_OPTIONS } from '../constants';

const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

interface DashboardProps {
  profiles: BusinessProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string | null) => void;
  onUpdateProfile: (profile: BusinessProfile) => void;
  onCreateProfile: (data: Partial<BusinessProfile>) => void;
  onViewChange: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  profiles, 
  selectedProfileId, 
  onSelectProfile, 
  onUpdateProfile,
  onCreateProfile,
  onViewChange 
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'offers' | 'events' | 'gallery' | 'billing'>('info');
  const [editingItem, setEditingItem] = useState<{ type: string; groupId?: string; id?: string; data: any } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const profile = profiles.find(p => p.id === selectedProfileId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [localName, setLocalName] = useState(profile?.name || '');
  const [localAddress, setLocalAddress] = useState(profile?.location.address || '');
  const [localDesc, setLocalDesc] = useState(profile?.description || '');

  useEffect(() => {
    if (profile) {
      setLocalName(profile.name);
      setLocalAddress(profile.location.address);
      setLocalDesc(profile.description);
    }
  }, [profile?.id]);

  const updateProfileField = useCallback((field: keyof BusinessProfile, value: any) => {
    if (!profile) return;
    onUpdateProfile({ ...profile, [field]: value });
  }, [profile, onUpdateProfile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        updateProfileField('coverImage', compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && profile) {
      const newImages = [...(profile.gallery || [])];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const filePromise = new Promise<string>((resolve) => {
          reader.onloadend = async () => {
            const compressed = await compressImage(reader.result as string, 800, 800);
            resolve(compressed);
          };
          reader.readAsDataURL(files[i]);
        });
        const compressed = await filePromise;
        newImages.push(compressed);
      }
      updateProfileField('gallery', newImages);
    }
  };

  const deleteGalleryImage = (idx: number) => {
    if (!profile) return;
    const newGallery = profile.gallery.filter((_, i) => i !== idx);
    updateProfileField('gallery', newGallery);
  };

  const handleGenerateDescription = async () => {
    if (!profile || isGenerating) return;
    setIsGenerating(true);
    try {
      const desc = await generateDescription(profile.name, "Poslovni objekat");
      if (desc) {
        setLocalDesc(desc);
        updateProfileField('description', desc);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const saveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !profile) return;
    const { type, groupId, id, data } = editingItem;
    let updatedProfile = { ...profile };

    if (type === 'group') {
      const groups = updatedProfile.menuGroups || [];
      if (id) {
        updatedProfile.menuGroups = groups.map(g => g.id === id ? { ...g, name: data.name } : g);
      } else {
        updatedProfile.menuGroups = [...groups, { id: Date.now().toString(), name: data.name, items: [] }];
      }
    } else if (type === 'menuItem') {
      updatedProfile.menuGroups = updatedProfile.menuGroups.map(g => {
        if (g.id === groupId) {
          const items = g.items || [];
          if (id) return { ...g, items: items.map(it => it.id === id ? { ...data, id } : it) };
          return { ...g, items: [...items, { ...data, id: Date.now().toString() }] };
        }
        return g;
      });
    } else {
      const list = (updatedProfile[type as keyof BusinessProfile] as any[]) || [];
      if (id) {
        (updatedProfile as any)[type] = list.map(it => it.id === id ? { ...data, id } : it);
      } else {
        (updatedProfile as any)[type] = [...list, { ...data, id: Date.now().toString() }];
      }
    }
    onUpdateProfile(updatedProfile);
    setEditingItem(null);
  };

  const deleteItem = (type: string, id: string, groupId?: string) => {
    if (!profile) return;
    let updatedProfile = { ...profile };
    if (type === 'menuItem' && groupId) {
      updatedProfile.menuGroups = updatedProfile.menuGroups.map(g => 
        g.id === groupId ? { ...g, items: g.items.filter(it => it.id !== id) } : g
      );
    } else if (type === 'group') {
      updatedProfile.menuGroups = updatedProfile.menuGroups.filter(g => g.id !== id);
    } else {
      (updatedProfile as any)[type] = ((updatedProfile as any)[type] || []).filter((it: any) => it.id !== id);
    }
    onUpdateProfile(updatedProfile);
  };

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Moji Objekti</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Status: Online</p>
          </div>
          <button onClick={() => setIsCreatingNew(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition-all">+ Novi Objekat</button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {profiles.map(p => (
            <div key={p.id} onClick={() => onSelectProfile(p.id)} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group">
              <div className="mb-6 flex justify-between items-start">
                <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <span className="bg-green-50 text-green-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">Aktivan</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{p.name}</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{p.location.address || 'Nema adrese'}</p>
            </div>
          ))}
        </div>
        {isCreatingNew && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <form onSubmit={(e) => { e.preventDefault(); onCreateProfile({ name: newProfileName }); setIsCreatingNew(false); }} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
              <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase">Novi Objekat</h3>
              <input required autoFocus type="text" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold mb-6" placeholder="npr. Boutique Caffe" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsCreatingNew(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-widest">Odustani</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Kreiraj</button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  const activePlanName = SUBSCRIPTION_OPTIONS.find(opt => opt.id === profile.subscription?.billingCycle)?.name || 'Standard Plan';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={saveItem} className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-2xl font-black text-gray-900 uppercase">{editingItem.id ? 'Izmeni' : 'Novo'}</h3>
              {editingItem.id && <button type="button" onClick={() => { deleteItem(editingItem.type, editingItem.id!, editingItem.groupId); setEditingItem(null); }} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Obriši</button>}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Naslov</label>
                <input required type="text" value={editingItem.data.name || editingItem.data.title || ''} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.type === 'menuItem' || editingItem.type === 'group' ? 'name' : 'title']: e.target.value}})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold outline-none" />
              </div>
              {editingItem.type !== 'group' && (
                <>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Opis</label>
                    <textarea rows={3} value={editingItem.data.description || ''} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, description: e.target.value}})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-medium text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">{editingItem.type === 'menuItem' ? 'Cena (RSD)' : editingItem.type === 'offers' ? 'Popust' : 'Datum'}</label>
                    <input required type={editingItem.type === 'menuItem' ? 'number' : 'text'} value={editingItem.data.price ?? editingItem.data.discount ?? editingItem.data.date ?? ''} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, [editingItem.type === 'menuItem' ? 'price' : editingItem.type === 'offers' ? 'discount' : 'date']: editingItem.type === 'menuItem' ? Number(e.target.value) : e.target.value}})} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none font-bold outline-none" />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-4 mt-10">
              <button type="button" onClick={() => setEditingItem(null)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Nazad</button>
              <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Sačuvaj</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <button onClick={() => onSelectProfile(null)} className="text-gray-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Svi objekti
        </button>
        <button onClick={() => onViewChange('PROFILE_PREVIEW')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          Pregled
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b bg-gray-50/50 overflow-x-auto no-scrollbar">
          {['info', 'menu', 'offers', 'events', 'gallery', 'billing'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} 
              className={`px-8 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-gray-400 hover:bg-gray-100/50'}`}>
              {tab === 'info' ? 'Profil' : tab === 'menu' ? 'Cenovnik' : tab === 'offers' ? 'Ponude' : tab === 'events' ? 'Događaji' : tab === 'gallery' ? 'Galerija' : 'Pretplata'}
            </button>
          ))}
        </div>

        <div className="p-10">
          {activeTab === 'info' && (
            <div className="space-y-12">
              <section className="space-y-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Osnovno</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Naziv Lokala</label>
                    <input type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} onBlur={() => updateProfileField('name', localName)} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Adresa</label>
                    <input type="text" value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} onBlur={() => updateProfileField('location', {...profile.location, address: localAddress})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold outline-none" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                     <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Opis / Slogan</label>
                     <button onClick={handleGenerateDescription} disabled={isGenerating} className="text-[10px] font-black text-indigo-600 uppercase hover:underline">{isGenerating ? 'AI misli...' : '✨ Generiši AI opis'}</button>
                  </div>
                  <textarea rows={4} value={localDesc} onChange={(e) => setLocalDesc(e.target.value)} onBlur={() => updateProfileField('description', localDesc)} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium outline-none" />
                </div>
              </section>

              <section className="space-y-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Naslovna Slika</h3>
                <div className="flex items-center gap-6">
                  {profile.coverImage && (
                    <div className="w-40 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white flex-shrink-0">
                      <img src={profile.coverImage} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <button onClick={() => fileInputRef.current?.click()} className="bg-gray-100 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Promeni sliku (automatska kompresija)</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Društvene Mreže</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {['instagram', 'facebook', 'tiktok'].map(net => (
                    <div key={net}>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest capitalize">{net}</label>
                      <input type="text" placeholder={`@${net}_username`} value={(profile.socials as any)?.[net] || ''} onChange={(e) => onUpdateProfile({...profile, socials: {...profile.socials, [net]: e.target.value}})} className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold outline-none" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase">Cenovnik</h3>
                <button onClick={() => setEditingItem({ type: 'group', data: { name: '' } })} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase">+ Grupa</button>
              </div>
              <div className="space-y-8">
                {profile.menuGroups.map(group => (
                  <div key={group.id} className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                       <h4 className="text-[10px] font-black text-indigo-600 uppercase">{group.name}</h4>
                       <div className="flex gap-4">
                          <button onClick={() => setEditingItem({ type: 'menuItem', groupId: group.id, data: { name: '', price: 0, description: '' } })} className="text-[9px] font-black text-indigo-400 uppercase">+ Artikal</button>
                          <button onClick={() => setEditingItem({ type: 'group', id: group.id, data: group })} className="text-[9px] font-black text-gray-300 uppercase">Uredi</button>
                       </div>
                    </div>
                    <div className="grid gap-3">
                       {group.items.map(item => (
                         <div key={item.id} onClick={() => setEditingItem({ type: 'menuItem', groupId: group.id, id: item.id, data: item })} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-indigo-50 cursor-pointer">
                           <div>
                             <p className="font-black text-gray-900 text-sm">{item.name}</p>
                             <p className="text-[10px] text-gray-400">{item.description}</p>
                           </div>
                           <span className="font-black text-indigo-600 text-sm">{item.price} RSD</span>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase">Ponude</h3>
                <button onClick={() => setEditingItem({ type: 'offers', data: { title: '', description: '', discount: '' } })} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase">+ Nova Ponuda</button>
              </div>
              <div className="grid gap-6">
                {(profile.offers || []).map(offer => (
                  <div key={offer.id} onClick={() => setEditingItem({ type: 'offers', id: offer.id, data: offer })} className="bg-gray-50 p-6 rounded-[2rem] border border-transparent hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-gray-900">{offer.title}</h4>
                      <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">{offer.discount}</span>
                    </div>
                    <p className="text-xs text-gray-500">{offer.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase">Galerija</h3>
                <div>
                  <button onClick={() => galleryInputRef.current?.click()} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase">+ Slike</button>
                  <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} multiple className="hidden" accept="image/*" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(profile.gallery || []).map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-3xl overflow-hidden shadow-sm">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => deleteGalleryImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl">
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Plan</p>
              <h2 className="text-3xl font-black mb-6">{activePlanName}</h2>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-indigo-200 text-[10px] font-black uppercase mb-1">Naplata</p>
                  <p className="text-xl font-black">{profile.subscription?.nextBillingDate}</p>
                </div>
                <button onClick={() => onViewChange('PRICING')} className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-black text-xs uppercase hover:bg-indigo-50">Promeni</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
