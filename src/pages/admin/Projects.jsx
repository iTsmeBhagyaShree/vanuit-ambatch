import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, Trash2, Edit2, X, CheckCircle, RotateCcw, Compass, MapPin, Calendar, UserCheck, Layers, FileText, CheckSquare, Sparkles, Truck, ShoppingBag, Download } from 'lucide-react';
import { mockProjects, mockLeads, mockPartners } from '../../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { tValue } from '../../utils/translator';

export default function Projects() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [partnersList, setPartnersList] = useState([]);
  
  // Search & Filters State
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Toast & Modal State
  const [toastMsg, setToastMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [blueprintModalProject, setBlueprintModalProject] = useState(null); // Project object for technical blueprint modal
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Select values for dropdown bindings
  const [customerSelect, setCustomerSelect] = useState('Other');
  const [partnerSelect, setPartnerSelect] = useState('Unassigned');

  // Form State
  const [form, setForm] = useState({
    name: '',
    customer: '',
    partner: 'Unassigned',
    progress: 0,
    deadline: '',
    status: 'Pending'
  });

  // Load initial data & listen for dynamic quote-to-project conversions
  useEffect(() => {
    const loadProjectsData = () => {
      const savedProjects = localStorage.getItem('app_projects');
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed);
          else setProjects(mockProjects);
        } catch(e) { setProjects(mockProjects); }
      } else {
        setProjects(mockProjects);
        localStorage.setItem('app_projects', JSON.stringify(mockProjects));
      }
    };

    loadProjectsData();
    window.addEventListener('storage', loadProjectsData);
    window.addEventListener('app_data_changed', loadProjectsData);

    // Leads (for customer selection dropdown)
    const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
    if (savedLeads) {
      try {
        const parsed = JSON.parse(savedLeads);
        if (Array.isArray(parsed) && parsed.length > 0) setLeadsList(parsed);
        else setLeadsList(mockLeads);
      } catch(e) { setLeadsList(mockLeads); }
    } else {
      setLeadsList(mockLeads);
    }

    // Partners (for assignment dropdown)
    const savedPartners = localStorage.getItem('app_partners_v2') || localStorage.getItem('app_partners');
    if (savedPartners) {
      try {
        const parsed = JSON.parse(savedPartners);
        if (Array.isArray(parsed) && parsed.length > 0) setPartnersList(parsed);
        else setPartnersList(mockPartners);
      } catch(e) { setPartnersList(mockPartners); }
    } else {
      setPartnersList(mockPartners);
    }

    return () => {
      window.removeEventListener('storage', loadProjectsData);
      window.removeEventListener('app_data_changed', loadProjectsData);
    };
  }, [modalOpen]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Quick inline partner re-assignment in table
  const handleInlinePartnerChange = (projectId, newPartner) => {
    const updatedProjects = projects.map(p => p.id === projectId ? { ...p, partner: newPartner } : p);
    setProjects(updatedProjects);
    localStorage.setItem('app_projects', JSON.stringify(updatedProjects));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Partner updated to "${newPartner}" for project ${projectId}!`);
  };

  // Quick inline status update for Kliko Order
  const handleOrderStatusChange = (projectId, newStatus) => {
    const updatedProjects = projects.map(p => p.id === projectId ? { ...p, orderStatus: newStatus } : p);
    setProjects(updatedProjects);
    localStorage.setItem('app_projects', JSON.stringify(updatedProjects));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Order status update: "${newStatus}"!`);
  };

  // Quick inline progress update
  const handleProgressUpdate = (projectId, newProgress) => {
    const pVal = Math.min(100, Math.max(0, parseInt(newProgress) || 0));
    const newStatus = pVal === 100 ? 'Completed' : pVal > 0 ? 'In Progress' : 'Pending';
    const updatedProjects = projects.map(p => p.id === projectId ? { ...p, progress: pVal, status: newStatus } : p);
    setProjects(updatedProjects);
    localStorage.setItem('app_projects', JSON.stringify(updatedProjects));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Progress updated to ${pVal}%!`);
  };

  const handleOpenAddModal = () => {
    setSelectedProject(null);

    // Dynamic fresh reload of leads & partners for modal
    let freshLeads = leadsList;
    const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
    if (savedLeads) {
      try { freshLeads = JSON.parse(savedLeads); setLeadsList(freshLeads); } catch(e){}
    }

    let freshPartners = partnersList;
    const savedPartners = localStorage.getItem('app_partners_v2') || localStorage.getItem('app_partners');
    if (savedPartners) {
      try { freshPartners = JSON.parse(savedPartners); setPartnersList(freshPartners); } catch(e){}
    }

    const defaultCust = freshLeads[0]?.name || 'Other';
    const defaultPart = freshPartners[0]?.name || 'Unassigned';

    setForm({
      name: '',
      customer: defaultCust === 'Other' ? '' : defaultCust,
      partner: defaultPart,
      progress: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending'
    });
    setCustomerSelect(defaultCust);
    setPartnerSelect(defaultPart);
    setModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setSelectedProject(proj);
    
    const hasMatchingLead = leadsList.some(l => l.name === proj.customer);
    setCustomerSelect(hasMatchingLead ? proj.customer : 'Other');

    const hasMatchingPartner = partnersList.some(p => p.name === proj.partner) || proj.partner === 'Unassigned';
    setPartnerSelect(hasMatchingPartner ? proj.partner : 'Unassigned');

    setForm({
      name: proj.name,
      customer: proj.customer,
      partner: proj.partner,
      progress: proj.progress,
      deadline: proj.deadline,
      status: proj.status
    });
    setModalOpen(true);
  };

  const handleDeleteProject = (id, name) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('app_projects', JSON.stringify(updated));
    showToast(`Project "${name}" deleted successfully.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalCustomer = customerSelect === 'Other' ? form.customer : customerSelect;
    const finalPartner = partnerSelect;

    if (!form.name.trim() || !finalCustomer.trim()) {
      showToast("Please enter valid Project and Customer names.");
      return;
    }

    let updatedList = [];
    if (selectedProject) {
      // Edit mode
      updatedList = projects.map(p => {
        if (p.id === selectedProject.id) {
          return {
            ...p,
            name: form.name,
            customer: finalCustomer,
            partner: finalPartner,
            progress: parseInt(form.progress) || 0,
            deadline: form.deadline,
            status: form.status
          };
        }
        return p;
      });
      showToast(`Project "${form.name}" updated successfully!`);
    } else {
      // Add mode
      const newProj = {
        id: `P-${projects.length + 2001}`,
        name: form.name,
        customer: finalCustomer,
        partner: finalPartner,
        progress: parseInt(form.progress) || 0,
        deadline: form.deadline,
        status: form.status
      };
      updatedList = [newProj, ...projects];
      showToast(`Project "${form.name}" created successfully!`);
    }

    setProjects(updatedList);
    localStorage.setItem('app_projects', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('app_data_changed'));
    setModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setSortBy('deadline');
  };

  // Filter & Search logic
  const filteredProjects = [...projects]
    .filter(p => {
      // Kliko Orders Tab Filter
      if (activeTab === 'Kliko Orders') {
        const cat = p.category || ((p.name || '').toLowerCase().includes('kliko') || (p.name || '').toLowerCase().includes('rotterdam') ? 'Kliko-ombouw' : '');
        if (!cat.includes('Kliko')) return false;
      }

      const nameMatch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const custMatch = (p.customer || '').toLowerCase().includes(searchQuery.toLowerCase());
      const partMatch = (p.partner || '').toLowerCase().includes(searchQuery.toLowerCase());
      const idMatch = (p.id || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSearch = nameMatch || custMatch || partMatch || idMatch;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline || 0) - new Date(b.deadline || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'progress-desc') return (b.progress || 0) - (a.progress || 0);
      if (sortBy === 'progress-asc') return (a.progress || 0) - (b.progress || 0);
      return 0;
    });

  // Dynamic columns: Hide partner assignment column for Kliko Orders & use Webshop order statuses
  const translateProjectName = (name) => {
    if (language !== 'EN' || !name) return name;
    return name
      .replace(/Luxe Teak Buitenkeuken 4m/g, 'Luxury Teak Outdoor Kitchen 4m')
      .replace(/Kliko Ombouw Triple Antraciet/g, 'Triple Bin Storage Anthracite')
      .replace(/Eiken Houten Overkapping 6x4m/g, 'Oak Wooden Canopy 6x4m')
      .replace(/Buitenkeuken/g, 'Outdoor Kitchen')
      .replace(/Kliko Ombouw/g, 'Bin Storage')
      .replace(/Overkapping/g, 'Canopy');
  };

  const translateCategory = (cat) => {
    if (language !== 'EN' || !cat) return cat;
    return cat
      .replace(/Buitenkeukens/g, 'Outdoor Kitchens')
      .replace(/Kliko-ombouw/g, 'Bin Storage')
      .replace(/Overkappingen/g, 'Canopies')
      .replace(/Snijplanken/g, 'Cutting Boards');
  };

  const mainColumns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Category Division',
      style: { minWidth: '220px' },
      render: (row) => {
        const projName = (row.name || '').toLowerCase();
        const cat = row.category || (projName.includes('kliko') || projName.includes('rotterdam') ? 'Kliko-ombouw' : projName.includes('snijplanken') || projName.includes('utrecht') ? 'Snijplanken' : 'Buitenkeukens');
        const logoSrc = cat.includes('Kliko')
          ? '/logo_kliko.png'
          : cat.includes('Snijplanken')
          ? '/logo_snijplanken.png'
          : '/logo_buitenkeukens.png';
        return (
          <div className="flex items-center gap-2 py-0.5">
            <img 
              src={logoSrc} 
              alt={cat} 
              className="h-6 max-w-[70px] object-contain mix-blend-multiply flex-shrink-0"
            />
            <span className="text-[10px] font-bold text-primary font-body bg-primary/10 px-2 py-0.5 rounded-md whitespace-nowrap">
              {translateCategory(cat)}
            </span>
          </div>
        );
      }
    },
    { 
      header: 'Project Name', 
      render: (row) => (
        <button
          onClick={() => setBlueprintModalProject(row)}
          className="font-bold text-primary hover:underline text-left text-xs"
          title="Click to view technical blueprint modal"
        >
          {translateProjectName(row.name)}
        </button>
      )
    },
    { header: 'Customer', accessor: 'customer' },
    { 
      header: 'Assigned Partner', 
      style: { minWidth: '180px' },
      render: (row) => (
        <select
          value={row.partner}
          onChange={(e) => handleInlinePartnerChange(row.id, e.target.value)}
          className="w-full px-2.5 py-1 bg-white border border-[#D6CFC2] rounded-lg text-xs font-body font-semibold text-dark/80 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
        >
          <option value="Unassigned">{language === 'EN' ? 'Unassigned' : 'Niet toegewezen'}</option>
          {partnersList.map((p, idx) => (
            <option key={idx} value={p.name}>{p.name} ({p.company})</option>
          ))}
        </select>
      )
    },
    { 
      header: 'Progress', 
      style: { minWidth: '160px' },
      render: (row) => (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={row.progress || 0}
            onChange={(e) => handleProgressUpdate(row.id, e.target.value)}
            className="w-20 accent-primary cursor-pointer h-1.5 bg-[#EDE8DF] rounded-lg"
            title="Drag to update progress %"
          />
          <span className="text-[10px] font-bold text-primary font-mono w-8">{row.progress || 0}%</span>
        </div>
      )
    },
    { header: 'Deadline', accessor: 'deadline' },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={row.status === 'Completed' || row.status === 'Afgerond' ? 'success' : row.status === 'In Progress' || row.status === 'In uitvoering' ? 'primary' : 'warning'}>
          {tValue(row.status, language)}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setBlueprintModalProject(row)}
            className="text-primary hover:bg-[#D6CFC2]/40"
            title="Open Technical Blueprint"
          >
            <Compass className="w-3.5 h-3.5 mr-1" /> Blueprint
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleOpenEditModal(row)}
            className="text-dark/70 hover:bg-[#D6CFC2]/40"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
          <Button 
            variant="custom" 
            size="sm" 
            onClick={() => handleDeleteProject(row.id, row.name)}
            className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  const orderColumns = [
    { header: 'Order ID', accessor: 'id' },
    { 
      header: language === 'EN' ? 'Product Division' : 'Product Categorie',
      style: { minWidth: '180px' },
      render: (row) => {
        const nameLower = (row.name || '').toLowerCase();
        const isKliko = nameLower.includes('kliko') || nameLower.includes('bin');
        const logoSrc = isKliko ? '/logo_kliko.png' : '/logo_buitenkeukens.png';
        const label = language === 'EN' ? (isKliko ? 'Bin Storage' : 'Outdoor Kitchens') : (isKliko ? 'Kliko-ombouw' : 'Buitenkeukens');
        return (
          <div className="flex items-center gap-2 py-0.5">
            <img src={logoSrc} alt={label} className="h-6 max-w-[70px] object-contain mix-blend-multiply flex-shrink-0" />
            <span className="text-[10px] font-bold text-primary font-body bg-primary/10 px-2 py-0.5 rounded-md">{label}</span>
          </div>
        );
      }
    },
    { 
      header: language === 'EN' ? 'Webshop Item' : 'Webshop Artikel', 
      render: (row) => <span className="font-bold text-dark text-xs">{translateProjectName(row.name)}</span>
    },
    { header: language === 'EN' ? 'Customer' : 'Klant', accessor: 'customer' },
    { 
      header: language === 'EN' ? 'Webshop Status' : 'Webshop Status', 
      style: { minWidth: '180px' },
      render: (row) => {
        const orderSt = row.orderStatus || (row.status === 'Completed' ? 'Afgerond' : row.status === 'In Progress' ? 'Verzonden' : 'Nieuw');
        return (
          <select
            value={orderSt}
            onChange={(e) => handleOrderStatusChange(row.id, e.target.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-body cursor-pointer border ${
              orderSt === 'Afgerond' ? 'bg-green-100 text-green-800 border-green-300' : orderSt === 'Verzonden' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            <option value="Nieuw">🆕 {language === 'EN' ? 'New Order' : 'Nieuw'}</option>
            <option value="Verzonden">🚚 {language === 'EN' ? 'Shipped' : 'Verzonden'}</option>
            <option value="Afgerond">✅ {language === 'EN' ? 'Completed' : 'Afgerond'}</option>
          </select>
        );
      }
    },
    { header: language === 'EN' ? 'Expected Delivery' : 'Verwachte Levering', accessor: 'deadline' },
    {
      header: language === 'EN' ? 'Actions' : 'Acties',
      render: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setBlueprintModalProject(row)}
            className="text-primary hover:bg-[#D6CFC2]/40"
            title="Specs"
          >
            <Compass className="w-3.5 h-3.5 mr-1" /> Specs
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleOpenEditModal(row)}
            className="text-dark/70 hover:bg-[#D6CFC2]/40"
            title="Edit Project"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDeleteProject(row.id, row.name)}
            className="text-red-600 hover:bg-red-50"
            title="Delete Project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  const columns = activeTab === 'projects' ? mainColumns : orderColumns;
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || sortBy !== 'deadline';

  // Real Branded Printable PDF Document & Save to PDF trigger
  const handleDownloadBlueprintPdf = (project) => {
    if (!project) return;
    const fileName = `BLU-${project.id || '2001'}-SPEC.pdf`;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast(`Pop-up geblokkeerd! Download: ${fileName}`);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #4A4A43; background: #fff; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 3px solid #3E4E36; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { color: #3E4E36; font-size: 26px; font-weight: bold; margin: 0; font-family: 'Georgia', serif; }
            .subtitle { color: #70624F; font-size: 13px; font-weight: 600; margin-top: 4px; }
            .badge { background: #3E4E36; color: #EDE8DF; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-family: monospace; font-weight: bold; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
            .card { background: #F8F7F4; padding: 15px; border-radius: 10px; border: 1px solid #D6CFC2; }
            .label { font-size: 10px; text-transform: uppercase; color: #70624F; font-weight: bold; letter-spacing: 0.5px; }
            .value { font-size: 15px; font-weight: bold; margin-top: 4px; color: #3E4E36; }
            .spec-section { background: #F8F7F4; padding: 20px; border-radius: 10px; border: 1px solid #D6CFC2; margin-bottom: 25px; }
            .spec-title { font-size: 14px; font-weight: bold; color: #3E4E36; border-bottom: 1px solid #D6CFC2; padding-bottom: 8px; margin-bottom: 12px; text-transform: uppercase; }
            .spec-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #D6CFC2; font-size: 13px; }
            .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #D6CFC2; font-size: 11px; color: #888; text-align: center; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand">VANUIT AMBACHT</h1>
              <div class="subtitle">TECHNICAL BLUEPRINT & CONSTRUCTION SPECIFICATION</div>
            </div>
            <div>
              <span class="badge">${project.id || 'PRJ-2001'}</span>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 20px; color: #3E4E36; margin: 0 0 5px 0;">${project.name}</h2>
            <p style="margin: 0; color: #666; font-size: 13px;">Officiële CAD Constructietekening & Productie Specificaties</p>
          </div>

          <div class="grid">
            <div class="card">
              <div class="label">Klantnaam (Customer)</div>
              <div class="value">${project.customer || 'Onbekend'}</div>
            </div>
            <div class="card">
              <div class="label">Toegewezen Vakman (Craftsman)</div>
              <div class="value">${project.partner || 'Niet toegewezen'}</div>
            </div>
            <div class="card">
              <div class="label">Target Opleverdeadline</div>
              <div class="value">${project.deadline || '2026-08-30'}</div>
            </div>
            <div class="card">
              <div class="label">Voortgang Status</div>
              <div class="value">${project.progress || 0}% Compleet</div>
            </div>
          </div>

          <div class="spec-section">
            <div class="spec-title">Technische Materialen & Constructie Details</div>
            <div class="spec-row">
              <span style="font-weight: 600;">Afmetingen (Dimensions):</span>
              <span style="font-family: monospace; font-weight: bold; color: #3E4E36;">${project.dimensions || '350cm x 90cm x 95cm'}</span>
            </div>
            <div class="spec-row">
              <span style="font-weight: 600;">Hout Frame Materiaal:</span>
              <span>${project.frameMaterial || 'Massief Teak Hout (FSC Certificaat)'}</span>
            </div>
            <div class="spec-row">
              <span style="font-weight: 600;">Aanrechtblad Afwerking:</span>
              <span>${project.topMaterial || 'Polijst Beton (Dark Grey)'}</span>
            </div>
            <div class="spec-row" style="border-bottom: none;">
              <span style="font-weight: 600;">Opleverlocatie:</span>
              <span>${project.deliveryAddress || 'Keizersgracht 420, Amsterdam'}</span>
            </div>
          </div>

          <div class="footer">
            Generated officially by Vanuit Ambacht Cloud Management System • ${new Date().toLocaleDateString('nl-NL')}
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast(`Blueprint PDF geopend voor afdrukken/download: ${fileName}`);
  };

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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'EN' ? 'Projects & Installation Management' : 'Projecten & Kliko-ombouw'}
          </h2>
          <p className="text-xs text-dark/70 mt-1 font-body">
            {language === 'EN' ? 'Manage active installations, partner assignments, and technical blueprints.' : 'Beheer actieve installaties, koppel vakmannen en bekijk bouwtekeningen.'}
          </p>
        </div>

        <Button icon={Plus} onClick={handleOpenAddModal}>
          {language === 'EN' ? '+ New Project' : '+ Nieuw Project'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#D6CFC2] pb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-all ${
            activeTab === 'projects'
              ? 'bg-primary text-cream shadow-sm'
              : 'bg-[#EDE8DF]/40 text-dark/70 hover:bg-[#EDE8DF]'
          }`}
        >
          {language === 'EN' ? 'All Projects (All Installations)' : 'Alle Projecten (Buitenkeukens & Verblijven)'}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-body transition-all ${
            activeTab === 'orders'
              ? 'bg-primary text-cream shadow-sm'
              : 'bg-[#EDE8DF]/40 text-dark/70 hover:bg-[#EDE8DF]'
          }`}
        >
          <span>📦</span> {language === 'EN' ? 'Kliko Webshop Orders' : 'Kliko Webshop Bestellingen'}
        </button>
      </div>

      {/* Main Content Area */}
      <Card>
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
              <input
                type="text"
                placeholder={language === 'EN' ? 'Search by project, customer or order ID...' : 'Zoek op project, klant of order ID...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#EDE8DF]/30 border border-[#D6CFC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showFilterPanel ? 'primary' : 'outline'} 
                icon={Filter} 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                size="sm"
              >
                {language === 'EN' ? 'Filters' : 'Filters'}
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  icon={RotateCcw} 
                  onClick={handleResetFilters}
                  size="sm"
                  className="text-xs text-dark/65"
                >
                  {language === 'EN' ? 'Reset' : 'Herstellen'}
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilterPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[#D6CFC2]/50 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-dark/60 mb-1.5 uppercase tracking-wider">{language === 'EN' ? 'Status Filter' : 'Status Filter'}</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          statusFilter === st
                            ? 'bg-primary text-cream border-primary shadow-sm'
                            : 'bg-[#EDE8DF]/30 text-dark/70 border-[#D6CFC2] hover:bg-[#EDE8DF]/60'
                        }`}
                      >
                        {st === 'All' ? (language === 'EN' ? 'All' : 'Alle') : st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark/60 mb-1.5 uppercase tracking-wider">{language === 'EN' ? 'Sort By' : 'Sorteren op'}</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs focus:outline-none"
                  >
                    <option value="deadline">{language === 'EN' ? 'Deadline (Earliest)' : 'Deadline (Eerst)'}</option>
                    <option value="name">{language === 'EN' ? 'Project Name (A-Z)' : 'Projectnaam (A-Z)'}</option>
                    <option value="progress-desc">{language === 'EN' ? 'Progress (Highest)' : 'Voortgang (Hoogste)'}</option>
                    <option value="progress-asc">{language === 'EN' ? 'Progress (Lowest)' : 'Voortgang (Laagste)'}</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Table columns={columns} data={filteredProjects} />
      </Card>

      {/* PROJECT DETAIL TECHNICAL BLUEPRINT POPUP MODAL */}
      <AnimatePresence>
        {blueprintModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-xs" onClick={() => setBlueprintModalProject(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">Technical Blueprint Spec</span>
                    <Badge variant="primary">{blueprintModalProject.id}</Badge>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary mt-1">{blueprintModalProject.name}</h3>
                </div>
                <button onClick={() => setBlueprintModalProject(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              {/* TECHNICAL SPECIFICATIONS & BLUEPRINT DETAILS */}
              <div className="space-y-4 text-xs font-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-[#D6CFC2]">
                    <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Customer' : 'Klantnaam (Customer)'}</span>
                    <span className="font-bold text-dark text-sm">{blueprintModalProject.customer || 'Onbekend'}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#D6CFC2]">
                    <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Assigned Craftsman' : 'Toegewezen Vakman'}</span>
                    <span className="font-bold text-primary text-sm">{blueprintModalProject.partner || 'Niet toegewezen'}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#D6CFC2]">
                    <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Target Deadline' : 'Target Opleverdeadline'}</span>
                    <span className="font-bold text-dark text-sm flex items-center gap-1 mt-0.5"><Calendar className="w-3.5 h-3.5 text-accent" /> {blueprintModalProject.deadline || '2026-08-15'}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#D6CFC2]">
                    <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Completion Progress' : 'Voortgang Status'}</span>
                    <span className="font-bold text-primary text-sm">{blueprintModalProject.progress || 0}% {language === 'EN' ? 'Completed' : 'Compleet'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#D6CFC2] space-y-2.5">
                  <h4 className="font-bold text-primary uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-accent" /> {language === 'EN' ? 'Technical Materials & Dimensions' : 'Technische Materialen & Afmetingen'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-dark/50 font-semibold block text-[10px]">{language === 'EN' ? 'Dimensions:' : 'Afmetingen:'}</span>
                      <span className="font-mono font-bold text-dark">{blueprintModalProject.dimensions || '350cm x 90cm x 95cm'}</span>
                    </div>
                    <div>
                      <span className="text-dark/50 font-semibold block text-[10px]">{language === 'EN' ? 'Frame Material:' : 'Hout Frame:'}</span>
                      <span className="font-semibold text-dark">{blueprintModalProject.frameMaterial || 'Massief Teak Hout (FSC Certificaat)'}</span>
                    </div>
                    <div>
                      <span className="text-dark/50 font-semibold block text-[10px]">{language === 'EN' ? 'Countertop Material:' : 'Aanrechtblad:'}</span>
                      <span className="font-semibold text-dark">{blueprintModalProject.topMaterial || 'Polijst Beton (Dark Grey)'}</span>
                    </div>
                    <div>
                      <span className="text-dark/50 font-semibold block text-[10px]">{language === 'EN' ? 'Delivery Address:' : 'Opleverlocatie:'}</span>
                      <span className="font-semibold text-dark flex items-center gap-1"><MapPin className="w-3 h-3 text-primary flex-shrink-0" /> {blueprintModalProject.deliveryAddress || 'Keizersgracht 420, Amsterdam'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-bold text-dark text-xs block">BLU-{blueprintModalProject.id || '2001'}-SPEC.pdf</span>
                      <span className="text-[10px] text-dark/50">CAD Blueprint & Constructie Tekening (2.4 MB)</span>
                    </div>
                  </div>
                  <Button size="sm" icon={Download} onClick={() => handleDownloadBlueprintPdf(blueprintModalProject)}>
                    Download PDF
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#D6CFC2]/60">
                <Button variant="outline" onClick={() => setBlueprintModalProject(null)}>{language === 'EN' ? 'Close Blueprint' : 'Sluiten Blueprint'}</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT FORM MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">
                  {selectedProject 
                    ? (language === 'EN' ? 'Edit Project Details' : 'Project Details Bewerken') 
                    : (language === 'EN' ? 'Create New Project' : 'Nieuw Project Aanmaken')}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Project Name' : 'Projectnaam'}</label>
                  <input type="text" required value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="e.g. Luxury Outdoor Kitchen" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Customer Name' : 'Klantnaam'}</label>
                    <select value={customerSelect} onChange={e => { setCustomerSelect(e.target.value); if(e.target.value !== 'Other') setForm(prev => ({ ...prev, customer: e.target.value })); }} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg">
                      {leadsList.map((l, idx) => (
                        <option key={idx} value={l.name}>{l.name}</option>
                      ))}
                      <option value="Other">{language === 'EN' ? 'Custom Customer...' : 'Aangepaste Klant...'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Assigned Craftsman' : 'Partner Vakman'}</label>
                    <select value={partnerSelect} onChange={e => setPartnerSelect(e.target.value)} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg">
                      <option value="Unassigned">{language === 'EN' ? 'Unassigned' : 'Niet toegewezen'}</option>
                      {partnersList.map((p, idx) => (
                        <option key={idx} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Progress (%)' : 'Voortgang (%)'}</label>
                    <input type="number" min="0" max="100" value={form.progress} onChange={e => setForm(prev => ({ ...prev, progress: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-bold text-primary" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'EN' ? 'Target Deadline' : 'Target Deadline'}</label>
                    <input type="date" value={form.deadline} onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{language === 'EN' ? 'Cancel' : 'Annuleren'}</Button>
                  <Button type="submit">{selectedProject ? (language === 'EN' ? 'Save Changes' : 'Wijzigingen Opslaan') : (language === 'EN' ? 'Save Project' : 'Project Opslaan')}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
