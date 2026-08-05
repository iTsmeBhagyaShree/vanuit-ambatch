import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import { useLanguage } from '../context/LanguageContext';
import { 
  UserPlus, MessageSquare, FileText, CheckCircle2, Briefcase, 
  UserCheck, Calendar, Award, ArrowRight, Check, Clock, Phone, 
  Mail, MapPin, DollarSign, Wrench, ShieldCheck, Download, ChevronRight,
  AlertCircle, X, Sparkles, Send, FileSpreadsheet, CheckSquare, MessageCircle, Paperclip
} from 'lucide-react';

export const WORKFLOW_STEPS = [
  { id: 1, name: 'New Lead', icon: UserPlus, desc: 'Initial inquiry received & lead intake', statusKey: 'new', color: 'blue' },
  { id: 2, name: 'Requirement Discussion', icon: MessageSquare, desc: 'Customer meeting, specs & budget', statusKey: 'inConversation', color: 'amber' },
  { id: 3, name: 'Quote Prepared', icon: FileText, desc: 'Cost estimate & quote generated', statusKey: 'quoteSent', color: 'amber' },
  { id: 4, name: 'Quote Approved', icon: CheckCircle2, desc: 'Client accepted quote & deposit paid', statusKey: 'won', color: 'green' },
  { id: 5, name: 'Project Created', icon: Briefcase, desc: 'Active project setup in system', statusKey: 'active', color: 'indigo' },
  { id: 6, name: 'Partner Assigned', icon: UserCheck, desc: 'Craftsman & supplier assigned', statusKey: 'inProgress', color: 'purple' },
  { id: 7, name: 'Planning & Installation', icon: Calendar, desc: 'Delivery scheduled & build work', statusKey: 'inProgress', color: 'cyan' },
  { id: 8, name: 'Completed', icon: Award, desc: 'Final inspection, invoice paid & closed', statusKey: 'completed', color: 'emerald' }
];

