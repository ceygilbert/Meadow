
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  X, 
  ShoppingBag, 
  Headset, 
  ArrowRight 
} from 'lucide-react';

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
      desc: 'Hardware Inquiries',
      number: '60123456789',
      icon: <ShoppingBag size={18} />,
      color: 'bg-blue-600'
    },
    {
      id: 'support',
      label: 'Support Team',
      desc: 'Technical Assistance',
      number: '60987654321',
      icon: <Headset size={18} />,
      color: 'bg-slate-900'
    }
  ];

  const handleWhatsApp = (number: string) => {
    window.open(`https://wa.me/${number}`, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end gap-4">
      {/* Sub-buttons Container */}
      <div className={`flex flex-col gap-3 transition-all duration-500 origin-bottom ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-10 pointer-events-none'}`}>
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => handleWhatsApp(contact.number)}
            className="group flex items-center gap-4 bg-white/80 backdrop-blur-2xl border border-white p-2 pr-6 rounded-2xl shadow-2xl hover:scale-105 hover:bg-white transition-all"
          >
            <div className={`w-12 h-12 ${contact.color} text-white rounded-xl flex items-center justify-center shadow-lg`}>
              {contact.icon}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{contact.label}</p>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                Chat Now <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-95 ${
          isOpen ? 'bg-slate-900 text-white rotate-180' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        
        {/* Unread Badge Animation */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
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
