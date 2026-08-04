import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, X, Check, CheckCircle, Trash2, Edit2, RotateCcw, FileText, Download, Printer, PlusCircle, MinusCircle, Briefcase } from 'lucide-react';
import { mockQuotes as defaultQuotes } from '../../utils/mockData';
import { useLanguage } from '../../context/LanguageContext';

// Helper to get raw numeric value from formatted amount string (e.g. "€ 12,500" -> 12500)
const getNumericAmount = (amtStr) => {
  if (!amtStr) return 0;
  const val = parseFloat(String(amtStr).replace(/[^\d.-]/g, ''));
  return isNaN(val) ? 0 : val;
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
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Quote "${id}" for "${customer}" deleted successfully!`);
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
      // Adding Mode
      const newQuote = {
        id: `Q-${quotes.length + 4001}`,
        customer: finalCustomer,
        project: finalProject,
        amount: formattedAmount,
        discountPercent: parseFloat(form.discountPercent) || 0,
        status: form.status,
        items: form.items,
        date: new Date().toISOString().split('T')[0]
      };
      updatedQuotes = [newQuote, ...quotes];
      showToast(`Quote for "${finalCustomer}" created successfully!`);

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
      render: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {row.status !== 'Geaccepteerd' && row.status !== 'Accepted' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleConvertToProject(row)}
              className="text-xs text-primary border-primary/40 hover:bg-primary hover:text-cream py-1 px-2 font-bold"
              title={language === 'EN' ? 'Accept & Convert to Project' : 'Accepteer & Omzetten naar Project'}
            >
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              {language === 'EN' ? 'Make Project' : 'Maak Project'}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setPdfPreviewQuote(row)}
            className="text-dark/70 hover:bg-[#D6CFC2]/40"
            title="Preview / Export PDF"
          >
            <Printer className="w-3.5 h-3.5 mr-1" /> PDF
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleOpenEditModal(row)}
            className="text-dark/70 hover:bg-[#D6CFC2]/40"
            title="Edit Quote"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteQuote(row.id, row.customer)}
            className="text-red-600 hover:bg-red-50"
            title="Delete Quote"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
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

      {/* Stats Counter Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <div className="text-xs font-semibold text-dark/60 uppercase tracking-wider">{language === 'EN' ? 'Total Quotes' : 'Totaal Offertes'}</div>
          <div className="text-2xl font-bold text-primary mt-1 font-heading">{totalCount}</div>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <div className="text-xs font-semibold text-dark/60 uppercase tracking-wider">{language === 'EN' ? 'Draft / Concept' : 'Concept Offertes'}</div>
          <div className="text-2xl font-bold text-blue-600 mt-1 font-heading">{conceptCount}</div>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <div className="text-xs font-semibold text-dark/60 uppercase tracking-wider">{language === 'EN' ? 'Sent to Client' : 'Verzonden Offertes'}</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-heading">{sentCount}</div>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <div className="text-xs font-semibold text-dark/60 uppercase tracking-wider">{language === 'EN' ? 'Accepted & Active' : 'Geaccepteerd'}</div>
          <div className="text-2xl font-bold text-green-600 mt-1 font-heading">{acceptedCount}</div>
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
                className="w-full pl-9 pr-4 py-2 bg-[#EDE8DF]/30 border border-[#D6CFC2] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
              />
            </div>
            <Button 
              variant={showFilterPanel ? 'primary' : 'outline'} 
              icon={Filter} 
              onClick={() => setShowFilterPanel(!showFilterPanel)}
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
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-primary font-body uppercase tracking-wider">{language === 'EN' ? 'Quote Items' : 'Offerte Artikelen'}</label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> {language === 'EN' ? 'Add Item' : 'Artikel Toevoegen'}
                    </button>
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

                {/* PAGE 1: BRANDED LUXURY COVER */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] overflow-hidden p-6 sm:p-8 space-y-6 relative">
                  <div className="flex justify-between items-start border-b border-[#C4BEB3]/60 pb-4">
                    <div>
                      <h1 className="text-2xl font-heading font-bold text-primary tracking-wide">VANUIT AMBACHT</h1>
                      <p className="text-xs text-accent font-mono font-semibold">Exclusieve Houtbouw & Buitenkeukens</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold bg-primary text-cream px-3 py-1 rounded-md shadow-xs">{pdfPreviewQuote.id}</span>
                      <p className="text-[11px] text-dark/60 font-mono mt-1">Datum: {pdfPreviewQuote.date}</p>
                    </div>
                  </div>

                  <div className="relative h-52 rounded-xl overflow-hidden shadow-md border border-[#C4BEB3]/60">
                    <img src="/dasbordes images.png" alt="Vanuit Ambacht Project" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <span className="bg-[#70624F] text-[#FDFBF7] text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-xs inline-block">
                        Officieel Maatwerk Voorstel
                      </span>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mt-1.5 drop-shadow-md">
                        {pdfPreviewQuote.project}
                      </h2>
                    </div>
                  </div>

                  <div className="bg-[#EDE8DF] p-4 rounded-xl border border-[#C4BEB3]/60 grid grid-cols-2 gap-4 text-xs font-body">
                    <div>
                      <span className="text-[10px] text-accent uppercase font-bold tracking-wider block">Opdrachtgever (Client)</span>
                      <span className="font-bold text-primary text-sm">{pdfPreviewQuote.customer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-accent uppercase font-bold tracking-wider block">Product Categorie</span>
                      <span className="font-bold text-dark">{pdfPreviewQuote.category || 'Buitenkeukens'}</span>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-dark/50 font-mono font-semibold">Pagina 1 van 6</div>
                </div>

                {/* PAGE 2: PERSONAL INTRO LETTER */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-4 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>VANUIT AMBACHT • OFFERTE SPECIFICATIE</span>
                    <span>Pagina 2 van 6</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-primary">Persoonlijke Introductie & Welkom</h3>
                  <p>Beste <strong>{pdfPreviewQuote.customer}</strong>,</p>
                  <p className="leading-relaxed text-dark/80">
                    Hartelijk dank voor uw interesse in onze ambachtelijke buitenkeukens en exclusieve houtbouw projecten.
                    Met deze offerte bieden wij u een gedetailleerd overzicht van het ontwerp, de hoogwaardige materialen en de kosten op maat.
                  </p>
                  <p className="leading-relaxed text-dark/80">
                    Bij Vanuit Ambacht werken wij uitsluitend met massief teak en thermowood van topkwaliteit, gecombineerd met gezaagd graniet en RVS inbouwapparatuur. Elk meubel wordt met de hand vervaardigd door onze ervaren vakmensen.
                  </p>
                  <div className="pt-4 border-t border-[#C4BEB3]/60 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-primary">Met vriendelijke groet,</p>
                      <p className="font-heading font-bold text-dark text-base mt-0.5">Tim & Bram</p>
                      <p className="text-[10px] text-accent font-semibold">Oprichters Vanuit Ambacht</p>
                    </div>
                    <div className="px-4 py-2 bg-[#EDE8DF] rounded-lg border border-[#C4BEB3]/60 font-serif text-primary text-sm font-bold italic">
                      Tim & Bram
                    </div>
                  </div>
                </div>

                {/* PAGE 3: PRODUCT SPECS & VISUAL CONFIGURATION */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-4 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>PRODUCT CONFIGURATIE & MATERIALEN</span>
                    <span>Pagina 3 van 6</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-primary">Product Specificaties</h3>
                  <div className="grid grid-cols-2 gap-3.5 bg-[#EDE8DF]/70 p-4 rounded-xl border border-[#C4BEB3]/60 text-xs">
                    <div>
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Frame Materiaal</span>
                      <span className="font-bold text-primary text-xs">Massief Teak Hout (FSC)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Werkblad</span>
                      <span className="font-bold text-primary text-xs">Zwart Polijst Beton Cire (8cm)</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Afmetingen</span>
                      <span className="font-bold text-primary text-xs">350cm (L) x 90cm (B) x 95cm (H)</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Inbouwopties</span>
                      <span className="font-bold text-primary text-xs">Kamado BBQ + RVS Spoelbak</span>
                    </div>
                  </div>
                </div>

                {/* PAGE 4: DETAILED ITEMIZED COST BREAKDOWN */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-4 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>PRIJSOPBOUW & FINANCIEEL OVERZICHT</span>
                    <span>Pagina 4 van 6</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-primary">Gedetailleerde Specificatie & Kosten</h3>

                  <table className="w-full text-left border-collapse overflow-hidden rounded-lg border border-[#C4BEB3]/60">
                    <thead>
                      <tr className="bg-primary text-cream text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-3">Omschrijving</th>
                        <th className="py-2.5 text-center px-2">Aantal</th>
                        <th className="py-2.5 text-right px-3">Prijs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C4BEB3]/40 bg-white">
                      {pdfPreviewQuote.items && pdfPreviewQuote.items.length > 0 ? (
                        pdfPreviewQuote.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-3 px-3 font-semibold text-dark text-xs">{item.description}</td>
                            <td className="py-3 text-center px-2">{item.quantity}</td>
                            <td className="py-3 text-right px-3 font-mono text-xs font-bold text-primary whitespace-nowrap">€ {(item.unitPrice * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-3 px-3 font-semibold text-dark text-xs">{pdfPreviewQuote.project} Specs & Delivery</td>
                          <td className="py-3 text-center px-2">1</td>
                          <td className="py-3 text-right px-3 font-mono text-xs font-bold text-primary whitespace-nowrap">{pdfPreviewQuote.amount}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div className="pt-3 border-t border-[#C4BEB3] flex justify-between items-center bg-[#EDE8DF] p-3 rounded-xl font-bold">
                    <span className="text-accent text-xs">Totaalbedrag (Inclusief 21% BTW):</span>
                    <span className="text-base font-mono text-primary font-bold">{pdfPreviewQuote.amount}</span>
                  </div>
                </div>

                {/* PAGE 5: ALGEMENE VOORWAARDEN (TERMS & CONDITIONS) */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-3 text-[11px] font-body text-dark/80">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>ALGEMENE VOORWAARDEN</span>
                    <span>Pagina 5 van 6</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-primary">Voorwaarden & Garantie</h3>
                  <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                    <li><strong>Aanbetaling:</strong> Bij akkoord geldt een aanbetaling van 50% om materialen te reserveren.</li>
                    <li><strong>Garantie:</strong> 10 jaar garantie op de houtconstructie en 5 jaar op betonbladen.</li>
                    <li><strong>Levertijd:</strong> Na goedkeuring en aanbetaling is de geschatte levertijd 4 tot 6 weken.</li>
                    <li><strong>Montage:</strong> Montage op locatie is inbegrepen mits de tuin goed toegankelijk is.</li>
                  </ol>
                </div>

                {/* PAGE 6: DIGITAL SIGNATURE & ACCEPTANCE */}
                <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-4 text-xs font-body text-dark">
                  <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
                    <span>DIGITAAL AKKOORD & HANDTEKENING</span>
                    <span>Pagina 6 van 6</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-primary">Akkoord & Ondertekening</h3>
                  <p className="text-dark/80">Door deze offerte digitaal te ondertekenen gaat u akkoord met het ontwerp en de prijsopbouw.</p>
                  
                  <div className="p-4 bg-[#EDE8DF] border border-[#C4BEB3] rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Handtekening Klant</span>
                      <span className="font-bold text-primary text-sm">{pdfPreviewQuote.customer}</span>
                    </div>
                    <Button size="sm" icon={Check} onClick={() => { setToastMsg(language === 'EN' ? 'Quote digitally approved & signed!' : 'Offerte digitaal akkoord bevonden!'); setPdfPreviewQuote(null); }}>
                      {language === 'EN' ? 'Approve Quote Digitally' : 'Digitaal Akkoord Geven'}
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
