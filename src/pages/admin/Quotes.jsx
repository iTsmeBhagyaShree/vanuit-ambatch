import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, X, Check, CheckCircle, Trash2, Edit2, RotateCcw, FileText, Download, Printer, PlusCircle, MinusCircle, Briefcase, Share2, ExternalLink, Copy, ShoppingBag } from 'lucide-react';
import { mockQuotes as defaultQuotes } from '../../utils/mockData';
import { useLanguage } from '../../context/LanguageContext';
import outdoorProjectCard from '../../assets/outdoor_project_card.png';
import outdoorLivingLogin from '../../assets/outdoor_living_login.png';

// Helper to get raw numeric value from formatted amount string (e.g. "€ 12,500" -> 12500)
const getNumericAmount = (amtStr) => {
  if (!amtStr) return 0;
  const val = parseFloat(String(amtStr).replace(/[^\d.-]/g, ''));
  return isNaN(val) ? 0 : val;
};

// Bulletproof Clipboard Copy Helper with execCommand fallback
const copyTextToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // Fallback
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    return false;
  }
};

// Pre-saved Fixed Product Library for Outdoor Kitchens
const PRESET_PRODUCT_LIBRARY = [
  { id: 'p1', description: 'Thermo Fraké Buitenkeuken Cabinet (240x80cm)', unitPrice: 2450 },
  { id: 'p2', description: 'Massief Teak Hout Buitenkeuken Cabinet (300x90cm)', unitPrice: 3200 },
  { id: 'p3', description: 'Big Green Egg Large Uitsparing & Base Support', unitPrice: 450 },
  { id: 'p4', description: 'Zwart Polijst Beton Cire Werkblad (8cm)', unitPrice: 850 },
  { id: 'p5', description: 'RVS Inbouw Buitenkoelkast Premium 80L', unitPrice: 890 },
  { id: 'p6', description: 'RVS Spoelbak & Mengkraan Inbouwset', unitPrice: 390 },
  { id: 'p7', description: 'Heavy Duty Terras Wielen Set (4x)', unitPrice: 190 },
  { id: 'p8', description: 'Bezorging & Professionele Inhuizen', unitPrice: 0 }
];

