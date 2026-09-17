
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  X, 
  Headset, 
  ArrowRight 
} from 'lucide-react';

// Official WhatsApp icon SVG
const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Only show on public routes
  const isPublic = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/customer');
  if (!isPublic) return null;

  const contacts = [
    {
      id: 'sales',
      label: 'Sales Team',
      desc: '+6017-7847754',
      number: '+6017-7847754',
      icon: <WhatsAppIcon size={22} />,
      color: 'bg-[#25D366]'
    },
    {
      id: 'support',
      label: 'Support Team',
      desc: 'Technical Assistance',
      number: '60987654321',
      icon: <Headset size={20} />,
      color: 'bg-slate-900'
    }
  ];

  const handleWhatsApp = (number: string) => {
    // Strip non-digits to ensure clean wa.me phone link (e.g. 60177847754)
    const cleanNumber = number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <div className={`fixed ${location.pathname === '/buildpc' ? 'bottom-32' : 'bottom-8'} right-8 z-[1000] flex flex-col items-end gap-4`}>
      {/* Sub-buttons Container */}
      <div className={`flex flex-col gap-3 transition-all duration-500 origin-bottom ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-10 pointer-events-none'}`}>
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => handleWhatsApp(contact.number)}
            className="group flex items-center gap-4 bg-white/95 backdrop-blur-2xl border border-slate-100 p-2.5 pr-6 rounded-2xl shadow-2xl hover:scale-105 hover:bg-white transition-all cursor-pointer"
          >
            <div className={`w-12 h-12 ${contact.color} text-white rounded-xl flex items-center justify-center shadow-md shrink-0`}>
              {contact.icon}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{contact.label}</p>
                {contact.desc && contact.id === 'sales' && (
                  <span className="text-[10px] font-bold text-emerald-600 font-mono tracking-tight">{contact.desc}</span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                Chat on WhatsApp <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp Contact Options"
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-95 cursor-pointer ${
          isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-[#25D366] text-white hover:bg-[#20ba5a] shadow-[#25D366]/30 hover:scale-105'
        }`}
      >
        {isOpen ? <X size={28} /> : <WhatsAppIcon size={30} />}
        
        {/* Unread Badge Animation */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Tooltip Label (Desktop only) */}
      {!isOpen && (
        <div className="absolute right-20 top-1/2 -translate-y-1/2 px-4 py-2 bg-white rounded-xl shadow-xl border border-slate-100 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Connect with us</span>
        </div>
      )}
    </div>
  );
};

export default FloatingWhatsApp;
