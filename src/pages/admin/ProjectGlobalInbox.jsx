import React, { useState } from 'react';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MessageSquare, Search, Filter, Send, ExternalLink, 
  CheckCheck, User, UserCheck, ShieldAlert, Sparkles, 
  Check, Paperclip, ArrowLeft, Clock, MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    projectId: '2026-014',
    customerName: 'Sander de Vries',
    city: 'Oisterwijk',
    projectTitle: 'Thermo Fraké Buitenkeuken 240 cm',
    channel: 'customer',
    partnerName: 'Hoek Bouw',
    unreadCount: 2,
    waitingForReply: true,
    lastMsg: 'Eindcontrole door Tim & Bram (rond 10 september). Daarna bellen we je voor een tijdvak.',
    lastTime: '10:05',
    messages: [
      { id: 'm1', sender: 'customer', senderName: 'Sander de Vries', text: 'Hoi Tim, is de uitsparing voor de Big Green Egg al ingezaagd?', time: '09:30', channel: 'customer' },
      { id: 'm2', sender: 'admin', senderName: 'Tim (Admin)', text: 'Ja zeker Sander! Het werkblad is gisteren strak uitgesneden en gepolijst.', time: '09:45', channel: 'customer' },
      { id: 'm3', sender: 'customer', senderName: 'Sander de Vries', text: 'Super dankjewel! Wanneer verwachten jullie de levering precies?', time: '10:05', channel: 'customer' }
    ]
  },
  {
    id: 'conv-2',
    projectId: '2026-014-p',
    customerName: 'Sander de Vries',
    city: 'Oisterwijk',
    projectTitle: 'Thermo Fraké Buitenkeuken 240 cm',
    channel: 'partner',
    partnerName: 'Sven Hoek (Hoek Bouw)',
    unreadCount: 1,
    waitingForReply: false,
    lastMsg: 'Werkbon v3 ontvangen. We starten maandag met het zagen van de eiken staanders.',
    lastTime: 'Gisteren',
    messages: [
      { id: 'm4', sender: 'admin', senderName: 'Bram (Admin)', text: 'Hoi Sven, werkbon v3 staat klaar in het portaal. Let op de kraan-uitsparing.', time: '14:20', channel: 'partner' },
      { id: 'm5', sender: 'partner', senderName: 'Sven (Hoek Bouw)', text: 'Werkbon v3 ontvangen. We starten maandag met het zagen van de eiken staanders.', time: '16:05', channel: 'partner' }
    ]
  },
  {
    id: 'conv-3',
    projectId: '2026-021',
    customerName: 'Sander de Vries',
    city: 'Oisterwijk',
    projectTitle: 'Luxe Eiken Buitenverblijf 600x400 cm',
    channel: 'customer',
    partnerName: 'Timmerwerken Zuid',
    unreadCount: 0,
    waitingForReply: false,
    lastMsg: 'Schouw afspraak is bevestigd voor donderdag 27 augustus.',
    lastTime: '18 Aug',
    messages: [
      { id: 'm6', sender: 'admin', senderName: 'Tim (Admin)', text: 'Hoi Sander, schouwvoorstel staat in je portaal.', time: '11:00', channel: 'customer' },
      { id: 'm7', sender: 'customer', senderName: 'Sander de Vries', text: 'Schouw afspraak is bevestigd voor donderdag 27 augustus.', time: '11:15', channel: 'customer' }
    ]
  },
  {
    id: 'conv-4',
    projectId: '2026-019',
    customerName: 'John Miller',
    city: 'Vught',
    projectTitle: 'Black Teak Buitenkeuken 300 cm',
    channel: 'customer',
    partnerName: 'Hoek Bouw',
    unreadCount: 1,
    waitingForReply: true,
    lastMsg: 'Kunnen we de koelkast optie alsnog toevoegen aan de offerte?',
    lastTime: '17 Aug',
    messages: [
      { id: 'm8', sender: 'customer', senderName: 'John Miller', text: 'Kunnen we de koelkast optie alsnog toevoegen aan de offerte?', time: '17 Aug', channel: 'customer' }
    ]
  }
];

