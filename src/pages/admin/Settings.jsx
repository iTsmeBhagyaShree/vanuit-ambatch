import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { Building2, Upload, Palette, Bell, Save, CheckCircle, Users, Plus, Trash2, Edit2, Shield, Sliders, Hash, Percent, X, UserPlus, ToggleLeft, ToggleRight, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Settings() {
  const { t, language } = useLanguage();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Company'); // 'Company' | 'Users' | 'FieldSet'
  const [toastMsg, setToastMsg] = useState('');

  // -------------------------------------------------------------
  // 1. COMPANY DETAILS & NUMBERING STATE
  // -------------------------------------------------------------
  const [logo, setLogo] = useState(() => localStorage.getItem('brand_logo') || null);

  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem('company_info');
    return saved ? JSON.parse(saved) : {
      name: 'Vanuit Ambacht',
      website: 'www.vanuitambacht.nl',
      email: 'info@vanuitambacht.nl',
      phone: '+31 6 12345678',
      address: 'Herengracht 1, Amsterdam',
      country: 'Netherlands',
      kvk: 'KVK-88741029',
      vatNumber: 'NL88741029B01',
      standardVatRate: '21',
      lowVatRate: '9',
      quotePrefix: '#Q-2004',
      invoicePrefix: '#INV-902'
    };
  });

  const [colors, setColors] = useState({
    primary: '#3E4E36',
    accent: '#70624F',
    background: '#D6CFC2',
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notification_settings');
    return saved ? JSON.parse(saved) : [
      { id: 'lead', label: 'Nieuwe lead ontvangen', desc: 'Ontvang een melding bij een nieuwe binnengekomen aanvraag', enabled: true },
      { id: 'quote', label: 'Offerte geaccepteerd', desc: 'Ontvang een melding wanneer een klant de offerte accepteert', enabled: true },
      { id: 'project', label: 'Project status gewijzigd', desc: 'Melding bij voortgangs-updates van projecten', enabled: true },
      { id: 'payment', label: 'Betaling ontvangen', desc: 'Melding wanneer een factuur als betaald wordt gemarkeerd', enabled: true },
    ];
  });

  // -------------------------------------------------------------
  // 2. USER MANAGEMENT STATE (PRD 4.12)
  // -------------------------------------------------------------
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('app_system_users');
    return saved ? JSON.parse(saved) : [
      { id: 'USR-001', name: 'Admin User', email: 'admin@vanuitambacht.nl', role: 'admin', status: 'Actief', joinedDate: '2025-01-10' },
      { id: 'USR-002', name: 'Sven Hoek', email: 'sven@hoekbouw.nl', role: 'partner', status: 'Actief', joinedDate: '2025-03-15' },
      { id: 'USR-003', name: 'Lars Jansen', email: 'lars@jansen.nl', role: 'partner', status: 'Actief', joinedDate: '2025-04-20' },
      { id: 'USR-004', name: 'Jan de Vries', email: 'jan@devries.nl', role: 'customer', status: 'Actief', joinedDate: '2026-02-12' },
      { id: 'USR-005', name: 'Sanne Visser', email: 'sanne@visser.nl', role: 'customer', status: 'Inactief', joinedDate: '2026-05-01' },
    ];
  });

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'partner'
  });

  // -------------------------------------------------------------
  // 3. FIELD-SET CONFIGURATION STATE (PRD 4.12)
  // -------------------------------------------------------------
  const [selectedProductType, setSelectedProductType] = useState('buitenverblijf'); // 'buitenverblijf' | 'overkapping' | 'poolhouse'
  
  const [fieldSets, setFieldSets] = useState(() => {
    const saved = localStorage.getItem('app_fieldset_config');
    return saved ? JSON.parse(saved) : {
      buitenverblijf: [
        { id: 'f-101', label: 'Isolatie Type (Dak & Wand)', type: 'select', options: ['PIR 80mm', 'Steenwol 100mm', 'Geen isolatie'], required: true },
        { id: 'f-102', label: 'Glaswand Optie', type: 'select', options: ['Glazen schuifwanden (5-rail)', 'Vaste glazen wanden', 'Geen glas'], required: true },
        { id: 'f-103', label: 'Houtsoort Frame', type: 'select', options: ['Massief Teakhout', 'Douglas Hout', 'Eikenhout'], required: true },
        { id: 'f-104', label: 'Elektra & Verlichting Pakket', type: 'select', options: ['Inbouw LED spots + 4 stopcontacten', 'Standaard elektra', 'Geen'], required: false }
      ],
      overkapping: [
        { id: 'f-201', label: 'Lamellendak Besturing', type: 'select', options: ['Elektrisch Somfy motor', 'Handmatig zwengel', 'Vast dak'], required: true },
        { id: 'f-202', label: 'Sneeuwbelasting Klasse', type: 'select', options: ['Klasse A (High 120kg/m²)', 'Klasse B (Standard)'], required: true },
        { id: 'f-203', label: 'Geïntegreerde Regenafvoer', type: 'select', options: ['Verborgen in staander', 'Zichtbare zinken pijp'], required: true }
      ],
      poolhouse: [
        { id: 'f-301', label: 'Techniekruimte Zwembad', type: 'select', options: ['Geïsoleerd pomphuis vak', 'Geen techniekruimte'], required: true },
        { id: 'f-302', label: 'Sauna Module Integratie', type: 'select', options: ['Infrarood cabine', 'Traditionele Fins sauna', 'Geen sauna'], required: false },
        { id: 'f-303', label: 'Buitendouche Aansluiting', type: 'select', options: ['Warm & Koud water', 'Alleen koud water', 'Geen'], required: false }
      ]
    };
  });

  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const [newFieldForm, setNewFieldForm] = useState({
    label: '',
    type: 'select',
    optionsStr: '',
    required: true
  });

  // Sync colors to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--accent-color', colors.accent);
    document.documentElement.style.setProperty('--background-color', colors.background);
  }, [colors]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Save Handlers
  const saveCompanyInfo = () => {
    localStorage.setItem('company_info', JSON.stringify(companyInfo));
    showToast('Bedrijfsgegevens & Nummering formats opgeslagen! (#Q-2004 / #INV-902)');
  };

  const saveBrandSettings = () => {
    localStorage.setItem('notification_settings', JSON.stringify(notifications));
    if (logo) localStorage.setItem('brand_logo', logo);
    else localStorage.removeItem('brand_logo');
    showToast('Merkinstellingen opgeslagen!');
  };

  const handleCompanyChange = (key, value) => {
    setCompanyInfo(prev => ({ ...prev, [key]: value }));
  };

  // User Management Handlers
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      showToast('Vul een geldige naam en e-mailadres in.');
      return;
    }
    const newUser = {
      id: `USR-${usersList.length + 101}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'Actief',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newUser, ...usersList];
    setUsersList(updated);
    localStorage.setItem('app_system_users', JSON.stringify(updated));
    showToast(`Uitnodiging verzonden naar ${inviteForm.email} (Rol: ${inviteForm.role})!`);
    setInviteModalOpen(false);
  };

  const handleToggleUserStatus = (userId) => {
    const updated = usersList.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Actief' ? 'Inactief' : 'Actief';
        showToast(`Gebruiker ${u.name} status gewijzigd naar ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem('app_system_users', JSON.stringify(updated));
  };

  const handleRoleChange = (userId, newRole) => {
    const updated = usersList.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsersList(updated);
    localStorage.setItem('app_system_users', JSON.stringify(updated));
    showToast(`Rol gewijzigd naar ${newRole.toUpperCase()}`);
  };

  // Field-Set Configurator Handlers
  const handleAddFieldSubmit = (e) => {
    e.preventDefault();
    if (!newFieldForm.label.trim()) {
      showToast('Vul een veldnaam in.');
      return;
    }
    const optsArr = newFieldForm.optionsStr.split(',').map(s => s.trim()).filter(Boolean);
    const newField = {
      id: `f-${Date.now()}`,
      label: newFieldForm.label,
      type: newFieldForm.type,
      options: optsArr.length > 0 ? optsArr : ['Optie 1', 'Optie 2'],
      required: newFieldForm.required
    };

    const updatedSets = {
      ...fieldSets,
      [selectedProductType]: [...(fieldSets[selectedProductType] || []), newField]
    };

    setFieldSets(updatedSets);
    localStorage.setItem('app_fieldset_config', JSON.stringify(updatedSets));
    showToast(`Nieuw veld "${newFieldForm.label}" toegevoegd aan ${selectedProductType.toUpperCase()}!`);
    setAddFieldModalOpen(false);
  };

  const handleDeleteField = (fieldId) => {
    const updatedSets = {
      ...fieldSets,
      [selectedProductType]: fieldSets[selectedProductType].filter(f => f.id !== fieldId)
    };
    setFieldSets(updatedSets);
    localStorage.setItem('app_fieldset_config', JSON.stringify(updatedSets));
    showToast(`Formulierveld verwijderd.`);
  };

  return (
    <div className="space-y-6 relative font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg border border-[#D6CFC2]/20 text-xs">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">
          {language === 'EN' ? 'Settings (Admin Settings)' : 'Instellingen (Admin Settings)'}
        </h2>
        <p className="text-dark/60 text-sm">
          {language === 'EN' 
            ? 'Manage company details, VAT rates, numbering formats, user permissions, and dynamic product fields.' 
            : 'Beheer bedrijfsgegevens, btw-tarieven, nummeringsindelingen, gebruikersrechten en dynamische productvelden.'}
        </p>
      </div>

      {/* TOP TABS SWITCHER BAR (PRD 4.12) */}
      <div className="flex gap-2 border-b border-[#D6CFC2] pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('Company')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'Company' ? 'bg-primary text-cream shadow-sm' : 'bg-white/80 text-dark/70 hover:bg-[#EDE8DF]'
          }`}
        >
          <Building2 className="w-4 h-4 flex-shrink-0 text-primary" />
          <span>{language === 'EN' ? 'Company Details' : 'Bedrijfsgegevens & Nummering'}</span>
        </button>
        <button
          onClick={() => setActiveTab('Users')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'Users' ? 'bg-primary text-cream shadow-sm' : 'bg-white/80 text-dark/70 hover:bg-[#EDE8DF]'
          }`}
        >
          <Users className="w-4 h-4 flex-shrink-0 text-primary" />
          <span>{language === 'EN' ? 'User Management' : 'Gebruikersbeheer'}</span>
        </button>
        <button
          onClick={() => setActiveTab('FieldSet')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
            activeTab === 'FieldSet' ? 'bg-primary text-cream shadow-sm' : 'bg-white/80 text-dark/70 hover:bg-[#EDE8DF]'
          }`}
        >
          <Sliders className="w-4 h-4 flex-shrink-0 text-primary" />
          <span>{language === 'EN' ? 'Field-Set Configurator' : 'Field-Set Configurator'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: BEDRIJFSGEGEVENS, BTW & NUMMERING FORMATS (PRD 4.12) */}
      {/* ========================================================= */}
      {activeTab === 'Company' && (
        <div className="space-y-6">
          {/* Company Details & VAT Rates */}
          <Card title={language === 'EN' ? 'Company Details & VAT Rates' : 'Bedrijfsgegevens & BTW Tarieven'} icon={Building2}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Company Name' : 'Bedrijfsnaam'}</label>
                  <input type="text" value={companyInfo.name} onChange={e => handleCompanyChange('name', e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-bold text-dark" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Website URL' : 'Website URL'}</label>
                  <input type="text" value={companyInfo.website} onChange={e => handleCompanyChange('website', e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Email Address' : 'E-mailadres'}</label>
                  <input type="email" value={companyInfo.email} onChange={e => handleCompanyChange('email', e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Phone Number' : 'Telefoonnummer'}</label>
                  <input type="text" value={companyInfo.phone} onChange={e => handleCompanyChange('phone', e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Address & City' : 'Adres & Woonplaats'}</label>
                  <input type="text" value={companyInfo.address} onChange={e => handleCompanyChange('address', e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'CoC & VAT Number' : 'KVK & BTW Nummer'}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input type="text" value={companyInfo.kvk} onChange={e => handleCompanyChange('kvk', e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-mono text-xs" placeholder="KVK-88741029" />
                    <input type="text" value={companyInfo.vatNumber} onChange={e => handleCompanyChange('vatNumber', e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-mono text-xs" placeholder="NL88741029B01" />
                  </div>
                </div>
              </div>

              {/* VAT Rates Configuration */}
              <div className="pt-4 border-t border-[#D6CFC2] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/60">
                  <label className="block font-bold text-primary mb-1 uppercase text-[10px] flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> {language === 'EN' ? 'Standard VAT Rate (%)' : 'Standaard BTW Tarief (%)'}
                  </label>
                  <input type="number" value={companyInfo.standardVatRate} onChange={e => handleCompanyChange('standardVatRate', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-bold text-primary" />
                  <span className="text-[10px] text-dark/50 mt-1 block">
                    {language === 'EN' ? 'Standard 21% VAT rate for deliveries and assembly.' : 'Standaard 21% btw tarief voor leveringen en montage.'}
                  </span>
                </div>
                <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/60">
                  <label className="block font-bold text-primary mb-1 uppercase text-[10px] flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> {language === 'EN' ? 'Reduced VAT Rate (%)' : 'Verlaagd BTW Tarief (%)'}
                  </label>
                  <input type="number" value={companyInfo.lowVatRate} onChange={e => handleCompanyChange('lowVatRate', e.target.value)} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-bold text-primary" />
                  <span className="text-[10px] text-dark/50 mt-1 block">
                    {language === 'EN' ? 'Reduced 9% VAT rate for specific services.' : 'Laag 9% btw tarief voor specifieke diensten.'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quote & Invoice Numbering Format Customizer (PRD 4.12) */}
          <Card title={language === 'EN' ? 'Quote & Invoice Numbering Formats (#Q-2004, #INV-902)' : 'Offerte & Factuur Nummering Formats (#Q-2004, #INV-902)'} icon={Hash}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-xl border border-[#D6CFC2] space-y-2">
                <label className="block font-bold text-primary uppercase text-[10px] flex items-center gap-1">
                  <Hash className="w-4 h-4 text-accent" /> {language === 'EN' ? 'Quote Number Format (Quote Prefix)' : 'Offerte Nummer Formaat (Quote Prefix)'}
                </label>
                <input
                  type="text"
                  value={companyInfo.quotePrefix}
                  onChange={e => handleCompanyChange('quotePrefix', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-mono font-bold text-primary text-sm"
                  placeholder="#Q-2004"
                />
                <p className="text-[10px] text-dark/60">{language === 'EN' ? 'Example on quote PDFs:' : 'Voorbeeld op offerte PDFs:'} <strong className="font-mono text-primary">{companyInfo.quotePrefix}-801</strong></p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#D6CFC2] space-y-2">
                <label className="block font-bold text-primary uppercase text-[10px] flex items-center gap-1">
                  <Hash className="w-4 h-4 text-accent" /> {language === 'EN' ? 'Invoice Number Format (Invoice Prefix)' : 'Factuur Nummer Formaat (Invoice Prefix)'}
                </label>
                <input
                  type="text"
                  value={companyInfo.invoicePrefix}
                  onChange={e => handleCompanyChange('invoicePrefix', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-mono font-bold text-primary text-sm"
                  placeholder="#INV-902"
                />
                <p className="text-[10px] text-dark/60">{language === 'EN' ? 'Example on invoice PDFs:' : 'Voorbeeld op factuur PDFs:'} <strong className="font-mono text-primary">{companyInfo.invoicePrefix}-902</strong></p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#D6CFC2]/60 mt-4">
              <Button icon={Save} onClick={saveCompanyInfo}>
                {language === 'EN' ? 'Save Company Info & Formats' : 'Bedrijfsgegevens & Formats Opslaan'}
              </Button>
            </div>
          </Card>

          {/* Brand Logo & Colors */}
          <Card title={language === 'EN' ? 'Brand Identity & Style' : 'Merkidentiteit & Huisstijl'} icon={Palette}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-semibold text-dark/60 mb-2 uppercase">{language === 'EN' ? 'Company Logo' : 'Bedrijfslogo'}</label>
                <div className="p-4 bg-[#F8F7F4] border-2 border-dashed border-[#D6CFC2] rounded-xl text-center cursor-pointer hover:bg-[#EDE8DF]/40 transition-colors" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-bold text-dark">{language === 'EN' ? 'Click to upload logo' : 'Klik om logo te uploaden'}</p>
                  <p className="text-[10px] text-dark/50 mt-1">{language === 'EN' ? 'PNG, SVG or JPG (max 2MB)' : 'PNG, SVG of JPG (max 2MB)'}</p>
                  <input type="file" ref={fileInputRef} onChange={e => { if(e.target.files[0]) { setLogo(URL.createObjectURL(e.target.files[0])); showToast('Logo geladen!'); } }} className="hidden" accept="image/*" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block font-semibold text-dark/60 uppercase">{language === 'EN' ? 'Theme Colors' : 'Thema Kleuren'}</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-[#F8F7F4] rounded-lg border text-center">
                    <span className="text-[10px] font-bold block mb-1">Primary</span>
                    <div className="w-full h-8 rounded bg-primary border"></div>
                  </div>
                  <div className="p-2 bg-[#F8F7F4] rounded-lg border text-center">
                    <span className="text-[10px] font-bold block mb-1">Accent</span>
                    <div className="w-full h-8 rounded bg-accent border"></div>
                  </div>
                  <div className="p-2 bg-[#F8F7F4] rounded-lg border text-center">
                    <span className="text-[10px] font-bold block mb-1">Warm Cream</span>
                    <div className="w-full h-8 rounded bg-[#EDE8DF] border"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: GEBRUIKERSBEHEER & ROLES MANAGEMENT (PRD 4.12) */}
      {/* ========================================================= */}
      {activeTab === 'Users' && (
        <div className="space-y-6 font-body">
          <div className="flex justify-between items-center bg-[#EDE8DF]/60 p-4 rounded-xl border border-[#D6CFC2]">
            <div>
              <h3 className="font-heading font-bold text-primary text-base">
                {language === 'EN' ? 'User Management & Role Assignment' : 'Gebruikersbeheer & Rol Toewijzing'}
              </h3>
              <p className="text-dark/60 text-xs">
                {language === 'EN' 
                  ? 'Invite new users, assign roles (Admin / Partner / Customer), and manage access.' 
                  : 'Nieuwe gebruikers uitnodigen, rollen toewijzen (Admin / Partner / Customer) en toegang beheren.'}
              </p>
            </div>
            <Button icon={UserPlus} onClick={() => setInviteModalOpen(true)}>
              {language === 'EN' ? '+ Invite User' : '+ Gebruiker Uitnodigen'}
            </Button>
          </div>

          <Card p="p-4">
            <div className="space-y-3">
              {usersList.map((usr) => (
                <div key={usr.id} className="p-3.5 bg-white border border-[#D6CFC2] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {usr.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-dark text-sm">{usr.name}</h4>
                        <span className="text-[10px] font-mono text-dark/40">({usr.id})</span>
                      </div>
                      <p className="text-dark/60 text-xs">{usr.email}</p>
                      <p className="text-[10px] text-dark/40 mt-0.5">
                        {language === 'EN' ? 'Joined:' : 'Lid sinds:'} {usr.joinedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Role Assignment Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-accent" />
                      <select
                        value={usr.role}
                        onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                        className="px-2.5 py-1 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-bold text-primary focus:outline-none cursor-pointer"
                      >
                        <option value="admin">👑 Admin</option>
                        <option value="partner">🤝 Partner</option>
                        <option value="customer">👤 Customer</option>
                      </select>
                    </div>

                    {/* Status Badge & Toggle Button */}
                    <button
                      onClick={() => handleToggleUserStatus(usr.id)}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] border transition-all flex items-center gap-1 ${
                        usr.status === 'Actief'
                          ? 'bg-green-100 text-green-800 border-green-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                          : 'bg-red-100 text-red-800 border-red-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                      }`}
                    >
                      {usr.status === 'Actief' 
                        ? (language === 'EN' ? '🟢 Active (Deactivate)' : '🟢 Actief (Deactiveren)') 
                        : (language === 'EN' ? '🔴 Inactive (Activate)' : '🔴 Inactief (Activeren)')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FIELD-SET CONFIGURATOR PER PRODUCT TYPE (PRD 4.12) */}
      {/* ========================================================= */}
      {activeTab === 'FieldSet' && (
        <div className="space-y-6 font-body">
          <div className="bg-[#EDE8DF]/60 p-4 rounded-xl border border-[#D6CFC2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-heading font-bold text-primary text-base">
                {language === 'EN' ? 'Dynamic Field-Set Configurator' : 'Dynamic Field-Set Configurator'}
              </h3>
              <p className="text-dark/60 text-xs">
                {language === 'EN' 
                  ? 'Manage dynamic form fields per product type (outdoor living, canopy, poolhouse).' 
                  : 'Beheer dynamische formuliervelden per product type (buitenverblijf, overkapping, poolhouse).'}
              </p>
            </div>
            <Button icon={Plus} onClick={() => setAddFieldModalOpen(true)}>
              {language === 'EN' ? '+ Add New Field' : '+ Nieuw Veld Toevoegen'}
            </Button>
          </div>

          {/* Product Type Sub-Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'buitenverblijf', label: language === 'EN' ? '🏡 Outdoor Living' : '🏡 Buitenverblijf' },
              { id: 'overkapping', label: language === 'EN' ? '☂️ Canopy' : '☂️ Overkapping' },
              { id: 'poolhouse', label: language === 'EN' ? '🏊 Poolhouse' : '🏊 Poolhouse' }
            ].map((pt) => (
              <button
                key={pt.id}
                onClick={() => setSelectedProductType(pt.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedProductType === pt.id
                    ? 'bg-primary text-cream border-primary shadow-xs'
                    : 'bg-white text-dark/70 border-[#D6CFC2] hover:bg-[#EDE8DF]'
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>

          {/* Configured Fields Table */}
          <Card title={language === 'EN' ? `Configured Fields for "${selectedProductType.toUpperCase()}"` : `Geconfigureerde Velden voor "${selectedProductType.toUpperCase()}"`} icon={Sliders} p="p-4">
            <div className="space-y-2.5">
              {(fieldSets[selectedProductType] || []).map((field) => (
                <div key={field.id} className="p-3.5 bg-white border border-[#D6CFC2] rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-dark">{field.label}</h4>
                      {field.required && <Badge variant="danger" className="text-[8px]">{language === 'EN' ? 'Required' : 'Verplicht'}</Badge>}
                    </div>
                    <p className="text-[10px] text-dark/50 mt-0.5">Type: <span className="font-mono font-bold text-primary">{field.type}</span></p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {field.options && field.options.map((opt, i) => (
                        <span key={i} className="text-[9px] font-bold bg-[#EDE8DF] text-primary px-2 py-0.5 rounded">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                    title={language === 'EN' ? 'Delete field' : 'Verwijder veld'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {(!fieldSets[selectedProductType] || fieldSets[selectedProductType].length === 0) && (
                <div className="text-center py-8 text-xs text-dark/40 italic">
                  {language === 'EN' ? 'No custom fields configured for this product type.' : 'Geen aangepaste velden geconfigureerd voor dit product type.'}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* INVITE USER MODAL */}
      <AnimatePresence>
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setInviteModalOpen(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">{language === 'EN' ? 'Invite New User' : 'Nieuwe Gebruiker Uitnodigen'}</h3>
                <button onClick={() => setInviteModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-3 font-body">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Name' : 'Naam'}</label>
                  <input type="text" required value={inviteForm.name} onChange={e => setInviteForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="e.g. Bram van den Berg" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Email Address' : 'E-mailadres'}</label>
                  <input type="email" required value={inviteForm.email} onChange={e => setInviteForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="e.g. bram@vanuitambacht.nl" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'System Role' : 'Systeem Rol'}</label>
                  <select value={inviteForm.role} onChange={e => setInviteForm(prev => ({ ...prev, role: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-bold">
                    <option value="admin">👑 Admin Portal</option>
                    <option value="partner">🤝 Partner Portal</option>
                    <option value="customer">👤 Customer Portal</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setInviteModalOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">{language === 'EN' ? 'Send Invitation' : 'Verstuur Uitnodiging'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CUSTOM FIELD MODAL */}
      <AnimatePresence>
        {addFieldModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setAddFieldModalOpen(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">{language === 'EN' ? `Add Custom Field (${selectedProductType.toUpperCase()})` : `Aangepast Veld Toevoegen (${selectedProductType.toUpperCase()})`}</h3>
                <button onClick={() => setAddFieldModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddFieldSubmit} className="space-y-3 font-body">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Field Name / Label' : 'Veld Naam / Label'}</label>
                  <input type="text" required value={newFieldForm.label} onChange={e => setNewFieldForm(prev => ({ ...prev, label: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="e.g. Sauna Module Integratie" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Options (comma separated)' : 'Opties (komma gescheiden)'}</label>
                  <input type="text" value={newFieldForm.optionsStr} onChange={e => setNewFieldForm(prev => ({ ...prev, optionsStr: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="Infrarood, Fins sauna, Geen" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setAddFieldModalOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">{language === 'EN' ? 'Save Field' : 'Veld Opslaan'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