export default function WorkflowTracker({ lead, onClose, onUpdateStatus }) {
  const { t, tStatus, language } = useLanguage();
  const initialStep = lead?.workflowStep || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [autoModalType, setAutoModalType] = useState(null); // 'quote' | 'project' | 'partner' | 'invoice' | null
  const [toastMsg, setToastMsg] = useState('');

  // Update currentStep if selected lead changes & scroll main view to top
  useEffect(() => {
    if (lead?.workflowStep) {
      setCurrentStep(lead.workflowStep);
    }
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, [lead, currentStep]);

  // Prefilled State Inherited from Lead (Zero Dead Data Entry)
  const customerName = lead?.name || 'Jan de Vries';
  const customerEmail = lead?.email || 'jan@devries.nl';
  const customerPhone = lead?.phone || '+31 6 12345678';
  const customerCategory = lead?.category || (lead?.company?.toLowerCase().includes('kliko') ? 'Kliko-ombouw' : lead?.company?.toLowerCase().includes('snijplanken') ? 'Snijplanken' : 'Buitenkeukens');
  
  const translateCategory = (cat) => {
    if (language !== 'EN' || !cat) return cat;
    return cat
      .replace(/Buitenkeukens/gi, 'Outdoor Kitchens')
      .replace(/Buitenkeuken/gi, 'Outdoor Kitchen')
      .replace(/Kliko-ombouw/gi, 'Bin Storage')
      .replace(/Kliko/gi, 'Bin Storage')
      .replace(/Overkappingen/gi, 'Canopies')
      .replace(/Overkapping/gi, 'Canopy')
      .replace(/Snijplanken/gi, 'Cutting Boards');
  };

  const translatedCat = translateCategory(lead?.productType || customerCategory);

  // Section 2.3: Auto-Loaded Message Templates & WhatsApp Photo Attachment
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [attachPhotos, setAttachPhotos] = useState(false);
  const [attachedPhotoName, setAttachedPhotoName] = useState('3d_outdoor_kitchen_render.png');
  const [attachedPhotoUrl, setAttachedPhotoUrl] = useState('/dasbordes images.png');
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedPhotoName(file.name);
      setAttachedPhotoUrl(URL.createObjectURL(file));
      showToast(`Photo "${file.name}" attached for WhatsApp!`);
    }
  };

  const getTemplateText = (tmplId) => {
    let savedTemplates = null;
    try {
      const stored = localStorage.getItem('app_auto_templates_v1');
      if (stored) savedTemplates = JSON.parse(stored);
    } catch(e) {}

    let rawText = (savedTemplates && savedTemplates[tmplId]) 
      ? savedTemplates[tmplId] 
      : (tmplId === 'template1'
        ? `Dear {client_name}, thank you for reaching out to Vanuit Ambacht regarding your {product_category} inquiry. We would love to discuss your requirements in detail. When would it suit you to talk? Kind regards, Tim & Bram - Vanuit Ambacht`
        : tmplId === 'template2'
        ? `Dear {client_name}, we wanted to follow up regarding your {product_category} inquiry. Please let us know if you have any questions or when you would be available for a brief phone call. Kind regards, Tim & Bram - Vanuit Ambacht`
        : `Dear {client_name}, following up regarding your {product_category} project with Vanuit Ambacht. We are happy to help you finalize the specifications whenever you are ready. Best regards, Tim & Bram - Vanuit Ambacht`);

    return rawText
      .replace(/\{client_name\}/g, customerName)
      .replace(/\{product_category\}/g, translatedCat)
      .replace(/\{company_name\}/g, 'Vanuit Ambacht');
  };

  const [customMessageText, setCustomMessageText] = useState(() => getTemplateText('template1'));

  useEffect(() => {
    setCustomMessageText(getTemplateText(selectedTemplate));
  }, [selectedTemplate, lead, language]);
  
  // Interactive Auto-Fill Modal Forms
  const [quoteForm, setQuoteForm] = useState({
    customer: customerName,
    email: customerEmail,
    phone: customerPhone,
    product: customerCategory,
    amount: '12500',
    notes: 'Bespoke teak wood frame with polished concrete countertop (3.5m width)'
  });

  const [projectForm, setProjectForm] = useState({
    projectName: `Luxury ${customerCategory} — ${customerName}`,
    customer: customerName,
    partner: 'Sven Hoek (Hoek Bouw)',
    deadline: '2023-12-12',
  });

  const [partnerForm, setPartnerForm] = useState({
    partnerName: 'Sven Hoek',
    company: 'Hoek Bouw',
    buildPrice: '8500',
    deliveryWeek: 'Week 49 (Dec 2023)'
  });

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: customerName,
    amount: '12500',
  });

  // Dynamic Activity Timeline based on current workflow lifecycle
  const fullTimelineEvents = [
    { id: 1, title: 'Lead Ingestion', desc: `Inquiry received for ${customerCategory}`, time: '10:15 AM (Day 1)', user: 'System' },
    { id: 2, title: 'Assigned to Admin', desc: 'Auto-assigned to Tim & Bram', time: '10:20 AM (Day 1)', user: 'Tim (Admin)' },
    { id: 3, title: 'Requirement Meeting', desc: `Requirements & specs discussed with ${customerName}`, time: '11:45 AM (Day 2)', user: 'Bram (Admin)' },
    { id: 4, title: 'Quote Generated (#Q-4001)', desc: `Formal proposal sent to ${customerEmail}`, time: '02:30 PM (Day 3)', user: 'Tim (Admin)' },
    { id: 5, title: 'Quote Approved & Deposit Paid', desc: `Client accepted proposal & paid 50% deposit (€6,250)`, time: '09:10 AM (Day 4)', user: customerName },
    { id: 6, title: 'Project P-2001 Work Order Created', desc: `Active project setup for ${customerCategory}`, time: '10:00 AM (Day 5)', user: 'Tim (Admin)' },
    { id: 7, title: 'Partner Assigned', desc: 'Assigned to Sven Hoek (Hoek Bouw)', time: '11:00 AM (Day 6)', user: 'Sven Hoek' },
    { id: 8, title: 'Delivery & Site Installation Scheduled', desc: 'Scheduled for Keizersgracht 402, Amsterdam', time: '01:15 PM (Day 7)', user: 'Sven Hoek' },
    { id: 9, title: 'Project Completed & Invoiced', desc: 'Final inspection passed & 100% invoice paid', time: '04:00 PM (Day 8)', user: 'Bram (Admin)' }
  ];

  // Show timeline up to current step
  const visibleTimeline = fullTimelineEvents.slice(0, Math.min(currentStep + 1, fullTimelineEvents.length));

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleNextStep = () => {
    if (currentStep === 2 || currentStep === 3) {
      setAutoModalType('quote');
    } else if (currentStep === 4) {
      setAutoModalType('project');
    } else if (currentStep === 5) {
      setAutoModalType('partner');
    } else if (currentStep === 7 || currentStep === 8) {
      setAutoModalType('invoice');
    } else {
      advanceStep();
    }
  };

  const advanceStep = () => {
    if (currentStep < 8) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (onUpdateStatus) {
        onUpdateStatus(lead?.id, next);
      }
    }
  };

  const handleSaveAutoQuote = (e) => {
    e.preventDefault();
    const newQuote = {
      id: `Q-${Math.floor(4000 + Math.random() * 1000)}`,
      customer: quoteForm.customer,
      project: quoteForm.product,
      amount: `€ ${parseInt(quoteForm.amount).toLocaleString()}`,
      status: 'Accepted',
      date: new Date().toISOString().split('T')[0]
    };

    const savedQuotes = JSON.parse(localStorage.getItem('app_quotes') || '[]');
    localStorage.setItem('app_quotes', JSON.stringify([newQuote, ...savedQuotes]));

    showToast(`Quote ${newQuote.id} created for ${newQuote.customer}!`);
    setAutoModalType(null);
    advanceStep();
  };

  const handleSaveAutoProject = (e) => {
    e.preventDefault();
    const newProject = {
      id: `P-${Math.floor(2000 + Math.random() * 1000)}`,
      name: projectForm.projectName,
      customer: projectForm.customer,
      partner: projectForm.partner,
      progress: 25,
      deadline: projectForm.deadline,
      status: 'In Progress'
    };

    const savedProjects = JSON.parse(localStorage.getItem('app_projects') || '[]');
    localStorage.setItem('app_projects', JSON.stringify([newProject, ...savedProjects]));

    showToast(`Project ${newProject.id} setup for ${newProject.customer}!`);
    setAutoModalType(null);
    advanceStep();
  };

  const handleSaveAutoPartner = (e) => {
    e.preventDefault();
    showToast(`Partner ${partnerForm.partnerName} assigned!`);
    setAutoModalType(null);
    advanceStep();
  };

  const handleSaveAutoInvoice = (e) => {
    e.preventDefault();
    const newInvoice = {
      id: invoiceForm.invoiceNumber,
      customer: invoiceForm.customer,
      amount: `€ ${parseInt(invoiceForm.amount).toLocaleString()}`,
      status: 'Paid',
      date: new Date().toISOString().split('T')[0]
    };

    const savedInvoices = JSON.parse(localStorage.getItem('app_invoices') || '[]');
    localStorage.setItem('app_invoices', JSON.stringify([newInvoice, ...savedInvoices]));

    showToast(`Invoice ${newInvoice.id} generated!`);
    setAutoModalType(null);
    advanceStep();
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  // Status Badge styling helper per step
  const getBadgeVariant = (stepId) => {
    switch (stepId) {
      case 1: return { variant: 'info', label: tStatus('New') };
      case 2: return { variant: 'warning', label: tStatus('In Conversation') };
      case 3: return { variant: 'warning', label: tStatus('Quote Sent') };
      case 4: return { variant: 'success', label: tStatus('Accepted') };
      case 5: return { variant: 'primary', label: tStatus('Active') };
      case 6: return { variant: 'primary', label: tStatus('In Progress') };
      case 7: return { variant: 'warning', label: tStatus('In Progress') };
      case 8: return { variant: 'success', label: tStatus('Completed') };
      default: return { variant: 'default', label: 'Active' };
    }
  };

  const currentBadge = getBadgeVariant(currentStep);

  return (
    <div className="space-y-6 text-[#4A4A43] font-body relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-800 text-cream px-4 py-3 rounded-xl shadow-xl border border-green-700 font-body text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clean Sticky Header with Interactive Stepper Progress Bar */}
      <div className="sticky -top-4 lg:-top-6 z-40 bg-[#EDE8DF] shadow-md -mt-4 lg:-mt-6 pt-4 lg:pt-6 pb-3 border-b border-[#D6CFC2] -mx-4 px-4 sm:-mx-6 sm:px-6">

        {/* Row 1: Name + meta + Close */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {/* Meta badges */}
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-[10px] font-bold text-accent tracking-wider uppercase font-body">Workflow</span>
              <Badge variant="info">{language === 'EN' ? `Step ${currentStep}/8` : `Stap ${currentStep}/8`}</Badge>
              <span className="text-[10px] font-bold text-primary font-body bg-primary/10 px-1.5 py-0.5 rounded-md capitalize">
                {translateCategory(lead?.productType || customerCategory)}
              </span>
            </div>
            {/* Customer name */}
            <h2 className="text-lg font-heading font-bold text-primary leading-tight truncate">
              {customerName}
            </h2>
          </div>
          {/* Close button — always top-right */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 mt-0.5 text-dark/40 hover:text-dark hover:bg-[#D6CFC2]/40 rounded-lg p-1.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 2: 8-Step Stepper — always horizontally scrollable */}
        <div className="overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center min-w-[640px] justify-between relative px-2">
            {/* Connecting Track Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#D6CFC2] z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-primary transition-all duration-500 z-0"
              style={{ width: `${((currentStep - 1) / (WORKFLOW_STEPS.length - 1)) * 96}%` }}
            />

            {WORKFLOW_STEPS.map((step) => {
              const status = getStepStatus(step.id);
              const StepIcon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  title={`${language === 'EN' ? 'Step' : 'Stap'} ${step.id}: ${step.name}`}
                  className="flex flex-col items-center group relative z-10 focus:outline-none cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-green-600 text-white ring-4 ring-green-100 shadow-sm'
                      : status === 'current'
                      ? 'bg-primary text-cream ring-4 ring-primary/20 shadow-md scale-110'
                      : 'bg-[#EDE8DF] text-dark/40 border border-[#D6CFC2] hover:border-primary/50'
                  }`}>
                    {status === 'completed' ? <Check className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-[9px] font-semibold mt-1 max-w-[70px] text-center line-clamp-1 ${
                    status === 'current' ? 'text-primary font-bold' : status === 'completed' ? 'text-green-700' : 'text-dark/40'
                  }`}>
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Dynamic Stage Content Card (2/3) + Real-Time Activity Timeline (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Dynamic Step-Specific Content Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-primary shadow-card">
            
            {/* Stage Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D6CFC2]/60">
              <div>
                <span className="text-[11px] font-bold text-dark/50 uppercase tracking-widest font-body">
                  {language === 'NL' ? 'Huidige Fase Details' : 'Current Stage Details'}
                </span>
                <h3 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
                  <span>Step {currentStep}: {WORKFLOW_STEPS[currentStep - 1].name}</span>
                </h3>
              </div>
              <Badge variant={currentBadge.variant}>
                {currentBadge.label}
              </Badge>
            </div>

            {/* Stage Specific Dynamic Content Controlled by Selected Step */}
            <div className="py-5 space-y-5 text-xs text-dark/80">
              
              {/* STEP 1: NEW LEAD */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#EDE8DF]/50 rounded-xl border border-[#D6CFC2]/60">
                    <div className="flex items-center gap-2.5">
                      <UserPlus className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-dark/50 font-bold uppercase">Customer Name</p>
                        <p className="font-semibold text-dark">{customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-dark/50 font-bold uppercase">Phone Number</p>
                        <p className="font-semibold text-dark">{customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-dark/50 font-bold uppercase">Email Address</p>
                        <p className="font-semibold text-dark">{customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-dark/50 font-bold uppercase">Location & Product</p>
                        <p className="font-semibold text-dark">Amsterdam, NL ({translateCategory(customerCategory)})</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-dark mb-1">Initial Intake Notes</h4>
                    <p className="p-3 bg-white/60 rounded-lg border border-[#D6CFC2]/40 text-dark/70 italic">
                      "Customer requested a quote for a luxury bespoke teak wood outdoor kitchen with concrete countertop (3.5m width)."
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: PRIJSAANVRAAG VERSTUREN */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDE8DF]/50 rounded-xl border border-[#D6CFC2]/60 space-y-4">
                    <h4 className="font-bold text-dark flex items-center gap-2 text-sm">
                      <Send className="w-4 h-4 text-primary" /> Prijsaanvraag Versturen (Send Price Request)
                    </h4>
                    {/* Partner selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Selecteer Partner (Pick Craftsman Partner)</label>
                      <select className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Sven Hoek (Hoek Bouw) — 2 actieve projecten</option>
                        <option>Lars Jansen (Jansen Houtwerk) — 1 actief project</option>
                        <option>Theo Mulder (Mulder Tuinen) — 3 actieve projecten</option>
                      </select>
                    </div>
                    {/* Prefilled specs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Product Type</label>
                        <input readOnly value={lead?.productType || customerCategory} className="w-full px-3 py-2 bg-white/70 border border-[#D6CFC2] rounded-lg text-xs text-dark/70 capitalize" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Gewenste Maat (Size)</label>
                        <input readOnly value={lead?.size || '3x4m'} className="w-full px-3 py-2 bg-white/70 border border-[#D6CFC2] rounded-lg text-xs text-dark/70" />
                      </div>
                    </div>
                    {/* Special requirements */}
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Bijzondere Vereisten (Special Requirements)</label>
                      <textarea
                        className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[70px] resize-none"
                        placeholder="e.g. Teak hout frame, beton aanrechtblad, extra LED verlichting..."
                        defaultValue="Bespoke teak wood frame with polished concrete countertop (3.5m width)."
                      />
                    </div>
                    {/* Response deadline */}
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Reactie Deadline (Response Deadline)</label>
                      <input
                        type="date"
                        defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Vul het formulier in en klik op "Prijsaanvraag Versturen →" om de aanvraag naar de partner te sturen.</span>
                  </div>
                </div>
              )}

              {/* STEP 3: PARTNER OFFERTE ONTVANGEN (Partner Quote Received) */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDE8DF]/60 rounded-xl border border-[#D6CFC2]/60 space-y-4">
                    <h4 className="font-bold text-dark text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary" /> Partner Offerte Ontvangen (Partner Quote Received)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-dark/50 font-bold uppercase block mb-1">Bouwprijs (Build Price)</span>
                        <span className="font-bold text-primary text-base">€ 8,500</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-dark/50 font-bold uppercase block mb-1">Geldig Tot (Valid Until)</span>
                        <span className="font-bold text-dark">15 Nov 2023</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-dark/50 font-bold uppercase block mb-1">Levertijd (Lead Time)</span>
                        <span className="font-bold text-dark">4–5 weken</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-dark/50 font-bold uppercase block mb-1">Partner</span>
                        <span className="font-bold text-dark">Sven Hoek (Hoek Bouw)</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#D6CFC2]/50">
                      <span className="text-[10px] text-dark/50 font-bold uppercase block mb-1">Opmerkingen Partner (Partner Remarks)</span>
                      <p className="text-xs text-dark/70 italic bg-white/60 p-2.5 rounded-lg border border-[#D6CFC2]/40">
                        "Teak hout beschikbaar. Extra levertijd nodig voor beton aanrechtblad (2 extra weken). Prijs exclusief BTW."
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[11px] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Partner offerte ontvangen. Klik op "Offerte Maken →" om de klantofferte te genereren.</span>
                  </div>
                </div>
              )}

              {/* STEP 4: OFFERTE MAKEN (Quote Builder) */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  {/* Partner quote recap */}
                  <div className="p-4 bg-[#EDE8DF]/50 rounded-xl border border-[#D6CFC2]/60 space-y-2">
                    <h4 className="font-bold text-dark text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Klantofferte Samenvatting (Quote Summary)
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-dark/60">Bespoke {lead?.productType || customerCategory} Frame</span><span className="font-semibold">€8,500</span></div>
                      <div className="flex justify-between"><span className="text-dark/60">Afwerking & Materialen</span><span className="font-semibold">€2,800</span></div>
                      <div className="flex justify-between"><span className="text-dark/60">Levering & Montage</span><span className="font-semibold">€1,200</span></div>
                      <div className="flex justify-between font-bold text-primary text-sm pt-2 border-t border-[#D6CFC2]"><span>Totaal (Incl. BTW)</span><span>€12,500</span></div>
                    </div>
                  </div>
                  {/* Offerte maken button — opens Quote Builder modal */}
                  <div className="p-4 bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl text-center space-y-3">
                    <p className="text-xs text-dark/60">Klaar om de officiële klantofferte te maken? Klik hieronder om de offertebouwer te openen met alle gegevens vooringevuld.</p>
                    <Button
                      variant="primary"
                      icon={FileText}
                      onClick={() => setAutoModalType('quote')}
                      className="mx-auto"
                    >
                      Offerte Maken (Create Quote) →
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 5: PROJECT CREATED */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDE8DF]/50 rounded-xl border border-[#D6CFC2]/60 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-dark text-sm">Project #P-2001 Work Order</span>
                      <Badge variant="primary">Active Project</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><span className="text-dark/50 block text-[10px]">Project Name</span><span className="font-semibold">Luxury {customerCategory}</span></div>
                      <div><span className="text-dark/50 block text-[10px]">Target Delivery Date</span><span className="font-semibold text-primary">12 Dec 2023</span></div>
                      <div><span className="text-dark/50 block text-[10px]">Assigned Team</span><span className="font-semibold">Tim & Bram (Admins)</span></div>
                      <div><span className="text-dark/50 block text-[10px]">Build Progress</span><span className="font-semibold text-green-700">25%</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: PARTNER ASSIGNED */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDE8DF]/60 rounded-xl border border-[#D6CFC2]/60 space-y-2">
                    <h4 className="font-bold text-dark flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary" /> Assigned Partner & Craftsman
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div><span className="text-dark/50 block text-[10px]">Craftsman Partner</span><span className="font-semibold">Sven Hoek (Hoek Bouw)</span></div>
                      <div><span className="text-dark/50 block text-[10px]">Workload Status</span><span className="font-semibold text-green-700">Available (2 Projects)</span></div>
                      <div><span className="text-dark/50 block text-[10px]">Agreed Build Price</span><span className="font-semibold text-primary">€8,500</span></div>
                      <div><span className="text-dark/50 block text-[10px]">Delivery Week</span><span className="font-semibold">Week 49 (Dec 2023)</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: PLANNING & INSTALLATION */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDE8DF]/60 rounded-xl border border-[#D6CFC2]/60 space-y-3">
                    <h4 className="font-bold text-dark flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Installation & Calendar Schedule
                    </h4>
                    <div className="p-3 bg-white/80 rounded-lg border border-[#D6CFC2]/40 text-xs space-y-2">
                      <div className="flex justify-between font-semibold"><span>Site Assembly & Delivery</span><span>12 Dec 2023 @ 09:00</span></div>
                      <div className="text-dark/60 text-[11px]">Address: Keizersgracht 402, Amsterdam</div>
                      <div className="flex items-center gap-2 pt-2 border-t border-[#D6CFC2]/40 text-[11px] text-green-800">
                        <CheckSquare className="w-3.5 h-3.5 text-green-600" />
                        <span>Pre-assembly quality check passed in workshop by Sven Hoek.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: COMPLETED */}
              {currentStep === 8 && (
                <div className="space-y-4">
                  <div className="p-5 bg-green-900 text-cream rounded-xl space-y-3 shadow-card">
                    <div className="flex items-center gap-2 font-bold text-base">
                      <Award className="w-6 h-6 text-amber-400" />
                      <span>Project Completed & Archived</span>
                    </div>
                    <p className="text-xs text-cream/80">
                      Final inspection passed, 100% invoice paid (€12,500), customer signature received for {customerName}.
                    </p>
                  </div>
                </div>
              )}

              {/* Repositioned Auto-Message Templates & Contact Actions (Section 2.3) */}
              <div className="pt-4 mt-6 border-t border-[#D6CFC2]/70 space-y-3 bg-[#EDE8DF]/40 p-4 rounded-xl border border-[#D6CFC2]/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary font-heading uppercase tracking-wider">
                      Auto-Message Templates & Contact Actions
                    </span>
                  </div>
                  {/* Template Selector Dropdown */}
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="px-2.5 py-1 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  >
                    <option value="template1">Template 1: Initial Inquiry Response</option>
                    <option value="template2">Template 2: 1st Follow-up Message</option>
                    <option value="template3">Template 3: 2nd Follow-up Message</option>
                  </select>
                </div>

                {/* Editable Message Textarea */}
                <div>
                  <textarea
                    value={customMessageText}
                    onChange={(e) => setCustomMessageText(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[64px] resize-none"
                    placeholder="Message content..."
                  />
                </div>

                {/* Bottom Row: Attach photos toggle & Action Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-1.5 text-[11px] text-dark/70 cursor-pointer select-none font-bold">
                      <input
                        type="checkbox"
                        checked={attachPhotos}
                        onChange={(e) => setAttachPhotos(e.target.checked)}
                        className="rounded border-[#D6CFC2] text-primary focus:ring-primary/20"
                      />
                      <Paperclip className="w-3.5 h-3.5 text-primary" />
                      <span>{language === 'EN' ? 'Attach project photo / 3D render (WhatsApp)' : 'Projectfoto / 3D-render bijvoegen (WhatsApp)'}</span>
                    </label>

                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMessageText + (attachPhotos ? `\n\n[Attached Photo: ${attachedPhotoName}]` : ''))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <a
                        href={`tel:${customerPhone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(customerEmail)}&su=${encodeURIComponent(`Vanuit Ambacht — ${translatedCat} for ${customerName}`)}&body=${encodeURIComponent(customMessageText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3E4E36] hover:bg-[#2e3a28] text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-xs"
                      >
                        <Mail className="w-3.5 h-3.5" /> E-mail
                      </a>
                    </div>
                  </div>

                  {/* Option 1: Expanded Photo Upload & Thumbnail Preview */}
                  {attachPhotos && (
                    <div className="p-3 bg-white rounded-xl border border-[#D6CFC2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={attachedPhotoUrl} 
                          alt="Attachment Preview" 
                          className="w-11 h-11 object-cover rounded-lg border border-[#D6CFC2] flex-shrink-0 shadow-xs" 
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-emerald-800 truncate">
                            ✓ {attachedPhotoName}
                          </p>
                          <p className="text-[10px] text-dark/50 font-mono">
                            {language === 'EN' ? 'Ready to send via WhatsApp' : 'Klaar om te verzenden via WhatsApp'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => fileInputRef.current?.click()} 
                          className="text-[11px] py-1 px-2.5 bg-[#EDE8DF] border-[#C4BEB3] text-primary hover:bg-[#D6CFC2]"
                        >
                          📷 {language === 'EN' ? 'Choose Image' : 'Kies Afbeelding'}
                        </Button>
                        <button 
                          type="button" 
                          onClick={() => setAttachPhotos(false)} 
                          className="text-xs text-red-600 font-bold hover:underline px-1"
                        >
                          {language === 'EN' ? 'Remove' : 'Verwijderen'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Prominent Primary Action Button (What should I do next?) */}
            <div className="pt-4 border-t border-[#D6CFC2] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EDE8DF]/30 -mx-5 -mb-5 p-5 rounded-b-2xl">
              <div>
                <span className="text-[10px] text-dark/50 uppercase font-bold tracking-wider block">
                  {language === 'NL' ? 'Aanbevolen Volgende Actie' : 'Recommended Next Action'}
                </span>
                <span className="text-xs font-bold text-dark">
                  {currentStep === 1 && (language === 'EN' ? 'Contact customer to discuss requirements' : 'Neem contact op om de vereisten te bespreken')}
                  {currentStep === 2 && (language === 'EN' ? 'Send price request to selected partner' : 'Stuur de prijsaanvraag naar de geselecteerde partner')}
                  {currentStep === 3 && (language === 'EN' ? 'Partner quote received — create customer quote now' : 'Partner offerte ontvangen — maak nu de klantofferte')}
                  {currentStep === 4 && (language === 'EN' ? 'Quote approved — create active project' : 'Offerte goedgekeurd — maak actief project aan')}
                  {currentStep === 5 && (language === 'EN' ? 'Assign a craftsman partner to the project' : 'Wijs een ambachtsman partner toe aan het project')}
                  {currentStep === 6 && (language === 'EN' ? 'Schedule site installation date' : 'Plan de installatiedatum op locatie')}
                  {currentStep === 7 && (language === 'EN' ? 'Complete installation & generate final invoice' : 'Installatie voltooien & eindfactuur genereren')}
                  {currentStep === 8 && (language === 'EN' ? 'Archive project & save documents' : 'Project archiveren & documenten opslaan')}
                </span>
              </div>

              {currentStep < 8 && (
                <Button variant="primary" icon={ArrowRight} onClick={handleNextStep} className="w-full sm:w-auto shadow-md">
                  {currentStep === 1 && (language === 'EN' ? 'Contact Customer →' : 'Contact Opnemen →')}
                  {currentStep === 2 && (language === 'EN' ? 'Send Price Request →' : 'Prijsaanvraag Versturen →')}
                  {currentStep === 3 && (language === 'EN' ? 'Quote Received — Proceed →' : 'Offerte Ontvangen — Ga verder →')}
                  {currentStep === 4 && (language === 'EN' ? 'Create Project →' : 'Project Aanmaken →')}
                  {currentStep === 5 && (language === 'EN' ? 'Assign Partner →' : 'Partner Toewijzen →')}
                  {currentStep === 6 && (language === 'EN' ? 'Schedule Planning →' : 'Planning Inplannen →')}
                  {currentStep === 7 && (language === 'EN' ? 'Mark as Completed →' : 'Markeer als Afgerond →')}
                </Button>
              )}

              {currentStep === 8 && (
                <Button variant="outline" icon={Award} onClick={onClose} className="w-full sm:w-auto">
                  {language === 'NL' ? 'Project Archiveren' : 'Archive Project'}
                </Button>
              )}
            </div>

          </Card>
        </div>

        {/* Right Column: Real-Time Activity Lifecycle History Timeline (1 Col) */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-heading font-bold text-base text-primary mb-4 flex items-center justify-between">
              <span>{language === 'NL' ? 'Activiteitenhistorie' : 'Activity Lifecycle History'}</span>
              <Clock className="w-4 h-4 text-dark/40" />
            </h3>

            <div className="relative pl-6 space-y-4 text-xs before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D6CFC2]">
              {visibleTimeline.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-[#EDE8DF]" />
                  <div className="font-semibold text-dark">{item.title}</div>
                  <div className="text-dark/60 text-[11px] mt-0.5">{item.desc}</div>
                  <div className="flex justify-between items-center text-[10px] text-dark/40 mt-1 font-mono">
                    <span>{item.time}</span>
                    <span>{item.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* AUTO-PREFILLED MODALS */}
      <AnimatePresence>
        {autoModalType === 'quote' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-card p-6 w-full max-w-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary mt-1">Auto-Prefilled Quote Builder</h3>
                </div>
                <button onClick={() => setAutoModalType(null)} className="text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveAutoQuote} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/70 mb-1">Customer Name</label>
                  <input type="text" readOnly value={quoteForm.customer} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg font-semibold text-dark" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Email</label>
                    <input type="text" readOnly value={quoteForm.email} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg text-dark/70" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Phone</label>
                    <input type="text" readOnly value={quoteForm.phone} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg text-dark/70" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Product Category</label>
                    <input type="text" readOnly value={quoteForm.product} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg text-dark/70" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Quote Total (€)</label>
                    <input type="number" value={quoteForm.amount} onChange={e => setQuoteForm(prev => ({ ...prev, amount: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" onClick={() => setAutoModalType(null)}>Cancel</Button>
                  <Button type="submit" icon={Send}>Save & Send Quote →</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {autoModalType === 'project' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-card p-6 w-full max-w-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary mt-1">Auto-Create Active Project</h3>
                </div>
                <button onClick={() => setAutoModalType(null)} className="text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveAutoProject} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/70 mb-1">Project Name</label>
                  <input type="text" readOnly value={projectForm.projectName} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg font-semibold text-dark" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Customer</label>
                    <input type="text" readOnly value={projectForm.customer} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg text-dark/70" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Target Delivery Date</label>
                    <input type="date" value={projectForm.deadline} onChange={e => setProjectForm(prev => ({ ...prev, deadline: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-semibold text-dark" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" onClick={() => setAutoModalType(null)}>Cancel</Button>
                  <Button type="submit" icon={Briefcase}>Save & Create Active Project →</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {autoModalType === 'partner' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-card p-6 w-full max-w-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary mt-1">Assign Craftsman Partner</h3>
                </div>
                <button onClick={() => setAutoModalType(null)} className="text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveAutoPartner} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/70 mb-1">Select Craftsman Partner</label>
                  <select value={partnerForm.partnerName} onChange={e => setPartnerForm(prev => ({ ...prev, partnerName: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-semibold text-dark">
                    <option value="Sven Hoek">Sven Hoek (Hoek Bouw) — 2 Active Projects</option>
                    <option value="Lars Jansen">Lars Jansen (Jansen Houtwerk) — 1 Active Project</option>
                    <option value="Theo Mulder">Theo Mulder (Mulder Tuinen) — 3 Active Projects</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Agreed Build Price (€)</label>
                    <input type="number" value={partnerForm.buildPrice} onChange={e => setPartnerForm(prev => ({ ...prev, buildPrice: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-bold text-primary" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Target Delivery Week</label>
                    <input type="text" value={partnerForm.deliveryWeek} onChange={e => setPartnerForm(prev => ({ ...prev, deliveryWeek: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-dark" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" onClick={() => setAutoModalType(null)}>Cancel</Button>
                  <Button type="submit" icon={UserCheck}>Confirm Partner Work Order →</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {autoModalType === 'invoice' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-card p-6 w-full max-w-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary mt-1">Auto-Generate Final Invoice</h3>
                </div>
                <button onClick={() => setAutoModalType(null)} className="text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSaveAutoInvoice} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Invoice #</label>
                    <input type="text" readOnly value={invoiceForm.invoiceNumber} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg font-mono font-bold text-dark" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/70 mb-1">Customer</label>
                    <input type="text" readOnly value={invoiceForm.customer} className="w-full px-3 py-2 bg-white/80 border border-[#D6CFC2] rounded-lg font-semibold text-dark" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-dark/70 mb-1">Total Paid Amount (€)</label>
                  <input type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-bold text-green-700 text-sm" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" onClick={() => setAutoModalType(null)}>Cancel</Button>
                  <Button type="submit" icon={FileSpreadsheet}>Generate & Store Invoice →</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