export default function ProjectGlobalInbox() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterType === 'customer') return conv.channel === 'customer';
    if (filterType === 'partner') return conv.channel === 'partner';
    if (filterType === 'waiting') return conv.waitingForReply;
    return true;
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      senderName: 'Admin (You)',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeConv.channel
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          lastMsg: newMsg.text,
          lastTime: newMsg.time,
          waitingForReply: false,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
  };

  return (
    <div className="space-y-4 font-body text-[#4A4A43]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-[#D6CFC2] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#33422C]" />
              {language === 'EN' ? 'Global Project Inbox' : 'Inbox Berichten'}
            </h2>
            <span className="bg-[#33422C] text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              4 Active Threads
            </span>
          </div>
          <p className="text-xs text-dark/60 mt-0.5">
            {language === 'EN' 
              ? 'One unified inbox for all customer & partner communications across all active projects.' 
              : 'Alle klant- en partnergesprekken over alle projecten heen in één overzicht.'}
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/projects')} 
          className="text-xs"
        >
          ← {language === 'EN' ? 'Back to Projects' : 'Terug naar Projecten'}
        </Button>
      </div>

      {/* Main Inbox Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[620px]">
        {/* Left Column: Conversation List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D6CFC2] shadow-xs p-3 space-y-3">
          {/* Search & Filter Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-dark/40" />
              <input
                type="text"
                placeholder={language === 'EN' ? 'Search project, customer or partner...' : 'Zoek project, klant of partner...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-medium font-mono">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === 'all' 
                    ? 'bg-[#33422C] text-white shadow-xs' 
                    : 'bg-[#F8F7F4] text-dark/70 hover:bg-[#EDE8DF]'
                }`}
              >
                {language === 'EN' ? 'All (4)' : 'Alles (4)'}
              </button>
              <button
                onClick={() => setFilterType('customer')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === 'customer' 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-[#F8F7F4] text-dark/70 hover:bg-[#EDE8DF]'
                }`}
              >
                👤 {language === 'EN' ? 'Customers' : 'Klanten'}
              </button>
              <button
                onClick={() => setFilterType('partner')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === 'partner' 
                    ? 'bg-amber-800 text-white shadow-xs' 
                    : 'bg-[#F8F7F4] text-dark/70 hover:bg-[#EDE8DF]'
                }`}
              >
                🤝 {language === 'EN' ? 'Partners' : 'Partners'}
              </button>
              <button
                onClick={() => setFilterType('waiting')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === 'waiting' 
                    ? 'bg-red-700 text-white shadow-xs' 
                    : 'bg-[#F8F7F4] text-dark/70 hover:bg-[#EDE8DF]'
                }`}
              >
                ⏳ {language === 'EN' ? 'Needs Reply' : 'Wacht op antwoord'}
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[500px] pr-1">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConv.id;
              const isPartner = conv.channel === 'partner';

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-[#F4F1EA] border-[#33422C] shadow-xs' 
                      : 'bg-white border-[#D6CFC2]/60 hover:bg-[#F8F7F4]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-[11px] font-bold text-primary bg-[#EDE8DF] px-1.5 py-0.5 rounded-md">
                        {conv.projectId}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isPartner 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {isPartner ? '🤝 PARTNER' : '👤 KLANT'}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-dark/50 flex-shrink-0">
                      {conv.lastTime}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xs text-primary truncate">
                    {conv.customerName} · <span className="font-normal text-dark/60">{conv.city}</span>
                  </h4>
                  <p className="text-[11px] text-dark/70 truncate mt-0.5 font-body">
                    {conv.lastMsg}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#D6CFC2]/40 text-[10px]">
                    <span className="text-dark/50 truncate max-w-[200px]">
                      {isPartner ? `Partner: ${conv.partnerName}` : conv.projectTitle}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread & Composer (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D6CFC2] shadow-xs flex flex-col min-h-[580px]">
          {/* Thread Header */}
          <div className="p-3.5 border-b border-[#D6CFC2] flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] rounded-t-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  {activeConv.projectId}
                </span>
                <h3 className="font-serif font-bold text-base text-primary">
                  {activeConv.customerName} ({activeConv.city})
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  activeConv.channel === 'partner' 
                    ? 'bg-amber-800 text-white' 
                    : 'bg-[#33422C] text-white'
                }`}>
                  {activeConv.channel === 'partner' ? '🤝 PARTNER CHANNEL' : '👤 CUSTOMER CHANNEL'}
                </span>
              </div>
              <p className="text-xs text-dark/60 mt-0.5">
                {activeConv.projectTitle} · {activeConv.partnerName}
              </p>
            </div>

            <button
              onClick={() => navigate('/admin/projects')}
              className="px-3 py-1.5 bg-[#EDE8DF] hover:bg-[#E2DDD3] text-primary text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{language === 'EN' ? 'Open Project Detail' : 'Project Bekijken'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Channel Warning Bar */}
          <div className={`px-3.5 py-1.5 text-xs font-mono font-bold flex items-center justify-between border-b ${
            activeConv.channel === 'partner'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}>
            <span>
              {activeConv.channel === 'partner' 
                ? '⚠️ Kanaal: partner — nooit zichtbaar voor de klant' 
                : '🟢 Kanaal: klant — direct zichtbaar in klantportaal'}
            </span>
            <span className="text-[10px] opacity-70">
              {activeConv.channel === 'partner' ? 'WhatsApp Mirror Active' : 'Portal Sync Active'}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[380px] bg-[#FDFBF7]">
            {activeConv.messages.map((msg) => {
              const isAdmin = msg.sender === 'admin';
              const isPartner = msg.channel === 'partner';

              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-dark/50">
                    <span className="font-bold">{msg.senderName}</span>
                    <span>·</span>
                    <span>{msg.time}</span>
                  </div>

                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-body shadow-xs ${
                    isAdmin
                      ? 'bg-[#33422C] text-white rounded-tr-xs'
                      : isPartner
                        ? 'bg-amber-100 text-amber-950 border border-amber-300/60 rounded-tl-xs'
                        : 'bg-white text-[#4A4A43] border border-[#D6CFC2] rounded-tl-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#D6CFC2] bg-white rounded-b-2xl space-y-2">
            {/* Quick Replies Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono text-dark/70">
              <span className="font-bold uppercase text-dark/40 flex-shrink-0">Quick reply:</span>
              <button 
                type="button" 
                onClick={() => setInputText('Hoi! We hebben de werkbon en planning zojuist bijgewerkt.')}
                className="px-2 py-0.5 bg-[#F8F7F4] hover:bg-[#EDE8DF] border border-[#D6CFC2] rounded-md whitespace-nowrap cursor-pointer"
              >
                ⚡ Werkbon update
              </button>
              <button 
                type="button" 
                onClick={() => setInputText('De verwachte levering staat gepland op schema.')}
                className="px-2 py-0.5 bg-[#F8F7F4] hover:bg-[#EDE8DF] border border-[#D6CFC2] rounded-md whitespace-nowrap cursor-pointer"
              >
                ⚡ Levering op schema
              </button>
              <button 
                type="button" 
                onClick={() => setInputText('Dankjewel voor de bevestiging! We nemen vandaag nog contact op.')}
                className="px-2 py-0.5 bg-[#F8F7F4] hover:bg-[#EDE8DF] border border-[#D6CFC2] rounded-md whitespace-nowrap cursor-pointer"
              >
                ⚡ Bevestiging dank
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  activeConv.channel === 'partner' 
                    ? 'Bericht aan de partner (Sven Hoek)...' 
                    : 'Bericht aan de klant (Sander de Vries)...'
                }
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
              />

              <button
                type="submit"
                className={`px-4 py-2 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeConv.channel === 'partner'
                    ? 'bg-amber-800 hover:bg-amber-900'
                    : 'bg-[#33422C] hover:bg-[#283523]'
                }`}
              >
                <span>{language === 'EN' ? 'Send' : 'Versturen'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