// Sequential Quote Number Generator: OF-{year}-{sequence}
const generateNextQuoteId = (quotesList) => {
  const year = new Date().getFullYear();
  const prefix = `OF-${year}-`;
  let maxSeq = 0;

  if (Array.isArray(quotesList)) {
    quotesList.forEach((q) => {
      if (q && q.id && typeof q.id === 'string') {
        const match = q.id.match(/OF-\d{4}-(\d+)/i) || q.id.match(/OF-(\d+)/i) || q.id.match(/Q-(\d+)/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    });
  }

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `${prefix}${nextSeq}`;
};

export default function Quotes() {
  const { t, language } = useLanguage();
  const [quotes, setQuotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [modalOpen, setModalOpen] = useState(false);
  const [pdfPreviewQuote, setPdfPreviewQuote] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null); // null = adding, object = editing
  const [toastMsg, setToastMsg] = useState('');

  // Multi-item Form State
  const [form, setForm] = useState({
    customer: '',
    project: '',
    discountPercent: 0,
    status: 'Concept',
    items: [
      { description: 'Buitenkeuken Frame (Teak Hout)', quantity: 1, unitPrice: 8500 },
      { description: 'Beton Aanrechtblad & Installatie', quantity: 1, unitPrice: 2800 }
    ]
  });

  // Load quotes from localStorage on mount with bulletproof fallback
  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem('app_quotes_v2') || localStorage.getItem('app_quotes');
      if (savedQuotes) {
        const parsed = JSON.parse(savedQuotes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const safeQuotes = parsed.map(q => ({
            ...q,
            id: q.id || `Q-${Math.floor(4000 + Math.random() * 1000)}`,
            customer: q.customer || 'Onbekend',
            project: q.project || 'Maatwerk Keuken',
            amount: q.amount || '€ 5,000',
            date: q.date || new Date().toISOString().split('T')[0],
            status: q.status === 'Draft' ? 'Concept' : q.status === 'Accepted' ? 'Geaccepteerd' : (q.status || 'Concept'),
            discountPercent: q.discountPercent || 0,
            items: Array.isArray(q.items) && q.items.length > 0 ? q.items : [
              { description: `${q.project || 'Maatwerk Keuken'} Specs`, quantity: 1, unitPrice: getNumericAmount(q.amount) || 5000 }
            ]
          }));
          setQuotes(safeQuotes);
          localStorage.setItem('app_quotes_v2', JSON.stringify(safeQuotes));
          localStorage.setItem('app_quotes', JSON.stringify(safeQuotes));
          return;
        }
      }
    } catch (e) {
      console.error("Error loading quotes:", e);
    }
    
    // Fallback default quotes
    const enrichedDefaults = defaultQuotes.map(q => ({
      ...q,
      status: q.status === 'Draft' ? 'Concept' : q.status === 'Accepted' ? 'Geaccepteerd' : q.status,
      discountPercent: 0,
      items: Array.isArray(q.items) ? q.items : [
        { description: `${q.project} Main Specs`, quantity: 1, unitPrice: getNumericAmount(q.amount) || 5000 }
      ]
    }));
    setQuotes(enrichedDefaults);
    localStorage.setItem('app_quotes_v2', JSON.stringify(enrichedDefaults));
    localStorage.setItem('app_quotes', JSON.stringify(enrichedDefaults));
  }, []);

  const [leadsList, setLeadsList] = useState([]);
  const [customerSelect, setCustomerSelect] = useState('Other');
  const [projectSelect, setProjectSelect] = useState('Exclusieve Buitenkeuken');

  useEffect(() => {
    if (modalOpen) {
      const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
      if (savedLeads) {
        try { setLeadsList(JSON.parse(savedLeads)); } catch(e){}
      }
    }
  }, [modalOpen]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenAddModal = () => {
    setSelectedQuote(null);
    let freshLeads = leadsList;
    const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
    if (savedLeads) {
      try {
        freshLeads = JSON.parse(savedLeads);
        setLeadsList(freshLeads);
      } catch(e){}
    }

    const defaultCust = freshLeads[0]?.name || 'Jan de Vries';
    setForm({ 
      customer: defaultCust, 
      project: 'Exclusieve Buitenkeuken', 
      discountPercent: 0,
      status: 'Concept',
      items: [
        { description: 'Bespoke Houten Frame', quantity: 1, unitPrice: 7500 },
        { description: 'Aanrechtblad & Afwerking', quantity: 1, unitPrice: 2500 }
      ]
    });
    setCustomerSelect(defaultCust);
    setProjectSelect('Exclusieve Buitenkeuken');
    setModalOpen(true);
  };

  const handleOpenEditModal = (quote) => {
    setSelectedQuote(quote);
    
    // Check match for Customer Select
    const hasMatchingLead = leadsList.some(l => l.name === quote.customer);
    setCustomerSelect(hasMatchingLead ? quote.customer : 'Other');

    const standardProjects = ['Exclusieve Buitenkeuken', 'Exclusieve Kliko-ombouw', 'Houten Pergola', 'Tuinterras'];
    const hasMatchingProject = standardProjects.includes(quote.project);
    setProjectSelect(hasMatchingProject ? quote.project : 'Other');

    setForm({
      customer: quote.customer,
      project: quote.project,
      discountPercent: quote.discountPercent || 0,
      status: quote.status || 'Concept',
      items: quote.items && quote.items.length > 0 ? quote.items : [
        { description: quote.project || 'Maatwerk Keuken', quantity: 1, unitPrice: getNumericAmount(quote.amount) || 5000 }
      ]
    });
    setModalOpen(true);
  };

  const handleDeleteQuote = (id, customer) => {
    const updatedQuotes = quotes.filter(q => q.id !== id);
    setQuotes(updatedQuotes);
    localStorage.setItem('app_quotes_v2', JSON.stringify(updatedQuotes));
    localStorage.setItem('app_quotes', JSON.stringify(updatedQuotes));
    localStorage.setItem('app_quotes_v1', JSON.stringify(updatedQuotes));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Quote "${id}" for "${customer}" deleted successfully!`);
  };

  // Module 3.3 Sub-Item 1: Duplicate Quotation Handler
  const handleDuplicateQuote = (row) => {
    const nextId = generateNextQuoteId(quotes);
    const duplicatedObj = {
      ...row,
      id: nextId,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Concept',
      signerName: '',
      approvedAt: null
    };

    const updatedList = [duplicatedObj, ...quotes];
    setQuotes(updatedList);
    localStorage.setItem('app_quotes_v2', JSON.stringify(updatedList));
    localStorage.setItem('app_quotes', JSON.stringify(updatedList));
    localStorage.setItem('app_quotes_v1', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(language === 'EN' ? `Quote duplicated as ${nextId} (Concept)!` : `Offerte gekopieerd als ${nextId} (Concept)!`);
  };

  // Module 3.3 Sub-Item 3: Product Library Item Selector Handler
  const handleSelectFromLibrary = (productId) => {
    const preset = PRESET_PRODUCT_LIBRARY.find(p => p.id === productId);
    if (!preset) return;
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { description: preset.description, quantity: 1, unitPrice: preset.unitPrice }]
    }));
    showToast(language === 'EN' ? `Added "${preset.description}" from Product Library!` : `"${preset.description}" toegevoegd uit Bibliotheek!`);
  };

  // Auto-generate Invoices and Projects if Quote is Accepted
  const autoGenerateInvoicesAndProjectForAcceptedQuote = (quote) => {
    const totalAmount = getNumericAmount(quote.amount);
    const halfAmount = totalAmount / 2;
    const inv1 = {
      id: `INV-${Date.now().toString().slice(-4)}-A`,
      quoteId: quote.id,
      customer: quote.customer,
      type: '50% Aanbetaling (Upfront)',
      amount: `€ ${halfAmount.toLocaleString()}`,
      numericAmount: halfAmount,
      status: 'Openstaand', // Pending
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0]
    };
    const inv2 = {
      id: `INV-${Date.now().toString().slice(-4)}-B`,
      quoteId: quote.id,
      customer: quote.customer,
      type: '50% Eindfactuur (Completion)',
      amount: `€ ${halfAmount.toLocaleString()}`,
      numericAmount: halfAmount,
      status: 'Openstaand',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0]
    };

    const existingInvoices = JSON.parse(localStorage.getItem('app_invoices') || '[]');
    // Filter out previous generated for this quote to avoid duplicates
    const filteredInvoices = existingInvoices.filter(i => i.quoteId !== quote.id);
    const updatedInvoices = [inv1, inv2, ...filteredInvoices];
    localStorage.setItem('app_invoices', JSON.stringify(updatedInvoices));

    // Auto Create Project
    const existingProjects = JSON.parse(localStorage.getItem('app_projects') || '[]');
    if (!existingProjects.some(p => p.quoteId === quote.id)) {
      const newProject = {
        id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
        name: quote.project,
        customer: quote.customer,
        partner: 'Unassigned',
        progress: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'In Progress',
        orderStatus: 'In voorbereiding',
        quoteId: quote.id,
        value: quote.amount
      };
      localStorage.setItem('app_projects', JSON.stringify([newProject, ...existingProjects]));
    }

    // Auto Update Lead Status to Gewonnen
    const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
    if (savedLeads) {
      try {
        const leads = JSON.parse(savedLeads);
        const updatedLeads = leads.map(l => l.name === quote.customer ? { ...l, status: 'Gewonnen' } : l);
        localStorage.setItem('app_leads_v2', JSON.stringify(updatedLeads));
        localStorage.setItem('app_leads', JSON.stringify(updatedLeads));
      } catch(e){}
    }

    // Trigger app data change event across windows/components
    window.dispatchEvent(new Event('app_data_changed'));
  };

  const calculateSubtotal = (items) => {
    return items.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);
  };

  const calculateFinalTotal = (items, discountPercent) => {
    const subtotal = calculateSubtotal(items);
    const discountAmount = subtotal * ((parseFloat(discountPercent) || 0) / 100);
    return subtotal - discountAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalCustomer = customerSelect === 'Other' ? form.customer : customerSelect;
    const finalProject = projectSelect === 'Other' ? form.project : projectSelect;

    if (!finalCustomer.trim() || !finalProject.trim()) {
      showToast("Please provide valid Customer and Project details.");
      return;
    }

    const finalAmountVal = calculateFinalTotal(form.items, form.discountPercent);
    const formattedAmount = `€ ${finalAmountVal.toLocaleString()}`;
    
    let updatedQuotes = [];

    if (selectedQuote) {
      // Editing Mode
      const updatedQuoteObj = {
        ...selectedQuote,
        customer: finalCustomer,
        project: finalProject,
        amount: formattedAmount,
        discountPercent: parseFloat(form.discountPercent) || 0,
        status: form.status,
        items: form.items
      };

      updatedQuotes = quotes.map(q => q.id === selectedQuote.id ? updatedQuoteObj : q);
      showToast(`Quote "${selectedQuote.id}" updated successfully!`);

      if (form.status === 'Geaccepteerd' || form.status === 'Accepted') {
        autoGenerateInvoicesAndProjectForAcceptedQuote(updatedQuoteObj);
      }
    } else {
      // Adding Mode (Auto Quote Counter: OF-{year}-{sequence})
      const nextId = generateNextQuoteId(quotes);
      const newQuote = {
        id: nextId,
        customer: finalCustomer,
        project: finalProject,
        amount: formattedAmount,
        discountPercent: parseFloat(form.discountPercent) || 0,
        status: form.status,
        items: form.items,
        date: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      updatedQuotes = [newQuote, ...quotes];
      showToast(language === 'EN' ? `Quote "${nextId}" created successfully!` : `Offerte "${nextId}" succesvol aangemaakt!`);

      if (form.status === 'Geaccepteerd' || form.status === 'Accepted') {
        autoGenerateInvoicesAndProjectForAcceptedQuote(newQuote);
      } else {
        // Update Lead status to Offerte if it was Nieuw/In gesprek
        const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
        if (savedLeads) {
          try {
            const leads = JSON.parse(savedLeads);
            const updatedLeads = leads.map(l => (l.name === finalCustomer && l.status !== 'Gewonnen') ? { ...l, status: 'Offerte' } : l);
            localStorage.setItem('app_leads_v2', JSON.stringify(updatedLeads));
            localStorage.setItem('app_leads', JSON.stringify(updatedLeads));
          } catch(e){}
        }
      }
    }

    setQuotes(updatedQuotes);
    localStorage.setItem('app_quotes_v2', JSON.stringify(updatedQuotes));
    localStorage.setItem('app_quotes', JSON.stringify(updatedQuotes));
    window.dispatchEvent(new Event('app_data_changed'));
    setModalOpen(false);
  };

  const handleAddItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    if (form.items.length === 1) return;
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, val) => {
    setForm(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: val };
      return { ...prev, items: newItems };
    });
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setSortBy('newest');
    setSearchQuery('');
  };

  // Process and sort quotes list
  const processedQuotes = [...quotes]
    .filter(quote => {
      const custName = (quote.customer || '').toLowerCase();
      const projName = (quote.project || '').toLowerCase();
      const qId = (quote.id || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = custName.includes(query) || projName.includes(query) || qId.includes(query);
      const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortBy === 'oldest') return new Date(a.date || 0) - new Date(b.date || 0);
      if (sortBy === 'amount-desc') return getNumericAmount(b.amount) - getNumericAmount(a.amount);
      if (sortBy === 'amount-asc') return getNumericAmount(a.amount) - getNumericAmount(b.amount);
      if (sortBy === 'customer-asc') return (a.customer || '').localeCompare(b.customer || '');
      return 0;
    });

  // Dynamic counter stats
  const totalCount = quotes.length;
  const conceptCount = quotes.filter(q => q.status === 'Concept' || q.status === 'Draft').length;
  const sentCount = quotes.filter(q => q.status === 'Verzonden' || q.status === 'Sent').length;
  const acceptedCount = quotes.filter(q => q.status === 'Geaccepteerd' || q.status === 'Accepted' || q.status === 'Gecoördineerd').length;
  const getTranslatedStatus = (st) => {
    if (language !== 'EN') return st;
    switch (st) {
      case 'Concept': case 'Draft': return 'Draft';
      case 'Verzonden': case 'Sent': return 'Sent';
      case 'Gecoördineerd': case 'Coordinated': return 'Coordinated';
      case 'Geaccepteerd': case 'Accepted': return 'Accepted';
      case 'Afgewezen': case 'Rejected': return 'Rejected';
      default: return st;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Concept':
      case 'Draft':
        return 'default';
      case 'Verzonden':
      case 'Sent':
        return 'info';
      case 'Gecoördineerd':
        return 'warning';
      case 'Geaccepteerd':
      case 'Accepted':
      case 'Paid':
        return 'success';
      case 'Afgewezen':
      case 'Rejected':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const handleConvertToProject = (quote) => {
    const updatedQuoteObj = { ...quote, status: 'Geaccepteerd' };
    const updatedQuotes = quotes.map(q => q.id === quote.id ? updatedQuoteObj : q);
    setQuotes(updatedQuotes);
    localStorage.setItem('app_quotes', JSON.stringify(updatedQuotes));
    autoGenerateInvoicesAndProjectForAcceptedQuote(updatedQuoteObj);
    showToast(language === 'EN' ? `Quote converted to Project for ${quote.customer}!` : `Offerte omgezet naar Project voor ${quote.customer}!`);
  };

  const columns = [
    { header: language === 'EN' ? 'Quote ID' : 'Offerte ID', accessor: 'id' },
    { 
      header: language === 'EN' ? 'Category' : 'Categorie',
      style: { minWidth: '200px' },
      render: (row) => {
        const proj = (row.project || '').toLowerCase();
        const cat = row.category || (proj.includes('kliko') || proj.includes('hiko') ? 'Kliko-ombouw' : proj.includes('snijplanken') || proj.includes('decking') ? 'Snijplanken' : 'Buitenkeukens');
        const logoSrc = cat.includes('Kliko')
          ? '/logo_kliko.png'
          : cat.includes('Snijplanken')
          ? '/logo_snijplanken.png'
          : '/logo_buitenkeukens.png';
        const displayCat = language === 'EN' 
          ? (cat.includes('Kliko') ? 'Bin Storage' : cat.includes('Snijplanken') ? 'Cutting Boards' : 'Outdoor Kitchens')
          : cat;
        return (
          <div className="flex items-center gap-2 py-0.5">
            <img 
              src={logoSrc} 
              alt={cat} 
              className="h-6 max-w-[70px] object-contain mix-blend-multiply flex-shrink-0"
            />
            <span className="text-[10px] font-bold text-primary font-body bg-primary/10 px-2 py-0.5 rounded-md whitespace-nowrap">
              {displayCat}
            </span>
          </div>
        );
      }
    },
    { header: language === 'EN' ? 'Customer' : 'Klantnaam', accessor: 'customer' },
    { header: language === 'EN' ? 'Project' : 'Project', accessor: 'project' },
    { header: language === 'EN' ? 'Amount' : 'Bedrag', accessor: 'amount' },
    { 
      header: language === 'EN' ? 'Status' : 'Status', 
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {getTranslatedStatus(row.status)}
        </Badge>
      )
    },
    { header: language === 'EN' ? 'Date' : 'Datum', accessor: 'date' },
    {
      header: language === 'EN' ? 'Actions' : 'Acties',
      style: { minWidth: '420px', textAlign: 'right' },
      render: (row) => (
        <div className="flex items-center justify-end gap-1 sm:gap-1.5 max-w-full overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
          {row.status !== 'Geaccepteerd' && row.status !== 'Accepted' && (
            <button 
              onClick={() => handleConvertToProject(row)}
              className="px-2 py-1 sm:px-2.5 sm:py-1 bg-primary text-cream hover:bg-primary-dark rounded-lg text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-xs flex-shrink-0 cursor-pointer"
              title={language === 'EN' ? 'Accept & Convert to Project' : 'Accepteer & Omzetten naar Project'}
            >
              <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Project</span>
            </button>
          )}
          <button 
            onClick={() => setPdfPreviewQuote(row)}
            className="px-2 py-1 sm:px-2.5 sm:py-1 bg-[#EDE8DF] hover:bg-[#D6CFC2] text-primary rounded-lg text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
            title="Preview / Export PDF"
          >
            <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> PDF
          </button>
          <button 
            onClick={async () => {
              const publicUrl = `${window.location.origin}/offerte/${row.id}`;
              await copyTextToClipboard(publicUrl);
              setToastMsg(language === 'EN' ? `Public Offerte link copied: ${publicUrl}` : `Offerte link gekopieerd: ${publicUrl}`);
            }}
            className="px-2 py-1 sm:px-2.5 sm:py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
            title="Copy Public Digital Approval Link"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700" /> Link
          </button>
          <a
            href={`/offerte/${row.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 sm:p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Open Customer Online View"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button 
            onClick={() => handleDuplicateQuote(row)}
            className="px-2 py-1 sm:px-2.5 sm:py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
            title={language === 'EN' ? 'Duplicate Quote (Create copy)' : 'Offerte Kopiëren'}
          >
            <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-700" /> Copy
          </button>
          <button 
            onClick={() => handleOpenEditModal(row)}
            className="p-1 sm:p-1.5 text-dark/70 hover:text-dark hover:bg-dark/10 rounded-lg transition-colors inline-flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Edit Quote"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => handleDeleteQuote(row.id, row.customer)}
            className="p-1 sm:p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Delete Quote"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const hasActiveFilters = statusFilter !== 'All' || sortBy !== 'newest' || searchQuery !== '';

  return (
    <div className="space-y-6 text-[#4A4A43] font-body">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg border border-[#D6CFC2]/20 font-body text-xs"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'EN' ? 'Quotes & Proposals' : 'Offerte Beheer'}
          </h2>
          <p className="text-xs text-dark/70 mt-1 font-body">
            {language === 'EN' ? 'Create, track and manage commercial quotes and multi-item proposals.' : 'Beheer offertes, kortingen en zet offertes direct om in facturen.'}
          </p>
        </div>

        <Button icon={Plus} onClick={handleOpenAddModal}>
          {language === 'EN' ? '+ Create New Quote' : '+ Nieuwe Offerte'}
        </Button>
      </div>

      {/* Stats Counter Widgets — Ultra Compact Sleek Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <Card noPadding className="p-2.5 sm:p-3 border-l-4 border-l-primary">
          <div className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">{language === 'EN' ? 'Total Quotes' : 'Totaal Offertes'}</div>
          <div className="text-lg sm:text-xl font-bold text-primary mt-0.5 font-heading">{totalCount}</div>
        </Card>
        <Card noPadding className="p-2.5 sm:p-3 border-l-4 border-l-blue-500">
          <div className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">{language === 'EN' ? 'Draft / Concept' : 'Concept Offertes'}</div>
          <div className="text-lg sm:text-xl font-bold text-blue-600 mt-0.5 font-heading">{conceptCount}</div>
        </Card>
        <Card noPadding className="p-2.5 sm:p-3 border-l-4 border-l-amber-500">
          <div className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">{language === 'EN' ? 'Sent Quotes' : 'Verzonden Offertes'}</div>
          <div className="text-lg sm:text-xl font-bold text-amber-600 mt-0.5 font-heading">{sentCount}</div>
        </Card>
        <Card noPadding className="p-2.5 sm:p-3 border-l-4 border-l-green-500">
          <div className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">{language === 'EN' ? 'Accepted' : 'Geaccepteerd'}</div>
          <div className="text-lg sm:text-xl font-bold text-green-600 mt-0.5 font-heading">{acceptedCount}</div>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card>
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
              <input 
                type="text" 
                placeholder={language === 'EN' ? 'Search by customer, project or quote no...' : 'Zoek op klant, project of offerte nr...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-xl text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
              />
            </div>
            <Button 
              variant="outline" 
              icon={Filter} 
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="text-xs text-dark/75 border-[#D6CFC2]"
            >
              {language === 'EN' ? 'Filters' : 'Filters'}
            </Button>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                icon={RotateCcw} 
                onClick={handleResetFilters}
                className="text-xs text-dark/65"
              >
                {language === 'EN' ? 'Reset' : 'Herstellen'}
              </Button>
            )}
          </div>

          {/* Collapsible Filter Panel */}
          <AnimatePresence>
            {showFilterPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[#D6CFC2]/50 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-dark/60 mb-1.5 font-body uppercase tracking-wider">{language === 'EN' ? 'Status Filter' : 'Status Filter'}</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Concept', 'Verzonden', 'Gecoördineerd', 'Geaccepteerd', 'Afgewezen'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium font-body border transition-all duration-200 ${
                          statusFilter === status
                            ? 'bg-primary text-cream border-primary shadow-sm'
                            : 'bg-[#EDE8DF]/30 text-dark/70 border-[#D6CFC2] hover:bg-[#EDE8DF]/60'
                        }`}
                      >
                        {status === 'All' ? (language === 'EN' ? 'All' : 'Alle') : getTranslatedStatus(status)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark/60 mb-1.5 font-body uppercase tracking-wider">{language === 'EN' ? 'Sort By' : 'Sorteren op'}</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
                  >
                    <option value="newest">{language === 'EN' ? 'Date Created (Newest)' : 'Datum Aangemaakt (Nieuwste)'}</option>
                    <option value="oldest">{language === 'EN' ? 'Date Created (Oldest)' : 'Datum Aangemaakt (Oudste)'}</option>
                    <option value="amount-desc">{language === 'EN' ? 'Amount (Highest First)' : 'Bedrag (Hoogste eerst)'}</option>
                    <option value="amount-asc">{language === 'EN' ? 'Amount (Lowest First)' : 'Bedrag (Laagste eerst)'}</option>
                    <option value="customer-asc">{language === 'EN' ? 'Customer Name (A to Z)' : 'Klantnaam (A tot Z)'}</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Table columns={columns} data={processedQuotes} />
      </Card>

      {/* CREATE/EDIT MULTI-ITEM QUOTE BUILDER MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">
                  {selectedQuote 
                    ? (language === 'EN' ? 'Edit Quote' : 'Offerte Bewerken') 
                    : (language === 'EN' ? 'Create New Quote' : 'Nieuwe Offerte Maken')}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-dark/40 hover:bg-cream-dark/20 hover:text-dark transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Customer & Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark/60 mb-1 font-body uppercase tracking-wider">{language === 'EN' ? 'Customer' : 'Klant'}</label>
                    <select
                      value={customerSelect}
                      onChange={e => {
                        const val = e.target.value;
                        setCustomerSelect(val);
                        if (val !== 'Other') {
                          setForm(prev => ({ ...prev, customer: val }));
                        } else {
                          setForm(prev => ({ ...prev, customer: '' }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-body text-[#4A4A43] mb-2"
                    >
                      {leadsList.map((lead, idx) => (
                        <option key={idx} value={lead.name}>{lead.name} (Lead)</option>
                      ))}
                      <option value="Other">{language === 'EN' ? 'Custom Customer...' : 'Aangepaste Klant...'}</option>
                    </select>
                    {customerSelect === 'Other' && (
                      <input
                        type="text"
                        required
                        value={form.customer}
                        onChange={e => setForm(prev => ({ ...prev, customer: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-body text-[#4A4A43]"
                        placeholder={language === 'EN' ? 'Enter customer name...' : 'Klantnaam invullen...'}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark/60 mb-1 font-body uppercase tracking-wider">{language === 'EN' ? 'Project Type' : 'Project Type'}</label>
                    <select
                      value={projectSelect}
                      onChange={e => {
                        const val = e.target.value;
                        setProjectSelect(val);
                        if (val !== 'Other') {
                          setForm(prev => ({ ...prev, project: val }));
                        } else {
                          setForm(prev => ({ ...prev, project: '' }));
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-body text-[#4A4A43] mb-2"
                    >
                      <option value="Exclusieve Buitenkeuken">{language === 'EN' ? 'Bespoke Outdoor Kitchen' : 'Exclusieve Buitenkeuken'}</option>
                      <option value="Exclusieve Kliko-ombouw">{language === 'EN' ? 'Premium Bin Storage' : 'Exclusieve Kliko-ombouw'}</option>
                      <option value="Houten Pergola">{language === 'EN' ? 'Wooden Pergola' : 'Houten Pergola'}</option>
                      <option value="Tuinterras">{language === 'EN' ? 'Garden Terrace' : 'Tuinterras'}</option>
                      <option value="Other">{language === 'EN' ? 'Other...' : 'Anders...'}</option>
                    </select>
                    {projectSelect === 'Other' && (
                      <input
                        type="text"
                        required
                        value={form.project}
                        onChange={e => setForm(prev => ({ ...prev, project: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-body text-[#4A4A43]"
                        placeholder={language === 'EN' ? 'Custom project type...' : 'Aangepast project type...'}
                      />
                    )}
                  </div>
                </div>

                {/* Status & Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark/60 mb-1 font-body uppercase tracking-wider">{language === 'EN' ? 'Approval Status' : 'Goedkeuringsstatus'}</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-body text-[#4A4A43]"
                    >
                      <option value="Concept">{language === 'EN' ? 'Draft' : 'Concept'}</option>
                      <option value="Verzonden">{language === 'EN' ? 'Sent' : 'Verzonden'}</option>
                      <option value="Gecoördineerd">{language === 'EN' ? 'Coordinated' : 'Gecoördineerd'}</option>
                      <option value="Geaccepteerd">{language === 'EN' ? 'Accepted (Auto-generates Invoices & Project)' : 'Geaccepteerd (Auto-genereert Facturen & Project)'}</option>
                      <option value="Afgewezen">{language === 'EN' ? 'Rejected' : 'Afgewezen'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark/60 mb-1 font-body uppercase tracking-wider">{language === 'EN' ? 'Discount %' : 'Korting %'}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.discountPercent}
                      onChange={e => setForm(prev => ({ ...prev, discountPercent: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-body text-[#4A4A43]"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>

                {/* Multi-Item Line Pricing */}
                <div className="space-y-3 pt-2 border-t border-[#D6CFC2]">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <label className="text-xs font-bold text-primary font-body uppercase tracking-wider">{language === 'EN' ? 'Quote Items' : 'Offerte Artikelen'}</label>
                    
                    <div className="flex items-center gap-3">
                      {/* Product Library Selector Dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSelectFromLibrary(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="px-2.5 py-1 bg-white border border-[#D6CFC2] rounded-lg text-xs text-primary font-bold cursor-pointer hover:bg-cream-dark/20"
                      >
                        <option value="">🛒 {language === 'EN' ? '+ Add from Product Library' : '+ Product Bibliotheek'}</option>
                        {PRESET_PRODUCT_LIBRARY.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.description} (€ {prod.unitPrice.toLocaleString()})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> {language === 'EN' ? 'Add Custom Item' : 'Artikel Toevoegen'}
                      </button>
                    </div>
                  </div>

                  {form.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#F8F7F4] p-2.5 rounded-xl border border-[#D6CFC2]/60">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          placeholder={language === 'EN' ? 'Item description...' : 'Omschrijving artikel...'}
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body"
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder={language === 'EN' ? 'Qty' : 'Aantal'}
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-center"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          required
                          placeholder={language === 'EN' ? 'Price (€)' : 'Prijs (€)'}
                          value={item.unitPrice}
                          onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body text-right"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={form.items.length === 1}
                        className="text-red-500 hover:text-red-700 disabled:opacity-30 p-1"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Calculations Summary */}
                  <div className="p-3 bg-white/70 rounded-xl border border-[#D6CFC2]/60 text-xs space-y-1.5">
                    <div className="flex justify-between text-dark/70">
                      <span>{language === 'EN' ? 'Subtotal:' : 'Subtotaal:'}</span>
                      <span>€ {calculateSubtotal(form.items).toLocaleString()}</span>
                    </div>
                    {parseFloat(form.discountPercent) > 0 && (
                      <div className="flex justify-between text-red-600 font-semibold">
                        <span>{language === 'EN' ? `Discount (${form.discountPercent}%):` : `Korting (${form.discountPercent}%):`}</span>
                        <span>- € {(calculateSubtotal(form.items) * (parseFloat(form.discountPercent) / 100)).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-primary text-sm pt-1 border-t border-[#D6CFC2]/60">
                      <span>{language === 'EN' ? 'Total Amount (Incl. VAT):' : 'Totaalbedrag (Incl. BTW):'}</span>
                      <span>€ {calculateFinalTotal(form.items, form.discountPercent).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{language === 'EN' ? 'Cancel' : 'Annuleren'}</Button>
                  <Button type="submit">{selectedQuote ? (language === 'EN' ? 'Save Changes' : 'Offerte Opslaan') : (language === 'EN' ? 'Save Quote' : 'Offerte Opslaan')}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL 6-PAGE DUTCH BRANDED PDF PROPOSAL PREVIEW MODAL */}
      <AnimatePresence>
        {pdfPreviewQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-dark/75 backdrop-blur-xs" 
              onClick={() => setPdfPreviewQuote(null)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-3xl bg-white border border-[#D6CFC2] rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-6 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Top Control Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#D6CFC2] pb-3 print:hidden">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-primary truncate">
                      {language === 'EN' ? `Official 6-Page Proposal PDF (${pdfPreviewQuote.id})` : `Officiële 6-Pagina Offerte PDF (${pdfPreviewQuote.id})`}
                    </h3>
                    <p className="text-[11px] text-dark/50 font-body">Vanuit Ambacht • Custom Outdoor Craftsmen</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <Button size="sm" icon={Printer} onClick={() => window.print()} className="text-xs">
                    {language === 'EN' ? 'Print / Save PDF' : 'Afdrukken / Export PDF'}
                  </Button>
                  <button onClick={() => setPdfPreviewQuote(null)} className="p-1.5 text-dark/40 hover:text-dark rounded-lg hover:bg-dark/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 6-PAGE DOCUMENT CONTAINER */}
              <div className="space-y-8 bg-[#EBE6DD] p-3 sm:p-6 rounded-2xl border border-[#C4BEB3]">

                {/* ========================================================= */}
                {/* PAGE 1: BRANDED LUXURY FULL DARK GREEN COVER PAGE (#3E4E36) */}
                {/* ========================================================= */}
                <div className="bg-[#3E4E36] text-[#FDFBF7] rounded-xl shadow-2xl border border-[#2D3528] overflow-hidden p-6 sm:p-10 space-y-8 relative">
                  {/* Top Header */}
                  <div className="flex justify-between items-start border-b border-[#526648] pb-6">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#FDFBF7] tracking-wider">VANUIT AMBACHT</h1>
                      <p className="text-[11px] text-[#D6CFC2] font-mono tracking-widest uppercase mt-0.5">EXCLUSIEVE HOUTBOUW & BUITENKEUKENS</p>
                    </div>
                    <span className="text-xs font-mono font-bold border border-[#70624F] text-[#FDFBF7] bg-[#70624F]/30 px-3.5 py-1.5 rounded-full shadow-xs">
                      OFFERTE
                    </span>
                  </div>

                  {/* Main Title Section */}
                  <div className="space-y-3 py-4">
                    <span className="text-xs font-mono text-[#D6CFC2] tracking-wider uppercase block">
                      VOORKEUR OP MAAT — {pdfPreviewQuote.id || 'OF-2026325'}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FDFBF7] leading-tight">
                      Uw buitenkeuken, op maat gemaakt.
                    </h2>
                    <p className="text-xs text-[#D6CFC2] font-mono pt-2">
                      Thermo Fraké • 240 × 80 cm • uitsparing Big Green Egg Large
                    </p>
                  </div>

                  {/* Metadata Grid (4 Columns) */}
                  <div className="pt-6 border-t border-[#526648] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">OPDRACHTGEVER</span>
                      <span className="font-bold text-[#FDFBF7] text-sm">{pdfPreviewQuote.customer || 'Bjorn Valk'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">OFFERTENUMMER</span>
                      <span className="font-bold text-[#FDFBF7]">{pdfPreviewQuote.id || 'OF-2026325'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">DATUM</span>
                      <span className="font-bold text-[#FDFBF7]">{pdfPreviewQuote.date || '21 juli 2026'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">GELDIG TOT</span>
                      <span className="font-bold text-[#FDFBF7]">{pdfPreviewQuote.validUntil || '19 augustus 2026'}</span>
                    </div>
                  </div>

                  {/* 3 Horizontal Photo Strip */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <img src="/dasbordes images.png" alt="Buitenkeuken 1" className="h-28 sm:h-36 w-full object-cover rounded-lg border border-[#526648]" />
                    <img src={outdoorProjectCard} alt="Buitenkeuken 2" className="h-28 sm:h-36 w-full object-cover rounded-lg border border-[#526648]" />
                    <img src={outdoorLivingLogin} alt="Buitenkeuken 3" className="h-28 sm:h-36 w-full object-cover rounded-lg border border-[#526648]" />
                  </div>

                  {/* Footer Text */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#D6CFC2] pt-4 border-t border-[#526648]">
                    <span>Vanuit Ambacht B.V. • Keizersgracht 402</span>
                    <span>AMBACHT • KWALITEIT • ZEKERHEID</span>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* PAGE 2: PERSONAL LETTER & 4 USP CARDS (#FDFBF7)            */}
                {/* ========================================================= */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>VANUIT AMBACHT • OFFERTE SPECIFICATIE</span>
                    <span>Pagina 2 van 6</span>
                  </div>

                  {/* Intro Letter Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-2 space-y-3">
                      <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">01 - PERSOONLIJK WOORD</span>
                      <h3 className="text-xl font-serif font-bold text-primary">Beste {pdfPreviewQuote.customer || 'Bjorn'},</h3>
                      <p className="leading-relaxed text-dark/80">
                        Leuk dat we met je mee mogen nadenken over jouw buitenkeuken. In deze offerte vind je ons voorstel, volledig afgestemd op jouw wensen en jouw buitenruimte.
                      </p>
                      <p className="leading-relaxed text-dark/80">
                        Bij Vanuit Ambacht geloven we in echt ambachtelijk vakwerk. Elk meubel wordt met de hand gemaakt door vakmensen die het ambacht verstaan. Geen massaproductie, maar een zorgvuldig vervaardigd meubel met duurzame uitstraling en lange levensduur.
                      </p>
                      <p className="leading-relaxed text-dark/80">
                        Vragen, of wil je een aanpassing? App of bel ons gerust. Schakelen bij Vanuit Ambacht betekent rechtstreeks contact met een van ons beiden.
                      </p>
                      <div className="pt-2">
                        <p className="font-serif font-bold text-primary text-sm">Tim & Bram</p>
                        <p className="text-[10px] text-accent font-semibold font-mono">OPRICHTERS VANUIT AMBACHT</p>
                      </div>
                    </div>

                    {/* Founders Photo Card */}
                    <div className="p-3 bg-[#EDE8DF] rounded-xl border border-[#C4BEB3] space-y-2 text-center">
                      <img src={outdoorLivingLogin} alt="Tim & Bram" className="h-32 w-full object-cover rounded-lg border border-[#C4BEB3]" />
                      <p className="text-[10px] font-body text-dark/70 italic">
                        Tim & Bram, jouw vaste aanspreekpunt van eerste schets tot nazorg.
                      </p>
                    </div>
                  </div>

                  {/* 4 Cream USP Cards */}
                  <div className="pt-4 border-t border-[#C4BEB3]/60 space-y-3">
                    <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">02 - WAAROM VANUIT AMBACHT?</span>
                    <h4 className="text-base font-serif font-bold text-primary">Waar je op kunt rekenen</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                        <div>
                          <p className="font-bold text-primary text-xs">Gecertificeerde vakmanschap</p>
                          <p className="text-[11px] text-dark/70 mt-0.5">Kwalitatief hoogwaardig kwaliteitsmateriaal en ambachtelijk gemaakt door ervaren vakmensen.</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                        <div>
                          <p className="font-bold text-primary text-xs">Eén vast aanspreekpunt</p>
                          <p className="text-[11px] text-dark/70 mt-0.5">Rechtstreeks contact met Tim of Bram via WhatsApp, telefoon of e-mail voor al je vragen.</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                        <div>
                          <p className="font-bold text-primary text-xs">Garantie én nazorg</p>
                          <p className="text-[11px] text-dark/70 mt-0.5">Garantie op het product en de montage. Ook na de levering staan wij altijd voor je klaar.</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                        <div>
                          <p className="font-bold text-primary text-xs">Eerlijke prijs, bewust online</p>
                          <p className="text-[11px] text-dark/70 mt-0.5">Geen dure showroom en tussenpersonen. Zeer scherpe prijs voor vakwerk.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 2 van 6</div>
                </div>

                {/* ========================================================= */}
                {/* PAGE 3: UW CONFIGURATIE & 2D BLOCK DIAGRAM (#FDFBF7)       */}
                {/* ========================================================= */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>VANUIT AMBACHT • PRODUCT CONFIGURATIE</span>
                    <span>Pagina 3 van 6</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">03 - CONFIGURATIE</span>
                    <h3 className="text-xl font-serif font-bold text-primary">Jouw buitenkeuken in één oogopslag</h3>
                  </div>

                  {/* 4 Dark Green Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">AFMETING</span>
                      <p className="text-base font-bold font-mono">240 × 80 cm</p>
                      <span className="text-[9px] text-[#D6CFC2] block">Totale footprint</span>
                    </div>

                    <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">HOUTSOORT</span>
                      <p className="text-base font-bold font-mono">Thermo Fraké</p>
                      <span className="text-[9px] text-[#D6CFC2] block">Onderhoudsarm</span>
                    </div>

                    <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">UITSPARING</span>
                      <p className="text-base font-bold font-mono">Big Green Egg</p>
                      <span className="text-[9px] text-[#D6CFC2] block">Geschikt voor Large</span>
                    </div>

                    <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">LEVERTIJD</span>
                      <p className="text-base font-bold font-mono">3 tot 5 weken</p>
                      <span className="text-[9px] text-[#D6CFC2] block">Montage inbegrepen</span>
                    </div>
                  </div>

                  {/* Specs & 2D Front View Diagram */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left: Specs List */}
                    <div className="space-y-3 font-body">
                      <div>
                        <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">BOVENBLAD</p>
                        <p className="text-dark/80 text-[11px]">✓ Houten bovenblad met keramische tegels en uitsparing voor de Big Green Egg Large, rechts van het midden.</p>
                      </div>

                      <div>
                        <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">INDELING & OPBERGRUIMTE</p>
                        <p className="text-dark/80 text-[11px]">✓ Drie kastjes met deurtjes: links 1x klein kastje, uitsparing Big Green Egg, rechts 1x lang kastje.</p>
                      </div>

                      <div>
                        <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">AFWERKING & MOBILITEIT</p>
                        <p className="text-dark/80 text-[11px]">✓ Behandeld met olie. Wielen onder de benen voor optimale mobiliteit op het terras.</p>
                      </div>

                      <div>
                        <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">BEZORGING</p>
                        <p className="text-dark/80 text-[11px]">✓ Gratis bezorging en inhuizen op de gewenste plek in jouw tuin.</p>
                      </div>
                    </div>

                    {/* Right: 2D Diagram & Over Thermo Fraké */}
                    <div className="space-y-3">
                      <img src={outdoorProjectCard} alt="Render" className="h-32 w-full object-cover rounded-xl border border-[#C4BEB3]" />

                      {/* 2D Visual Block Diagram */}
                      <div className="p-3 bg-[#EDE8DF] rounded-xl border border-[#C4BEB3] text-center space-y-2">
                        <span className="text-[9px] font-mono uppercase font-bold text-accent">2D FRONT VIEW SCHEMA</span>
                        <div className="flex items-center justify-center gap-1.5 font-mono text-[9px]">
                          <div className="px-2 py-3 bg-white border border-dark/30 rounded font-bold text-dark">Kastje</div>
                          <div className="px-2 py-3 bg-white border border-dark/30 rounded font-bold text-dark">Kastje</div>
                          <div className="px-2 py-3 bg-[#3E4E36] text-white rounded font-bold">Big Green Egg</div>
                          <div className="px-2 py-3 bg-white border border-dark/30 rounded font-bold text-dark">Kastje</div>
                        </div>
                        <div className="text-[9px] font-mono text-dark/60 border-t border-dark/20 pt-1">
                          |&lt;------------------ 240 cm ------------------&gt;|
                        </div>
                      </div>

                      {/* Dark Green Box: Over Thermo Fraké */}
                      <div className="p-3.5 bg-[#3E4E36] text-[#FDFBF7] rounded-xl text-xs space-y-1 shadow-sm">
                        <p className="font-serif font-bold text-[#FDFBF7] text-xs">Over Thermo Fraké</p>
                        <p className="text-[10px] text-[#D6CFC2] leading-relaxed">
                          Thermisch gemodificeerd hout is duurzaam, vormvast en bestand tegen alle weersinvloeden. Het hout verkleurt mooi en heeft een levensduur van meer dan 20 jaar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 3 van 6</div>
                </div>

                {/* ========================================================= */}
                {/* PAGE 4: DETAILED PRICING & PAYMENT TERMS (#FDFBF7)         */}
                {/* ========================================================= */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>VANUIT AMBACHT • FINANCIEEL OVERZICHT</span>
                    <span>Pagina 4 van 6</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">04 - INVESTERING</span>
                    <h3 className="text-xl font-serif font-bold text-primary">Heldere prijs, alles inbegrepen</h3>
                  </div>

                  {/* Line Items Table */}
                  <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-[#C4BEB3]">
                    <thead>
                      <tr className="bg-[#3E4E36] text-[#FDFBF7] text-[10px] font-mono uppercase tracking-wider font-bold">
                        <th className="py-3 px-4">Omschrijving</th>
                        <th className="py-3 px-2 text-center">Aantal</th>
                        <th className="py-3 px-4 text-right">Bedrag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C4BEB3]/50 bg-white">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-dark text-xs">
                          Buitenkeuken Thermo Fraké - 240 × 80 cm
                          <span className="block text-[10px] font-normal text-dark/60 mt-0.5">Houten bovenblad met keramische tegels, uitsparing Big Green Egg Large, drie kastjes.</span>
                        </td>
                        <td className="py-3.5 px-2 text-center font-mono font-bold">1</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-primary text-sm whitespace-nowrap">€ 3.495,00</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-dark text-xs">
                          Bezorging inhuizen
                          <span className="block text-[10px] font-normal text-dark/60 mt-0.5">Levering op de gewenste plek in jouw tuin.</span>
                        </td>
                        <td className="py-3.5 px-2 text-center font-mono font-bold">1</td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">Inbegrepen</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 2 Bottom Columns: Left Included Box & Right Dark Green Totals Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    {/* Left Box: Included Checklist */}
                    <div className="p-4 bg-[#EDE8DF]/70 rounded-xl border border-[#C4BEB3] space-y-2">
                      <p className="font-mono text-[10px] uppercase font-bold text-accent tracking-wider">INBEGREPEN BIJ JOUW INVESTERING</p>
                      <ul className="space-y-1.5 text-[11px] text-dark/80">
                        <li className="flex items-center gap-2">✓ Volledig maatwerk, met de hand gemaakt</li>
                        <li className="flex items-center gap-2">✓ Digitale maattekening vóór productie</li>
                        <li className="flex items-center gap-2">✓ Oliebehandeling (naturel)</li>
                        <li className="flex items-center gap-2">✓ Gratis bezorging en inhuizen</li>
                        <li className="flex items-center gap-2">✓ Garantie op het product en montage</li>
                      </ul>
                    </div>

                    {/* Right Box: Dark Green Totals Box (#3E4E36) */}
                    <div className="p-5 bg-[#3E4E36] text-[#FDFBF7] rounded-xl space-y-3 flex flex-col justify-between shadow-md">
                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between text-[#D6CFC2]"><span>Totaal excl. btw</span><span>€ 2.888,43</span></div>
                        <div className="flex justify-between text-[#D6CFC2]"><span>Btw 21%</span><span>€ 606,57</span></div>
                        <div className="flex justify-between text-base font-bold text-[#FDFBF7] pt-2 border-t border-[#526648]">
                          <span>Totaal incl. btw</span>
                          <span className="text-lg text-white font-mono">€ 3.495,00</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-[#EDE8DF] text-primary text-[10px] font-mono rounded-lg font-bold text-center">
                        Deze offerte is geldig tot en met 19 augustus 2026
                      </div>
                    </div>
                  </div>

                  {/* Payment Terms Cards (50% / 50%) */}
                  <div className="pt-2 space-y-2">
                    <p className="font-mono text-[10px] uppercase font-bold text-accent tracking-wider">BETAALTERMIJNEN IN TWEE STAPPEN</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body">
                      <div className="p-3.5 bg-white rounded-xl border border-[#C4BEB3] flex items-center gap-3">
                        <span className="text-xl font-bold font-mono text-primary">50%</span>
                        <div>
                          <p className="font-bold text-dark text-xs">Bij akkoord € 1.747,50</p>
                          <p className="text-[10px] text-dark/60 mt-0.5">Hiermee reserveren we de productie direct.</p>
                        </div>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-[#C4BEB3] flex items-center gap-3">
                        <span className="text-xl font-bold font-mono text-primary">50%</span>
                        <div>
                          <p className="font-bold text-dark text-xs">Bij levering € 1.747,50</p>
                          <p className="text-[10px] text-dark/60 mt-0.5">Het restant betaal je pas wanneer de keuken staat.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 4 van 6</div>
                </div>

                {/* ========================================================= */}
                {/* PAGE 5: PROCESS TIMELINE & GUARANTEES (#FDFBF7)            */}
                {/* ========================================================= */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>VANUIT AMBACHT • WERKWIJZE</span>
                    <span>Pagina 5 van 6</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">05 - VAN AKKOORD TOT OPLEVERING</span>
                    <h3 className="text-xl font-serif font-bold text-primary">Zo werkt het in vijf stappen</h3>
                  </div>

                  {/* 5 Vertical Process Steps */}
                  <div className="space-y-3 relative pl-2">
                    {[
                      { step: '1', title: 'Akkoord op de offerte', desc: 'Bevestig eenvoudig per mail of WhatsApp, of onderteken de akkoordpagina. Vanaf dat moment nemen wij alles uit handen.' },
                      { step: '2', title: 'Digitale tekening ter bevestiging', desc: 'Je ontvangt een maattekening van jouw buitenkeuken. Zo weet je precies wat je krijgt en klopt al het werk vóór de productie start.' },
                      { step: '3', title: 'Productie door onze vakspecialisten', badge: '3 TOT 5 WEKEN', desc: 'Jouw keuken wordt met de hand gemaakt door onze vakspecialisten. Tussentijds houden we je op de hoogte.' },
                      { step: '4', title: 'Bezorging inhuizen', badge: 'GRATIS', desc: 'We leveren de buitenkeuken op het moment dat jou uitkomt. Isdein de tuin op de juiste plek.' },
                      { step: '5', title: 'Garantie & nazorg', desc: 'Ook na de oplevering blijven we je vaste aanspreekpunt. Met garantie op het product en advies over onderhoud.' }
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-full bg-[#3E4E36] text-[#FDFBF7] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                          {s.step}
                        </div>
                        <div className="flex-1 bg-[#EDE8DF]/50 p-3 rounded-xl border border-[#C4BEB3]/60">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-primary text-xs">{s.title}</p>
                            {s.badge && <span className="bg-[#70624F] text-[#FDFBF7] text-[9px] font-mono font-bold px-2 py-0.5 rounded">{s.badge}</span>}
                          </div>
                          <p className="text-[11px] text-dark/75 mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Founders Quote Box */}
                  <div className="p-4 bg-[#EDE8DF] border border-[#C4BEB3] rounded-xl text-center space-y-1 italic font-serif">
                    <p className="text-sm font-bold text-primary">"Geen massa. Geen tussenoplossing. Gewoon goed gemaakt. Voor jou."</p>
                    <p className="text-[10px] font-mono text-accent font-semibold not-italic">Tim & Bram - Vanuit Ambacht</p>
                  </div>

                  {/* 2 Policy Guarantee Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-white rounded-xl border border-[#C4BEB3] space-y-1">
                      <p className="font-bold text-primary text-xs">Wijzigingen vóór productie</p>
                      <p className="text-[10px] text-dark/70">Kleine korreltjes aanpassen? Tot het akkoord op de tekening verwerken we wijzigingen kosteloos in de opgestelde offerte.</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#C4BEB3] space-y-1">
                      <p className="font-bold text-primary text-xs">Meerwerk en minderwerk</p>
                      <p className="text-[10px] text-dark/70">Aanpassingen na akkoord stemmen we altijd samen af met heldere prijsopgave. Geen verrassingen achteraf.</p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 5 van 6</div>
                </div>

                {/* ========================================================= */}
                {/* PAGE 6: APPROVAL & SIGNATURES (#FDFBF7)                    */}
                {/* ========================================================= */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>VANUIT AMBACHT • AKKOORD</span>
                    <span>Pagina 6 van 6</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">06 - AKKOORD</span>
                    <h3 className="text-xl font-serif font-bold text-primary">Zullen we hem gaan maken?</h3>
                  </div>

                  {/* Top Dark Green CTA Box (#3E4E36) */}
                  <div className="p-5 bg-[#3E4E36] text-[#FDFBF7] rounded-xl space-y-3 shadow-md">
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#FDFBF7]">Akkoord geven kan in één minuut</h4>
                      <p className="text-xs text-[#D6CFC2] mt-0.5">Stuur een korte bevestiging per WhatsApp of mail, of onderteken hieronder. Daarna ontvang je binnen enkele dagen de digitale maattekening ter bevestiging en gaan we voor je aan de slag.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a href="https://wa.me/31682008005" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-[#70624F] hover:bg-[#5e5241] text-[#FDFBF7] text-xs font-mono font-bold rounded-lg transition-colors inline-flex items-center gap-1.5">
                        💬 WhatsApp - 06 82 00 80 05
                      </a>
                      <a href="mailto:info@vanuitambacht.nl" className="px-3.5 py-1.5 bg-[#70624F] hover:bg-[#5e5241] text-[#FDFBF7] text-xs font-mono font-bold rounded-lg transition-colors inline-flex items-center gap-1.5">
                        ✉️ info@vanuitambacht.nl
                      </a>
                    </div>
                  </div>

                  {/* 2 Physical Signature Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#EDE8DF]/70 rounded-xl border border-[#C4BEB3] space-y-4">
                      <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider block">VOOR AKKOORD - OPDRACHTGEVER</span>
                      <p className="font-bold text-primary text-sm">{pdfPreviewQuote.customer || 'Bjorn Valk'}</p>
                      <div className="space-y-3 pt-2 text-[10px] font-mono text-dark/60">
                        <div className="border-b border-dark/40 pb-1">Datum: {pdfPreviewQuote.date || '21 juli 2026'}</div>
                        <div className="border-b border-dark/40 pb-4">Handtekening:</div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#EDE8DF]/70 rounded-xl border border-[#C4BEB3] space-y-4">
                      <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider block">NAMENS VANUIT AMBACHT</span>
                      <p className="font-bold text-primary text-sm">Tim & Bram</p>
                      <div className="space-y-3 pt-2 text-[10px] font-mono text-dark/60">
                        <div className="border-b border-dark/40 pb-1">Datum: {pdfPreviewQuote.date || '21 juli 2026'}</div>
                        <div className="border-b border-dark/40 pb-4">Handtekening:</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-dark/50 italic text-center">
                    Door deze offerte digitaal te ondertekenen gaat u akkoord met het ontwerp en de prijsopbouw. Deze offerte is geldig tot en met 19 augustus 2026.
                  </p>

                  {/* Footer Company Details Grid (3 Columns) */}
                  <div className="pt-4 border-t border-[#C4BEB3] grid grid-cols-3 gap-4 text-[10px] font-mono text-dark/70">
                    <div>
                      <span className="font-bold uppercase text-primary block">ADRES</span>
                      Vanuit Ambacht B.V.<br />
                      Keizersgracht 402<br />
                      1016 GC Amsterdam
                    </div>
                    <div>
                      <span className="font-bold uppercase text-primary block">CONTACT</span>
                      06 82 00 80 05<br />
                      info@vanuitambacht.nl<br />
                      vanuitambacht.nl
                    </div>
                    <div>
                      <span className="font-bold uppercase text-primary block">GEGEVENS</span>
                      KvK 93067429<br />
                      BTW NL866264863B01<br />
                      IBAN NL48 INGB 0001 2345 67
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-1">Pagina 6 van 6</div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
