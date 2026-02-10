
import React, { useState } from 'react';
import { BusinessProfile } from '../types';

interface PublicProfileProps {
  profile: BusinessProfile;
  onBack?: () => void;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ profile, onBack }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'menu' | 'gallery'>('all');

  const hasSocials = profile.socials && (profile.socials.instagram || profile.socials.facebook || profile.socials.tiktok);

  const handleShare = async (title: string, text: string, url?: string) => {
    const shareData = {
      title: title,
      text: text,
      url: url || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${text} ${shareData.url}`);
        alert('Link je kopiran u clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl pb-10 overflow-x-hidden relative">
      <div className="relative h-72 bg-indigo-900 overflow-hidden">
        <img 
          src={profile.coverImage || profile.logo || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'} 
          alt={profile.name} 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/10 to-transparent"></div>
        {onBack && (
           <button 
           onClick={onBack}
           className="absolute top-4 left-4 bg-black/20 backdrop-blur-xl text-white p-3 rounded-2xl border border-white/10 hover:bg-black/40 transition-all z-10"
         >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
           </svg>
         </button>
        )}
        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{profile.name}</h1>
            <button 
              onClick={() => handleShare(profile.name, `Pogledaj digitalni profil za ${profile.name}`)}
              className="p-2 bg-white/80 backdrop-blur-md rounded-xl shadow-sm text-indigo-600 hover:scale-110 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm font-medium leading-tight italic mt-3">{profile.description}</p>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl mb-12 border border-gray-200/30">
          {[
            { id: 'all', label: 'Pregled' },
            { id: 'menu', label: 'Cenovnik' },
            { id: 'gallery', label: 'Slike' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {activeTab === 'all' && (
            <>
              {profile.offers && profile.offers.length > 0 && (
                <section className="animate-in slide-in-from-bottom duration-500">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Aktivne Ponude</h2>
                  <div className="space-y-4">
                    {profile.offers.map(offer => (
                      <div key={offer.id} className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] text-white shadow-xl relative group">
                        <button 
                          onClick={() => handleShare(offer.title, `${offer.title} - ${offer.discount} popusta u ${profile.name}`)}
                          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        <div className="flex justify-between items-start mb-2 pr-8">
                          <h3 className="font-black text-lg">{offer.title}</h3>
                          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">{offer.discount}</span>
                        </div>
                        <p className="text-white/80 text-xs">{offer.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {profile.events && profile.events.length > 0 && (
                <section className="animate-in slide-in-from-bottom duration-500">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Događaji</h2>
                  <div className="space-y-4">
                    {profile.events.map(event => (
                      <div key={event.id} className="p-4 bg-white rounded-3xl border border-gray-100 flex gap-4 items-center relative group shadow-sm">
                        <div className="bg-indigo-50 text-indigo-600 w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-2xl font-black text-center border border-indigo-100/50 p-2 overflow-hidden">
                          <span className="text-[9px] uppercase leading-tight break-words">{event.date}</span>
                        </div>
                        <div className="flex-grow pr-10">
                          <h4 className="font-black text-gray-900 text-sm leading-tight mb-1">{event.title}</h4>
                          <p className="text-[10px] text-gray-400 font-medium leading-normal">{event.description}</p>
                        </div>
                        <button 
                          onClick={() => handleShare(event.title, `Događaj: ${event.title} (${event.date}) u ${profile.name}`)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {(activeTab === 'all' || activeTab === 'menu') && (
            <section className="animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Cenovnik</h2>
                <div className="h-px bg-gray-100 flex-grow"></div>
              </div>
              <div className="space-y-10">
                {(profile.menuGroups || []).map(group => (
                  <div key={group.id} className="space-y-6">
                    <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">{group.name}</h3>
                    <div className="space-y-6">
                      {group.items.map(item => (
                        <div key={item.id} className="group">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase text-[13px]">{item.name}</h4>
                            <div className="flex-1 mx-3 border-b border-gray-100"></div>
                            <span className="font-black text-indigo-600 text-sm">{item.price} RSD</span>
                          </div>
                          <p className="text-[10px] font-medium text-gray-400 leading-relaxed pr-8">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'gallery') && profile.gallery && profile.gallery.length > 0 && (
            <section className="animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Galerija</h2>
                <div className="h-px bg-gray-100 flex-grow"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {profile.gallery.map((img, idx) => (
                  <div key={idx} className={`rounded-[2rem] overflow-hidden shadow-sm aspect-square ${idx === 0 ? 'col-span-2 aspect-[16/9]' : ''}`}>
                    <img src={img} alt="Galerija" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="pt-20 border-t border-gray-100 text-center pb-8">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] mb-8">{hasSocials ? 'Pratite nas' : 'Kontakt'}</p>
            <div className="flex flex-col gap-8 items-center justify-center">
               <div className="flex gap-4 justify-center">
                  {profile.socials?.instagram && (
                    <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-2xl text-pink-600 shadow-sm border border-gray-100 hover:scale-110 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2C22,19.4 19.4,22 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8C2,4.6 4.6,2 7.8,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M18,5.75A1.25,1.25 0 1,0 19.25,7A1.25,1.25 0 0,0 18,5.75Z"/></svg>
                    </a>
                  )}
                  {profile.socials?.facebook && (
                    <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-2xl text-blue-600 shadow-sm border border-gray-100 hover:scale-110 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
                    </a>
                  )}
                  {profile.socials?.tiktok && (
                    <a href={profile.socials.tiktok} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-2xl text-black shadow-sm border border-gray-100 hover:scale-110 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.59-1 .01 4.03.01 8.05.01 12.08 0 .4-.06.81-.19 1.21-.61 2.22-2.48 3.99-4.76 4.47-1.15.26-2.36.19-3.48-.19-2.31-.74-4.14-2.8-4.52-5.19-.18-.94-.12-1.92.17-2.84.6-1.89 2.22-3.49 4.14-3.95 1.14-.28 2.35-.19 3.44.22v4.18c-1.12-.34-2.39-.18-3.37.52-.94.66-1.44 1.83-1.28 2.96.15 1.14.98 2.11 2.06 2.51.84.32 1.78.3 2.61-.05 1.05-.44 1.79-1.52 1.83-2.65V0h-.44z"/></svg>
                    </a>
                  )}
               </div>

               <div className="flex justify-center gap-4">
                  <a href={`tel:${profile.contact}`} className="bg-white p-5 rounded-[2rem] text-indigo-600 shadow-sm border border-gray-100 hover:scale-110 active:scale-95 transition-all">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg>
                  </a>
                  <a 
                    href={`https://www.google.com/maps?q=${encodeURIComponent(profile.location.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-indigo-600 p-5 rounded-[2rem] text-white shadow-xl shadow-indigo-100 hover:scale-110 active:scale-95 transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.994 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </a>
               </div>
            </div>
            
            <div className="mt-16 opacity-20">
              <span className="text-[9px] font-black tracking-[0.5em] uppercase">Powered by Tappo</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
