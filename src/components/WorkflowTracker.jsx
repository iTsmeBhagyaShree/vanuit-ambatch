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
  AlertCircle, X, Sparkles, Send, FileSpreadsheet, CheckSquare, MessageCircle, Paperclip,
  Mic, Play, Pause, FileAudio, Volume2
} from 'lucide-react';

export const WORKFLOW_STEPS = [
  { id: 1, name: 'New Lead', icon: UserPlus, desc: 'Initial inquiry received & lead intake', statusKey: 'new', color: 'blue' },
  { id: 2, name: 'Partner Price Request', icon: MessageSquare, desc: 'Send price request to partner & confirm specs', statusKey: 'inConversation', color: 'amber' },
  { id: 3, name: 'Partner Quote', icon: FileText, desc: 'Cost estimate & quote received from partner', statusKey: 'quoteSent', color: 'amber' },
  { id: 4, name: 'Create Quote for Lead/Customer', icon: CheckCircle2, desc: 'Generate & send quote to lead/customer', statusKey: 'won', color: 'green' },
  { id: 5, name: 'Project Created', icon: Briefcase, desc: 'Active project setup in system', statusKey: 'active', color: 'indigo' },
  { id: 6, name: 'Partner Assigned', icon: UserCheck, desc: 'Craftsman & supplier assigned', statusKey: 'inProgress', color: 'purple' },
  { id: 7, name: 'Planning & Installation', icon: Calendar, desc: 'Delivery scheduled & build work', statusKey: 'inProgress', color: 'cyan' },
  { id: 8, name: 'Completed', icon: Award, desc: 'Final inspection, invoice paid & closed', statusKey: 'completed', color: 'emerald' }
];

export default function WorkflowTracker({ lead, onClose, onUpdateStatus, onOpenPartnerWizard }) {
  const { t, tStatus, language } = useLanguage();
  const initialStep = lead?.workflowStep || 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [autoModalType, setAutoModalType] = useState(null); // 'quote' | 'project' | 'partner' | 'invoice' | null
  const [toastMsg, setToastMsg] = useState('');

  // Commercial Actions State
  const [commercialActions, setCommercialActions] = useState(() => {
    try {
      const saved = localStorage.getItem(`app_commercial_actions_${lead?.id || 'default'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 1,
        date: '2026-08-05 14:30',
        user: 'Tim (Admin)',
        note: 'Initial phone consultation completed. Client confirmed interest in luxury teak wood finish and 3.5m length.'
      }
    ];
  });
  const [commercialModalOpen, setCommercialModalOpen] = useState(false);
  const [newCommercialNote, setNewCommercialNote] = useState('');

  const handleSaveCommercialAction = (e) => {
    e.preventDefault();
    if (!newCommercialNote.trim()) return;
    const newAction = {
      id: Date.now(),
      date: new Date().toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' }),
      user: 'Tim (Admin)',
      note: newCommercialNote.trim()
    };
    const updated = [newAction, ...commercialActions];
    setCommercialActions(updated);
    localStorage.setItem(`app_commercial_actions_${lead?.id || 'default'}`, JSON.stringify(updated));
    setNewCommercialNote('');
    setCommercialModalOpen(false);
    showToast(language === 'EN' ? 'Commercial action recorded successfully!' : 'Commerciële actie succesvol opgeslagen!');
  };

  // Plaud AI Audio Recordings State
  const [plaudRecordings, setPlaudRecordings] = useState(() => {
    try {
      const saved = localStorage.getItem(`app_plaud_audio_${lead?.id || 'default'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 1,
        title: 'Call Recording — Teak Wood & Concrete Countertop Discussion',
        duration: '03:42 min',
        date: '2026-08-05 15:10',
        user: 'Plaud AI Note',
        summary: 'Plaud AI Summary: Client confirmed 3.5m length for teak wood kitchen with dark polished concrete cire countertop. Requested site visit next week.',
        fileName: 'plaud_rec_mark_davis_05082026.mp3'
      }
    ];
  });
  const [plaudModalOpen, setPlaudModalOpen] = useState(false);
  const [plaudAudioForm, setPlaudAudioForm] = useState({
    title: '',
    duration: '03:15 min',
    summary: '',
    fileName: 'plaud_voice_recording.mp3'
  });
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioFileInputRef = useRef(null);

  const handleAudioFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlaudAudioForm(prev => ({
        ...prev,
        title: prev.title || `Voice Note: ${file.name.replace(/\.[^/.]+$/, "")}`,
        fileName: file.name
      }));
      showToast(`Plaud AI audio file "${file.name}" loaded!`);
    }
  };

  const handleSavePlaudAudio = (e) => {
    e.preventDefault();
    const newRecording = {
      id: Date.now(),
      title: plaudAudioForm.title || 'Plaud AI Call Note',
      duration: plaudAudioForm.duration || '02:45 min',
      date: new Date().toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' }),
      user: 'Plaud AI Import',
      summary: plaudAudioForm.summary || 'Recorded phone call auto-imported via Plaud AI. Conversation summary and key specs logged.',
      fileName: plaudAudioForm.fileName
    };
    const updated = [newRecording, ...plaudRecordings];
    setPlaudRecordings(updated);
    localStorage.setItem(`app_plaud_audio_${lead?.id || 'default'}`, JSON.stringify(updated));
    setPlaudModalOpen(false);
    setPlaudAudioForm({ title: '', duration: '03:15 min', summary: '', fileName: 'plaud_voice_recording.mp3' });
    showToast(language === 'EN' ? 'Plaud AI Audio Note imported & saved!' : 'Plaud AI Spraakopname geïmporteerd!');
  };

  // Claude AI Draft Proposal Engine State
  const [claudeProposalModalOpen, setClaudeProposalModalOpen] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState(null);
  const [quoteViewModalOpen, setQuoteViewModalOpen] = useState(false);

  // Step 2 Editable Free-Text Fields & Smart Green Logic State
  const [step2ProductType, setStep2ProductType] = useState(lead?.productType || customerCategory || 'Buitenkeuken');
  const [step2Size, setStep2Size] = useState(lead?.size || '350 x 80 x 95 cm');
  const [isPriceRequestSent, setIsPriceRequestSent] = useState(false);

  // Step 4 Direct Multi-Item Quotation Generator State
  const PRESET_PRODUCTS = [
    { desc: 'Thermo Fraké Buitenkeuken Cabinet (Maatwerk)', unitPrice: 8500 },
    { desc: 'Massief Teak Hout Buitenkeuken Frame', unitPrice: 9200 },
    { desc: 'Gepolijst Beton Cire Aanrechtblad (Zwart)', unitPrice: 2800 },
    { desc: 'Big Green Egg Large Inbouw Uitsparing Kit', unitPrice: 1200 },
    { desc: 'RVS Buitenkoelkast Dubbeldeurs', unitPrice: 1450 },
    { desc: 'RVS Spoelbak & Zwarte Mengkraan Set', unitPrice: 650 },
    { desc: 'Transport, Plaatsing & Locatie Montage', unitPrice: 850 }
  ];

  const [quoteLineItems, setQuoteLineItems] = useState([
    { id: 1, desc: 'Maatwerk Thermo Fraké Hout Frame (3.5m)', qty: 1, unitPrice: 8500 },
    { id: 2, desc: 'Gepolijst Beton Cire Aanrechtblad (8cm Zwart)', qty: 1, unitPrice: 2800 },
    { id: 3, desc: 'Inbouw Kamado Big Green Egg Cutout & RVS Kraan', qty: 1, unitPrice: 1200 }
  ]);

  const handleGenerateClaudeProposal = (recording) => {
    setIsGeneratingProposal(true);
    setClaudeProposalModalOpen(true);
    
    // Simulate Claude AI generating draft proposal in Vanuit Ambacht brand tone
    setTimeout(() => {
      setGeneratedProposal({
        quoteId: `Q-${Math.floor(4000 + Math.random() * 900)}`,
        customerName: customerName,
        productCategory: lead?.productType || customerCategory,
        date: new Date().toISOString().split('T')[0],
        introText: `Beste ${customerName},\n\nHartelijk dank voor het prettige telefoongesprek via Vanuit Ambacht. Op basis van onze bespreking in de audio-opname hebben wij met genoegen deze maatofferte voor uw ${translateCategory(customerCategory)} opgesteld. Wij garanderen ambachtelijke topkwaliteit en een duurzame afwerking met oog voor elk detail.`,
        items: [
          { desc: `Maatwerk ${translateCategory(customerCategory)} (3.5m Teak Hout Frame)`, price: '€ 8.500' },
          { desc: 'Gepolijst Beton Cire Aanrechtblad (Zwart Polijst 8cm)', price: '€ 2.800' },
          { desc: 'Inbouw Kamado Big Green Egg Large + RVS Kraan & Spoelbak', price: '€ 1.450' },
          { desc: 'Transport, Plaatsing & Locatie Montage op Locatie (Amsterdam)', price: '€ 850' }
        ],
        totalAmount: '€ 13.600',
        brandNote: 'Vanuit Ambacht — Ambachtelijk Meesterschap & Duurzaam Buitenleven'
      });
      setIsGeneratingProposal(false);
      showToast(language === 'EN' ? 'Claude AI Draft Proposal generated successfully!' : 'Claude AI Concept Offerte succesvol gegenereerd!');
    }, 1100);
  };

  const handleExportProposalToQuote = () => {
    if (!generatedProposal) return;
    const newQuote = {
      id: generatedProposal.quoteId,
      customer: generatedProposal.customerName,
      project: generatedProposal.productCategory,
      amount: generatedProposal.totalAmount,
      status: 'Sent',
      date: generatedProposal.date
    };

    const savedQuotes = JSON.parse(localStorage.getItem('app_quotes') || '[]');
    localStorage.setItem('app_quotes', JSON.stringify([newQuote, ...savedQuotes]));

    showToast(language === 'EN' ? `Official Quote ${newQuote.id} created & saved to Quotes!` : `Officiële Offerte ${newQuote.id} aangemaakt & opgeslagen!`);
    setClaudeProposalModalOpen(false);
  };

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

  // Section 2.3: Auto-Loaded Message Templates & Multiple WhatsApp Photo Attachments
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [attachPhotos, setAttachPhotos] = useState(false);
  const [attachedPhotos, setAttachedPhotos] = useState([
    { id: 1, name: '3d_outdoor_kitchen_render.png', url: '/dasbordes images.png' },
    { id: 2, name: 'garden_site_photo.jpg', url: '/outdoor_project_card.png' }
  ]);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPhotos = files.map((file, idx) => ({
        id: Date.now() + idx,
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setAttachedPhotos(prev => [...prev, ...newPhotos]);
      setAttachPhotos(true);
      showToast(language === 'EN' ? `${files.length} photo(s) attached!` : `${files.length} foto('s) bijgevoegd!`);
    }
  };

  const handleRemovePhoto = (photoId) => {
    const updated = attachedPhotos.filter(p => p.id !== photoId);
    setAttachedPhotos(updated);
    if (updated.length === 0) setAttachPhotos(false);
    showToast(language === 'EN' ? 'Photo removed' : 'Foto verwijderd');
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
    const calculatedTotal = quoteLineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const newQuote = {
      id: `Q-${Math.floor(4000 + Math.random() * 1000)}`,
      customer: quoteForm.customer || customerName,
      project: quoteForm.product || translatedCat,
      amount: `€ ${calculatedTotal.toLocaleString()}`,
      status: 'Sent',
      date: new Date().toISOString().split('T')[0],
      items: quoteLineItems
    };

    const savedQuotes = JSON.parse(localStorage.getItem('app_quotes') || '[]');
    localStorage.setItem('app_quotes', JSON.stringify([newQuote, ...savedQuotes]));

    showToast(`Quotation ${newQuote.id} (€${calculatedTotal.toLocaleString()}) created for ${newQuote.customer}!`);
    setAutoModalType(null);
    setQuoteViewModalOpen(true);
    advanceStep();
  };

  const autoConvertProjectAndCustomer = (assignedPartner) => {
    const projName = projectForm.projectName || `Bespoke ${translatedCat}`;
    const custName = projectForm.customer || customerName;
    const partnerName = assignedPartner || projectForm.partner || 'Sven Hoek (Hoek Bouw)';

    const newProject = {
      id: `P-${Math.floor(2000 + Math.random() * 1000)}`,
      name: projName,
      customer: custName,
      partner: partnerName,
      progress: 25,
      deadline: projectForm.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'In Progress'
    };

    const savedProjects = JSON.parse(localStorage.getItem('app_projects') || '[]');
    const exists = savedProjects.some(p => p.customer === custName && p.name === projName);
    if (!exists) {
      localStorage.setItem('app_projects', JSON.stringify([newProject, ...savedProjects]));
    }

    // Auto-Convert to Customers Directory
    const newCustomer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: custName,
      email: customerEmail,
      phone: lead?.phone || '+31 6 12345678',
      location: lead?.location || 'Amsterdam, NL',
      category: translatedCat,
      totalSpent: '€ 12,500',
      status: 'Active Client',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    const savedCustomers = JSON.parse(localStorage.getItem('app_customers') || '[]');
    const custExists = savedCustomers.some(c => c.name === custName);
    if (!custExists) {
      localStorage.setItem('app_customers', JSON.stringify([newCustomer, ...savedCustomers]));
    }

    // Trigger global event for real-time synchronization
    window.dispatchEvent(new Event('app_data_changed'));
    return newProject;
  };

  const handleSaveAutoProject = (e) => {
    e.preventDefault();
    const newProject = autoConvertProjectAndCustomer(projectForm.partner);
    showToast(`🚀 Project ${newProject.id} & Client ${newProject.customer} auto-converted to Live Projects & Customers!`);
    setAutoModalType(null);
    advanceStep();
  };

  const handleSaveAutoPartner = (e) => {
    e.preventDefault();
    const newProject = autoConvertProjectAndCustomer(partnerForm.partnerName);
    showToast(`🚀 Partner ${partnerForm.partnerName} assigned! Project ${newProject.id} auto-converted to Live Projects!`);
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
    if (stepId === 2) {
      if (isPriceRequestSent) return 'completed';
      if (currentStep === 2) return 'current';
      return 'upcoming';
    }
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
            {/* Meta badges & Back button */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-primary hover:bg-white/80 flex items-center gap-1 bg-white/50 px-2.5 py-1 rounded-lg border border-[#D6CFC2] transition-colors cursor-pointer shadow-2xs"
                  title="Return to full Leads overview table"
                >
                  ← {language === 'EN' ? 'Back to Leads Overview' : 'Terug naar Leads Overzicht'}
                </button>
              )}
              <span className="text-[10px] font-bold text-accent tracking-wider uppercase font-body">Workflow</span>
              <Badge variant="info">{language === 'EN' ? `Step ${currentStep}/8` : `Stap ${currentStep}/8`}</Badge>
              <span className="text-[10px] font-bold text-primary font-body bg-primary/10 px-1.5 py-0.5 rounded-md capitalize">
                {translateCategory(lead?.productType || customerCategory)}
              </span>
            </div>
            {/* Customer name & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-heading font-bold text-primary leading-tight truncate">
                {customerName}
              </h2>

              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  size="sm" 
                  variant="primary" 
                  icon={Send} 
                  onClick={() => {
                    const el = document.getElementById('auto-message-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    showToast(language === 'EN' ? 'Initial inquiry response ready to send below' : 'Eerste reactie sjabloon gereed hieronder');
                  }}
                  className="text-xs py-1 px-2.5 shadow-xs"
                >
                  {language === 'EN' ? 'Send Message' : 'Bericht Versturen'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  icon={MessageSquare} 
                  onClick={() => setCommercialModalOpen(true)}
                  className="text-xs py-1 px-2.5 border-primary/40 text-primary hover:bg-primary/10 shadow-xs"
                >
                  {language === 'EN' ? '+ Add Commercial Action' : '+ Commerciële Actie Toevoegen'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  icon={Mic} 
                  onClick={() => setPlaudModalOpen(true)}
                  className="text-xs py-1 px-2.5 border-purple-500/40 text-purple-900 bg-purple-100/70 hover:bg-purple-200 shadow-xs font-bold"
                  title="Import Plaud AI Voice Recorder call notes & transcripts"
                >
                  🎙️ {language === 'EN' ? 'Plaud AI Import' : 'Plaud AI Import'}
                </Button>
              </div>
            </div>
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

                  {/* SUBMITTED QUOTATION / GEKOPPELDE OFFERTE VISIBILITY CARD */}
                  <div className="p-4 bg-white rounded-xl border border-[#D6CFC2] space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#D6CFC2]/50 pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-bold text-xs text-primary font-heading uppercase tracking-wider">
                          {language === 'EN' ? 'Submitted Quotation / Proposal' : 'Gekoppelde Offerte'}
                        </span>
                        <span className="font-mono text-xs font-bold bg-[#EDE8DF] text-primary px-2 py-0.5 rounded-md">
                          #Q-4001
                        </span>
                      </div>
                      <Badge variant="success">
                        {language === 'EN' ? 'Quote Sent' : 'Offerte verstuurd'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-dark/50 uppercase font-bold block">Product & Specs</span>
                        <span className="font-semibold text-dark truncate block">Bespoke {customerCategory} (3.5m)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-dark/50 uppercase font-bold block">Total Amount</span>
                        <span className="font-bold text-primary text-sm">€ 12,500</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-dark/50 uppercase font-bold block">Issue Date</span>
                        <span className="font-mono text-dark/70">2026-08-04</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#D6CFC2]/40 flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setQuoteViewModalOpen(true)}
                        className="text-xs py-1.5 px-3 border-primary/40 text-primary hover:bg-primary/10 font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        👁️ {language === 'EN' ? 'View Official 6-Page PDF Quotation' : 'Bekijk Officiële 6-Page Offerte'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PRIJSAANVRAAG VERSTUREN */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDE8DF]/50 rounded-xl border border-[#D6CFC2]/60 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D6CFC2]/60 pb-3">
                      <h4 className="font-bold text-dark flex items-center gap-2 text-sm font-heading">
                        <Send className="w-4 h-4 text-primary" /> {language === 'EN' ? 'Send Price Request to Partner' : 'Prijsaanvraag Versturen naar Partner'}
                      </h4>
                      {onOpenPartnerWizard && (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => onOpenPartnerWizard(lead)}
                          className="text-xs py-1.5 px-3 bg-primary text-cream font-bold hover:bg-primary-dark shadow-2xs flex items-center gap-1.5"
                        >
                          🚀 {language === 'EN' ? 'Open 7-Step Partner Price Request Wizard' : 'Open 7-Staps Prijsaanvraag Partner Wizard'}
                        </Button>
                      )}
                    </div>
                    {/* Partner selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">
                        {language === 'EN' ? 'Pick Craftsman Partner' : 'Selecteer Partner'}
                      </label>
                      <select className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Sven Hoek (Hoek Bouw) — 2 {language === 'EN' ? 'active projects' : 'actieve projecten'}</option>
                        <option>Lars Jansen (Jansen Houtwerk) — 1 {language === 'EN' ? 'active project' : 'actief project'}</option>
                        <option>Theo Mulder (Mulder Tuinen) — 3 {language === 'EN' ? 'active projects' : 'actieve projecten'}</option>
                      </select>
                    </div>
                    {/* Editable Free-Text Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">
                          {language === 'EN' ? 'Product Type (Free-Text)' : 'Producttype (Vrije tekst)'}
                        </label>
                        <input 
                          type="text" 
                          value={step2ProductType} 
                          onChange={(e) => setStep2ProductType(e.target.value)} 
                          placeholder={language === 'EN' ? 'e.g. Outdoor Kitchen / Canopy / Custom Joinery' : 'b.v. Buitenkeuken / Overkapping / Maatwerk'}
                          className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">
                          {language === 'EN' ? 'Preferred Dimensions (Free-Text)' : 'Gewenste Maat (Vrije tekst)'}
                        </label>
                        <input 
                          type="text" 
                          value={step2Size} 
                          onChange={(e) => setStep2Size(e.target.value)} 
                          placeholder="e.g. 350x80x95 cm or Custom 4m"
                          className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold" 
                        />
                      </div>
                    </div>
                    {/* Special requirements */}
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">
                        {language === 'EN' ? 'Special Requirements & Instructions' : 'Bijzondere Vereisten en Instructies'}
                      </label>
                      <textarea
                        className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[70px] resize-none"
                        placeholder={language === 'EN' ? 'e.g. Teak wood frame, concrete countertop, LED lighting...' : 'b.v. Teakhout frame, beton aanrectblad...'}
                        defaultValue="Bespoke teak wood frame with polished concrete countertop (3.5m width)."
                      />
                    </div>
                    {/* Response deadline */}
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">
                        {language === 'EN' ? 'Response Deadline' : 'Reactie Deadline'}
                      </label>
                      <input
                        type="date"
                        defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>
                        {isPriceRequestSent 
                          ? (language === 'EN' ? '✓ Price Request successfully sent to partner! Step 2 is now Complete (Green).' : '✓ Prijsaanvraag succesvol verzonden naar partner! Stap 2 is nu Voltooid (Groen).') 
                          : (language === 'EN' ? 'Fill form and click button to send request & mark Step 2 complete.' : 'Vul het formulier in en klik op "Prijsaanvraag Versturen" om af te ronden.')}
                      </span>
                    </div>
                    <Button 
                      type="button" 
                      variant="primary" 
                      size="sm" 
                      onClick={() => {
                        setIsPriceRequestSent(true);
                        showToast(language === 'EN' ? 'Partner Price Request sent! Step 2 is now Green ✓' : 'Prijsaanvraag verzonden naar partner! Stap 2 is nu Groen ✓');
                      }}
                      className={`whitespace-nowrap text-xs font-bold py-1.5 px-3.5 shadow-xs transition-all ${
                        isPriceRequestSent ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-primary text-cream hover:bg-primary/90'
                      }`}
                    >
                      {isPriceRequestSent 
                        ? (language === 'EN' ? '✓ Request Sent (Green)' : '✓ Aanvraag Verzonden (Groen)') 
                        : (language === 'EN' ? 'Send Price Request →' : 'Prijsaanvraag Versturen →')}
                    </Button>
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
              <div id="auto-message-section" className="pt-4 mt-6 border-t border-[#D6CFC2]/70 space-y-3 bg-[#EDE8DF]/40 p-4 rounded-xl border border-[#D6CFC2]/60">
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
                        href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMessageText + (attachPhotos && attachedPhotos.length > 0 ? `\n\n[Attached ${attachedPhotos.length} Photos: ${attachedPhotos.map(p => p.name).join(', ')}]` : ''))}`}
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

                  {/* Multiple Photos Upload & Thumbnail Gallery Grid */}
                  {attachPhotos && (
                    <div className="p-3 bg-white rounded-xl border border-[#D6CFC2] space-y-3 animate-fadeIn">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                        multiple
                        className="hidden" 
                      />
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D6CFC2]/40 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800">
                            ✓ {attachedPhotos.length} {language === 'EN' ? 'Photos / 3D Renders Attached' : 'Foto\'s / 3D Renders Bijgevoegd'}
                          </span>
                          <span className="text-[10px] text-dark/50 font-mono">
                            ({language === 'EN' ? 'Ready to send via WhatsApp' : 'Klaar om te verzenden via WhatsApp'})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => fileInputRef.current?.click()} 
                            className="text-[11px] py-1 px-2.5 bg-[#EDE8DF] border-[#C4BEB3] text-primary hover:bg-[#D6CFC2]"
                          >
                            📷 {language === 'EN' ? '+ Add Photos' : '+ Foto\'s Toevoegen'}
                          </Button>
                          <button 
                            type="button" 
                            onClick={() => { setAttachedPhotos([]); setAttachPhotos(false); }} 
                            className="text-xs text-red-600 font-bold hover:underline px-1"
                          >
                            {language === 'EN' ? 'Clear All' : 'Alles Verwijderen'}
                          </button>
                        </div>
                      </div>

                      {/* Thumbnail Gallery Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {attachedPhotos.map((photo) => (
                          <div key={photo.id} className="relative group bg-[#F8F7F4] border border-[#D6CFC2]/70 rounded-lg p-1.5 flex flex-col items-center text-center space-y-1">
                            <img 
                              src={photo.url} 
                              alt={photo.name} 
                              className="w-full h-16 object-cover rounded border border-[#D6CFC2]/40 shadow-2xs" 
                            />
                            <span className="text-[10px] font-medium text-dark/80 truncate w-full px-1" title={photo.name}>
                              {photo.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id)}
                              className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-sm hover:bg-red-700 transition-colors"
                              title="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
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

        {/* Right Column: Commercial Actions + Activity Lifecycle History Timeline (1 Col) */}
        <div className="space-y-4">

          {/* NEW COMMERCIAL ACTIONS SECTION (Positioned directly ABOVE Activity History per PDF spec) */}
          <Card>
            <div className="flex items-center justify-between mb-3 border-b border-[#D6CFC2]/60 pb-2">
              <h3 className="font-heading font-bold text-sm sm:text-base text-primary flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>{language === 'EN' ? 'Commercial Actions' : 'Commerciële Acties'}</span>
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setCommercialModalOpen(true)}
                className="py-1 px-2 text-[10px] border-primary/40 text-primary hover:bg-primary/10 font-bold"
              >
                + {language === 'EN' ? 'Add Action' : 'Actie Toevoegen'}
              </Button>
            </div>

            {commercialActions.length > 0 ? (
              <div className="space-y-2.5 text-xs max-h-[300px] overflow-y-auto pr-1">
                {commercialActions.map((item) => (
                  <div key={item.id} className="p-3 bg-[#F8F7F4] border border-[#D6CFC2]/70 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex justify-between items-center text-[10px] text-dark/50 font-mono border-b border-[#D6CFC2]/30 pb-1">
                      <span className="font-bold text-primary">{item.user}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-dark/85 font-body leading-relaxed pt-0.5">{item.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-dark/40 italic text-center py-4">
                {language === 'EN' ? 'No commercial actions recorded yet.' : 'Nog geen commerciële acties vastgelegd.'}
              </p>
            )}
          </Card>

          {/* PLAUD AI VOICE RECORDINGS & CALL TRANSCRIPTS SECTION */}
          <Card>
            <div className="flex items-center justify-between mb-3 border-b border-[#D6CFC2]/60 pb-2">
              <h3 className="font-heading font-bold text-sm sm:text-base text-primary flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-purple-700" />
                <span>{language === 'EN' ? 'Plaud AI Voice Notes & Call Recordings' : 'Plaud AI Spraaknotities & Opnames'}</span>
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setPlaudModalOpen(true)}
                className="py-1 px-2 text-[10px] border-purple-400 text-purple-900 bg-purple-50 hover:bg-purple-100 font-bold"
              >
                🎙️ + {language === 'EN' ? 'Import Audio' : 'Audio Importeren'}
              </Button>
            </div>

            {plaudRecordings.length > 0 ? (
              <div className="space-y-2.5 text-xs max-h-[300px] overflow-y-auto pr-1">
                {plaudRecordings.map((rec) => (
                  <div key={rec.id} className="p-3 bg-purple-50/60 border border-purple-200/80 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 border-b border-purple-200/50 pb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <button 
                          type="button"
                          onClick={() => {
                            setPlayingAudioId(playingAudioId === rec.id ? null : rec.id);
                            showToast(playingAudioId === rec.id ? 'Playback paused' : `Playing audio: ${rec.title}`);
                          }}
                          className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center flex-shrink-0 hover:bg-purple-800 transition-colors shadow-xs"
                          title="Play Audio Recording"
                        >
                          {playingAudioId === rec.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                        <div className="min-w-0">
                          <p className="font-bold text-dark truncate text-xs">{rec.title}</p>
                          <p className="text-[10px] text-purple-900 font-mono">📁 {rec.fileName} • ⏱️ {rec.duration}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-dark/50 font-mono flex-shrink-0">{rec.date}</span>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-lg border border-purple-100 text-[#4A4A43] leading-relaxed text-[11px] space-y-2">
                      <div>
                        <p className="font-bold text-purple-950 text-[10px] uppercase mb-0.5 tracking-wider">🤖 Plaud AI Transcript Summary</p>
                        {rec.summary}
                      </div>

                      <div className="pt-1 border-t border-purple-100 flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleGenerateClaudeProposal(rec)}
                          className="text-[10px] py-1 px-2.5 bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-300 text-purple-950 hover:bg-purple-200 font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          {language === 'EN' ? 'Generate Claude AI Proposal' : 'Claude AI Offerte Genereren'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-dark/40 italic text-center py-4">
                {language === 'EN' ? 'No Plaud AI audio recordings imported yet.' : 'Nog geen Plaud AI spraakopnames geïmporteerd.'}
              </p>
            )}
          </Card>

          {/* Activity Lifecycle History Timeline */}
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
                  <div className="text-dark/60 text-[11px] mt-0.5">{translateCategory(item.desc)}</div>
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

      {/* PLAUD AI AUDIO IMPORT MODAL */}
      <AnimatePresence>
        {plaudModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-card p-6 w-full max-w-lg space-y-4">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-3">
                <h3 className="font-heading font-bold text-lg text-purple-950 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-purple-700" />
                  <span>🎙️ {language === 'EN' ? 'Import Plaud AI Audio Recording' : 'Plaud AI Audio-Opname Importeren'}</span>
                </h3>
                <button onClick={() => setPlaudModalOpen(false)} className="text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePlaudAudio} className="space-y-4">
                <div className="p-3 bg-purple-100/60 border border-purple-200 rounded-xl text-purple-950 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileAudio className="w-5 h-5 text-purple-700 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold truncate">{plaudAudioForm.fileName}</p>
                      <p className="text-[10px] text-purple-800 font-mono">Plaud AI Voice Recorder Sync • 128kbps MP3</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => audioFileInputRef.current?.click()}
                    className="text-[11px] py-1 px-2.5 bg-white border-purple-300 text-purple-900 font-bold flex-shrink-0"
                  >
                    📁 {language === 'EN' ? 'Browse Audio' : 'Audio Kiezen'}
                  </Button>
                  <input 
                    type="file" 
                    ref={audioFileInputRef} 
                    onChange={handleAudioFileUpload} 
                    accept="audio/*" 
                    className="hidden" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/60 uppercase tracking-wider mb-1">
                    {language === 'EN' ? 'Recording Title / Subject' : 'Titel / Onderwerp Opname'}
                  </label>
                  <input
                    required
                    type="text"
                    value={plaudAudioForm.title}
                    onChange={(e) => setPlaudAudioForm({ ...plaudAudioForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    placeholder={language === 'EN' ? 'e.g. Client Phone Call — Materials & Size Confirmation' : 'b.v. Telefoongesprek Klant — Materialen & Afmetingen'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/60 uppercase tracking-wider mb-1">
                    {language === 'EN' ? 'Plaud AI Transcript Summary & Key Notes' : 'Plaud AI Transcript Samenvatting'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={plaudAudioForm.summary}
                    onChange={(e) => setPlaudAudioForm({ ...plaudAudioForm, summary: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    placeholder={language === 'EN' ? 'Paste Plaud AI transcript summary or recorded audio notes here...' : 'Plak hier de Plaud AI transcritsamenvatting of spraaknotities...'}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" onClick={() => setPlaudModalOpen(false)}>
                    {language === 'EN' ? 'Cancel' : 'Annuleren'}
                  </Button>
                  <Button type="submit" variant="primary" className="bg-purple-800 hover:bg-purple-900 border-purple-800 text-white">
                    🎙️ {language === 'EN' ? 'Import & Save to Lead Card' : 'Importeren & Opslaan'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD COMMERCIAL ACTION FREE-TEXT MODAL */}
      <AnimatePresence>
        {commercialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-card p-6 w-full max-w-lg space-y-4">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-3">
                <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>{language === 'EN' ? 'Add Commercial Action / Note' : 'Commerciële Actie / Notitie Toevoegen'}</span>
                </h3>
                <button onClick={() => setCommercialModalOpen(false)} className="text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCommercialAction} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dark/60 uppercase tracking-wider mb-1">
                    {language === 'EN' ? 'Action / Conversation Details (Free-text)' : 'Actie / Gespreksnotities (Vrije tekst)'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newCommercialNote}
                    onChange={(e) => setNewCommercialNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={language === 'EN' ? 'e.g. Called customer regarding quote Q-4001, agreed to schedule site intake next Tuesday...' : 'b.v. Klant gebeld over offerte Q-4001, afgesproken om volgende week dinsdag in te meten...'}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" onClick={() => setCommercialModalOpen(false)}>
                    {language === 'EN' ? 'Cancel' : 'Annuleren'}
                  </Button>
                  <Button type="submit" variant="primary">
                    {language === 'EN' ? 'Save Commercial Action' : 'Commerciële Actie Opslaan'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CLAUDE AI DRAFT PROPOSAL GENERATION MODAL */}
      <AnimatePresence>
        {claudeProposalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-2xl p-6 w-full max-w-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary leading-tight">
                      🤖 Claude AI Draft Proposal Engine
                    </h3>
                    <p className="text-[11px] text-dark/60 font-mono">
                      Vanuit Ambacht Brand Tone • Auto-Generated from Voice Call
                    </p>
                  </div>
                </div>
                <button onClick={() => setClaudeProposalModalOpen(false)} className="text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isGeneratingProposal ? (
                <div className="py-12 text-center space-y-3">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="w-10 h-10 border-3 border-purple-700 border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-sm font-bold text-primary">
                    {language === 'EN' ? 'Claude AI is analyzing voice transcript & generating proposal in Vanuit Ambacht brand tone...' : 'Claude AI analyseert audio-transcript & genereert concept offerte in Vanuit Ambacht stijl...'}
                  </p>
                </div>
              ) : generatedProposal ? (
                <div className="space-y-4 text-xs font-body text-dark">
                  <div className="p-4 bg-white rounded-xl border border-[#D6CFC2] space-y-3 shadow-2xs">
                    <div className="flex justify-between items-center border-b border-[#D6CFC2]/50 pb-2">
                      <span className="font-mono text-xs font-bold text-primary">{generatedProposal.quoteId}</span>
                      <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md font-bold uppercase">
                        Claude AI Draft
                      </span>
                    </div>

                    <div className="p-3 bg-[#F8F7F4] rounded-lg border border-[#D6CFC2]/60 whitespace-pre-line text-dark/85 text-[11px] italic leading-relaxed">
                      "{generatedProposal.introText}"
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-xs text-primary uppercase tracking-wider block">Proposed Itemized Pricing</span>
                      <div className="space-y-1.5 border border-[#D6CFC2]/60 rounded-lg p-2.5 bg-white">
                        {generatedProposal.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[#D6CFC2]/30 last:border-0">
                            <span className="text-dark/80">{item.desc}</span>
                            <span className="font-bold text-dark">{item.price}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center text-sm font-bold text-primary pt-2 border-t border-[#D6CFC2]">
                          <span>{language === 'EN' ? 'Total (Incl. VAT)' : 'Totaalbedrag (Incl. BTW)'}</span>
                          <span className="text-base text-primary font-heading">{generatedProposal.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/20 text-center text-[10px] font-semibold text-primary">
                      {generatedProposal.brandNote}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#D6CFC2]">
                    <Button type="button" variant="outline" onClick={() => setClaudeProposalModalOpen(false)}>
                      {language === 'EN' ? 'Close Preview' : 'Sluiten'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="primary" 
                      icon={FileText} 
                      onClick={handleExportProposalToQuote}
                      className="bg-primary text-cream hover:bg-primary/90 font-bold shadow-md"
                    >
                      ✨ {language === 'EN' ? `Convert to Official Quote (${generatedProposal.quoteId})` : `Omzetten naar Officiële Offerte (${generatedProposal.quoteId})`}
                    </Button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTO-PREFILLED MODALS */}
      <AnimatePresence>
        {autoModalType === 'quote' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-2xl p-6 w-full max-w-3xl space-y-5 max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary text-cream flex items-center justify-center shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary leading-tight">
                      📑 Direct Multi-Item Quotation Generator
                    </h3>
                    <p className="text-[11px] text-dark/60 font-mono">
                      Lead Card Step 4 • Official Quotation Builder (#OF-2026-002)
                    </p>
                  </div>
                </div>
                <button onClick={() => setAutoModalType(null)} className="text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAutoQuote} className="space-y-4 text-xs font-body text-dark">
                {/* Client Metadata Header Card */}
                <div className="p-4 bg-white rounded-xl border border-[#D6CFC2] space-y-3 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Customer Name</label>
                      <input type="text" readOnly value={quoteForm.customer} className="w-full px-3 py-2 bg-[#EDE8DF]/60 border border-[#D6CFC2] rounded-lg font-bold text-dark" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Email Address</label>
                      <input type="text" readOnly value={quoteForm.email} className="w-full px-3 py-2 bg-[#EDE8DF]/60 border border-[#D6CFC2] rounded-lg text-dark/70" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-dark/50 uppercase mb-1">Phone Number</label>
                      <input type="text" readOnly value={quoteForm.phone} className="w-full px-3 py-2 bg-[#EDE8DF]/60 border border-[#D6CFC2] rounded-lg text-dark/70" />
                    </div>
                  </div>
                </div>

                {/* Pre-saved Product Library Dropdown */}
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>+ Product Bibliotheek (Pre-saved Library)</span>
                  </div>
                  <select 
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const selected = PRESET_PRODUCTS.find(p => p.desc === e.target.value);
                      if (selected) {
                        setQuoteLineItems(prev => [
                          ...prev,
                          { id: Date.now(), desc: selected.desc, qty: 1, unitPrice: selected.unitPrice }
                        ]);
                        showToast(`Inserted: ${selected.desc}`);
                      }
                      e.target.value = '';
                    }}
                    className="w-full sm:w-auto px-3 py-1.5 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                  >
                    <option value="">-- Select Product from Catalog --</option>
                    {PRESET_PRODUCTS.map((prod, idx) => (
                      <option key={idx} value={prod.desc}>{prod.desc} (€{prod.unitPrice})</option>
                    ))}
                  </select>
                </div>

                {/* Line Items Table */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-primary uppercase tracking-wider">Itemized Line Items</span>
                    <button 
                      type="button"
                      onClick={() => setQuoteLineItems(prev => [...prev, { id: Date.now(), desc: 'Custom Craftsman Item', qty: 1, unitPrice: 500 }])}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      + Add Line Item
                    </button>
                  </div>

                  <div className="border border-[#D6CFC2] rounded-xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#EDE8DF] text-dark/70 text-[10px] font-bold uppercase border-b border-[#D6CFC2]">
                        <tr>
                          <th className="p-2.5">Omschrijving</th>
                          <th className="p-2.5 w-16 text-center">Aantal</th>
                          <th className="p-2.5 w-28 text-right">Prijs p.st (€)</th>
                          <th className="p-2.5 w-28 text-right">Totaal (€)</th>
                          <th className="p-2.5 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D6CFC2]/40 text-xs">
                        {quoteLineItems.map((item) => (
                          <tr key={item.id}>
                            <td className="p-2">
                              <input 
                                type="text" 
                                value={item.desc}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setQuoteLineItems(prev => prev.map(i => i.id === item.id ? { ...i, desc: val } : i));
                                }}
                                className="w-full px-2 py-1 bg-white border border-[#D6CFC2]/60 rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input 
                                type="number" 
                                value={item.qty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  setQuoteLineItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: val } : i));
                                }}
                                className="w-12 text-center py-1 bg-white border border-[#D6CFC2]/60 rounded font-semibold"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <input 
                                type="number" 
                                value={item.unitPrice}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setQuoteLineItems(prev => prev.map(i => i.id === item.id ? { ...i, unitPrice: val } : i));
                                }}
                                className="w-24 text-right py-1 bg-white border border-[#D6CFC2]/60 rounded font-semibold text-dark"
                              />
                            </td>
                            <td className="p-2 text-right font-bold text-dark">
                              € {(item.qty * item.unitPrice).toLocaleString()}
                            </td>
                            <td className="p-2 text-center">
                              <button 
                                type="button"
                                onClick={() => setQuoteLineItems(prev => prev.filter(i => i.id !== item.id))}
                                className="text-red-500 hover:text-red-700 font-bold text-xs"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Totals Summary Footer */}
                    <div className="p-3 bg-[#EDE8DF]/80 border-t border-[#D6CFC2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <span className="text-[11px] font-semibold text-dark/70">
                        Total Items: {quoteLineItems.length} | Inclusief 21% BTW & Ambachtelijke Garantie
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-dark/50 font-bold uppercase block">Quotation Total (Incl. VAT)</span>
                        <span className="text-lg font-heading font-bold text-primary">
                          € {quoteLineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" onClick={() => setAutoModalType(null)}>
                    {language === 'EN' ? 'Cancel' : 'Annuleren'}
                  </Button>
                  <Button type="submit" icon={Send} className="bg-primary text-cream hover:bg-primary/90 font-bold shadow-md">
                    ✨ {language === 'EN' ? 'Generate & Save Official Quotation →' : 'Offerte Genereren & Opslaan →'}
                  </Button>
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

        {/* 6-PAGE BRANDED PDF PROPOSAL VIEWER MODAL */}
        {quoteViewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl shadow-2xl p-6 w-full max-w-3xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary leading-tight">
                      📄 Gekoppelde Offerte #Q-4001
                    </h3>
                    <p className="text-[11px] text-dark/60 font-mono">
                      Vanuit Ambacht Official PDF Quotation Proposal • Client: {customerName}
                    </p>
                  </div>
                </div>
                <button onClick={() => setQuoteViewModalOpen(false)} className="text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pixel-Perfect 6-Page Proposal Summary */}
              <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#C4BEB3] shadow-inner space-y-6 text-[#4A4A43]">
                {/* Header Banner */}
                <div className="bg-[#3E4E36] text-[#FDFBF7] p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#70624F] bg-[#EDE8DF] px-2 py-0.5 rounded">OFFERTE PROPOSAL</span>
                    <h4 className="text-lg font-heading font-bold mt-1 text-white">Uw buitenkeuken, op maat gemaakt</h4>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <p className="font-bold text-cream">#Q-4001</p>
                    <p className="text-white/70">Datum: 04-08-2026</p>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="p-4 bg-white rounded-lg border border-[#D6CFC2]/60 space-y-2 text-xs leading-relaxed">
                  <p className="font-semibold text-dark">Beste {customerName},</p>
                  <p className="text-dark/80">
                    Hartelijk dank voor uw aanvraag bij Vanuit Ambacht. Wij hebben met genoegen deze maatofferte voor uw {translateCategory(customerCategory)} opgesteld. Onze vakmensen garanderen duurzame topkwaliteit met oog voor elk detail.
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#EDE8DF]/60 rounded-lg border border-[#D6CFC2]/40">
                    <span className="text-[10px] text-dark/50 uppercase font-bold block">Afmeting</span>
                    <span className="font-semibold text-dark">350 x 80 x 95 cm</span>
                  </div>
                  <div className="p-3 bg-[#EDE8DF]/60 rounded-lg border border-[#D6CFC2]/40">
                    <span className="text-[10px] text-dark/50 uppercase font-bold block">Houtsoort</span>
                    <span className="font-semibold text-dark">Thermo Fraké Hout</span>
                  </div>
                  <div className="p-3 bg-[#EDE8DF]/60 rounded-lg border border-[#D6CFC2]/40">
                    <span className="text-[10px] text-dark/50 uppercase font-bold block">Aanrechtblad</span>
                    <span className="font-semibold text-dark">Beton Cire Zwart</span>
                  </div>
                  <div className="p-3 bg-[#EDE8DF]/60 rounded-lg border border-[#D6CFC2]/40">
                    <span className="text-[10px] text-dark/50 uppercase font-bold block">Levertijd</span>
                    <span className="font-semibold text-primary font-mono">Week 49 (2026)</span>
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-primary uppercase tracking-wider">Investeringsingoverzicht (Pricing Breakdown)</h5>
                  <div className="border border-[#D6CFC2] rounded-lg overflow-hidden bg-white text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#3E4E36] text-[#FDFBF7] uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Omschrijving Item</th>
                          <th className="p-2.5 text-right">Bedrag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D6CFC2]/40">
                        <tr><td className="p-2.5">Maatwerk Buitenkeuken Frame (Thermo Fraké Hout)</td><td className="p-2.5 text-right font-semibold">€ 8,500.00</td></tr>
                        <tr><td className="p-2.5">Gepolijst Beton Cire Aanrechtblad (8cm Zwart)</td><td className="p-2.5 text-right font-semibold">€ 2,800.00</td></tr>
                        <tr><td className="p-2.5">Inbouw Kamado Big Green Egg Cutout & RVS Kraan</td><td className="p-2.5 text-right font-semibold">€ 1,200.00</td></tr>
                      </tbody>
                    </table>
                    <div className="p-3 bg-[#EDE8DF]/80 border-t border-[#D6CFC2] flex justify-between items-center font-bold text-primary text-sm">
                      <span>Totaalbedrag (Incl. 21% BTW)</span>
                      <span className="text-base font-heading">€ 12,500.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D6CFC2]">
                <Button type="button" variant="outline" onClick={() => setQuoteViewModalOpen(false)}>
                  {language === 'EN' ? 'Close Preview' : 'Sluiten'}
                </Button>
                <Button 
                  type="button" 
                  variant="primary" 
                  icon={Download}
                  onClick={() => {
                    showToast(language === 'EN' ? 'Downloading Official PDF Quote #Q-4001...' : 'PDF Offerte #Q-4001 wordt gedownload...');
                    setQuoteViewModalOpen(false);
                  }}
                  className="bg-primary text-cream hover:bg-primary/90 font-bold"
                >
                  📥 {language === 'EN' ? 'Download PDF Proposal' : 'Download PDF Offerte'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
