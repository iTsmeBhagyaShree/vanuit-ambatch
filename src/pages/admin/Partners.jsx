import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, Edit2, Trash2, X, CheckCircle, RotateCcw, MapPin, Wrench, Briefcase, FileText, Phone, Mail, MessageCircle, ChevronRight, User, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { mockPartners } from '../../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function Partners() {
  const { t, language, tStatus } = useLanguage();
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' | 'Pipeline'
  const [partners, setPartners] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Modal State
  const [toastMsg, setToastMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalPartner, setDetailModalPartner] = useState(null); // Partner Detail Screen Modal
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Prospective Pipeline Candidates State
  const [pipelineCandidates, setPipelineCandidates] = useState([
    { id: 'PIPE-101', name: 'Mark van Dijk', company: 'Van Dijk Houtbouw', phone: '+31 6 12399887', email: 'mark@vandijk.nl', region: 'Utrecht', productTypes: ['Buitenkeukens', 'Pergolas'], stage: 'Geïnteresseerd', notes: 'Eerste telefonische kennismaking gehad.' },
    { id: 'PIPE-102', name: 'Sander Koster', company: 'Koster Maatwerk', phone: '+31 6 55449911', email: 'sander@koster.nl', region: 'Zuid-Holland', productTypes: ['Kliko-ombouw', 'Snijplanken'], stage: 'In gesprek', notes: 'Afspraak gepland op werkplaats in Rotterdam.' },
    { id: 'PIPE-103', name: 'Frank de Boer', company: 'De Boer Keukens', phone: '+31 6 88776655', email: 'frank@deboer.nl', region: 'Noord-Holland', productTypes: ['Buitenkeukens'], stage: 'Proefproject', notes: 'Gestart met proefproject P-2003.' }
  ]);

  // Form State for Add/Edit
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    region: 'Noord-Holland',
    productTypes: 'Buitenkeukens, Kliko-ombouw',
    workload: 'Beschikbaar',
    status: 'Active'
  });

  // Default Enriched Partners Mock Data
  const defaultEnrichedPartners = mockPartners;

  // Load Data
  useEffect(() => {
    try {
      const savedPartners = localStorage.getItem('app_partners_v3') || localStorage.getItem('app_partners_v2');
      if (savedPartners) {
        const parsed = JSON.parse(savedPartners);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          const safePartners = parsed.map(p => ({
            ...p,
            region: p.region || 'Noord-Holland',
            productTypes: Array.isArray(p.productTypes) ? p.productTypes : ['Buitenkeukens'],
            workload: p.workload || 'Beschikbaar',
            invoices: Array.isArray(p.invoices) ? p.invoices : []
          }));
          setPartners(safePartners);
          return;
        }
      }
    } catch (e) {}

    setPartners(defaultEnrichedPartners);
    localStorage.setItem('app_partners_v3', JSON.stringify(defaultEnrichedPartners));
    localStorage.setItem('app_partners_v2', JSON.stringify(defaultEnrichedPartners));
    localStorage.setItem('app_partners', JSON.stringify(defaultEnrichedPartners));

    const savedProjects = localStorage.getItem('app_projects');
    if (savedProjects) {
      try { setProjectsList(JSON.parse(savedProjects)); } catch(e){}
    }
  }, [modalOpen]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenAddModal = () => {
    setSelectedPartner(null);
    setForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      region: 'Noord-Holland',
      productTypes: 'Buitenkeukens, Kliko-ombouw',
      workload: 'Beschikbaar',
      status: 'Active'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (partner) => {
    setSelectedPartner(partner);
    setForm({
      name: partner.name,
      company: partner.company,
      email: partner.email,
      phone: partner.phone,
      region: partner.region || 'Noord-Holland',
      productTypes: Array.isArray(partner.productTypes) ? partner.productTypes.join(', ') : 'Buitenkeukens',
      workload: partner.workload || 'Beschikbaar',
      status: partner.status
    });
    setModalOpen(true);
  };

  const handleDeletePartner = (id, name) => {
    const updated = partners.filter(p => p.id !== id);
    setPartners(updated);
    localStorage.setItem('app_partners_v2', JSON.stringify(updated));
    showToast(`Partner "${name}" verwijderd.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      showToast("Vul een geldige naam en e-mail in.");
      return;
    }

    const typesArr = form.productTypes.split(',').map(s => s.trim()).filter(Boolean);

    let updatedList = [];
    if (selectedPartner) {
      updatedList = partners.map(p => {
        if (p.id === selectedPartner.id) {
          return {
            ...p,
            name: form.name,
            company: form.company,
            email: form.email,
            phone: form.phone,
            region: form.region,
            productTypes: typesArr,
            workload: form.workload,
            status: form.status
          };
        }
        return p;
      });
      showToast(`Partner "${form.name}" geüpdatet!`);
    } else {
      const newPartner = {
        id: `PT-${partners.length + 3001}`,
        name: form.name,
        company: form.company || '-',
        email: form.email,
        phone: form.phone || '-',
        region: form.region,
        productTypes: typesArr,
        workload: form.workload,
        status: form.status,
        invoices: [],
        notes: 'Nieuw toegevoegde partner.'
      };
      updatedList = [newPartner, ...partners];
      showToast(`Nieuwe partner "${form.name}" toegevoegd!`);
    }

    setPartners(updatedList);
    localStorage.setItem('app_partners_v2', JSON.stringify(updatedList));
    setModalOpen(false);
  };

  // Move candidate to next stage in Prospective Pipeline
  const handleAdvancePipelineStage = (candId) => {
    const stagesOrder = ['Geïnteresseerd', 'In gesprek', 'Proefproject', 'Actief'];
    setPipelineCandidates(prev => prev.map(cand => {
      if (cand.id === candId) {
        const currentIdx = stagesOrder.indexOf(cand.stage);
        const nextStage = stagesOrder[Math.min(stagesOrder.length - 1, currentIdx + 1)];
        return { ...cand, stage: nextStage };
      }
      return cand;
    }));
    showToast('Kandidaat doorgeschoven naar volgende fase!');
  };

  const getAssignedProjectsCount = (partnerName) => {
    return projectsList.filter(proj => (proj.partner || '').toLowerCase() === partnerName.toLowerCase()).length;
  };

  const getWorkloadBadge = (workload) => {
    switch (workload) {
      case 'Beschikbaar':
        return <Badge variant="success">{language === 'EN' ? '🟢 Available' : '🟢 Beschikbaar'}</Badge>;
      case 'Druk':
        return <Badge variant="warning">{language === 'EN' ? '🟡 Busy' : '🟡 Druk'}</Badge>;
      case 'Volgeboekt':
        return <Badge variant="danger">{language === 'EN' ? '🔴 Fully booked' : '🔴 Volgeboekt'}</Badge>;
      default:
        return <Badge variant="default">{workload || (language === 'EN' ? 'Available' : 'Beschikbaar')}</Badge>;
    }
  };

  // Filter Active Partners
  const filteredPartners = [...partners].filter(partner => {
    const matchesSearch = 
      (partner.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.region || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const isPartnerActive = (partner.status === 'Actief' || partner.status === 'Active');
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' ? isPartnerActive : !isPartnerActive);
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      header: t('partners.partnerCompany') || 'Partner / Company',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
            {row.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <button
              onClick={() => setDetailModalPartner(row)}
              className="font-semibold text-primary hover:underline leading-tight text-left text-xs"
            >
              {row.name}
            </button>
            <p className="text-[10px] text-dark/50">{row.company}</p>
          </div>
        </div>
      )
    },
    { header: t('partners.regionLocation') || 'Region / Location', accessor: 'region' },
    { 
      header: t('partners.productSpecialism') || 'Product Specialism', 
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.productTypes) && row.productTypes.map((type, i) => (
            <span key={i} className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
              {type}
            </span>
          ))}
        </div>
      )
    },
    { 
      header: t('partners.activeProjects') || 'Active Projects', 
      render: (row) => (
        <span className="font-body font-bold text-primary">
          {getAssignedProjectsCount(row.name)} {language === 'EN' ? 'projects' : 'projecten'}
        </span>
      )
    },
    {
      header: t('partners.workloadIndicator') || 'Workload Indicator',
      render: (row) => getWorkloadBadge(row.workload)
    },
    {
      header: t('common.status') || 'Status',
      render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'default'}>{tStatus(row.status)}</Badge>
    },
    {
      header: t('common.actions') || 'Actions',
      render: (row) => (
        <div className="flex gap-1.5 whitespace-nowrap">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDetailModalPartner(row)}
            className="text-primary hover:bg-[#D6CFC2]/40"
            title={language === 'EN' ? 'View Profile & Invoices' : 'Bekijk Profiel & Facturen'}
          >
            <User className="w-3.5 h-3.5 mr-1" /> {language === 'EN' ? 'Profile' : 'Profiel'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleOpenEditModal(row)}
            className="text-dark/70 hover:bg-[#D6CFC2]/40"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" /> {t('common.edit') || 'Edit'}
          </Button>
          <Button 
            variant="custom" 
            size="sm" 
            onClick={() => handleDeletePartner(row.id, row.name)}
            className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 relative font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'EN' ? 'Partners Module' : 'Partners Module'}
          </h2>
          <p className="text-dark/60 text-sm">
            {language === 'EN' ? 'Manage active craftspeople and the recruitment pipeline for new partners.' : 'Beheer actieve ambachtelijke vakmannen en de sollicitatiepijplijn voor nieuwe partners.'}
          </p>
        </div>
        <Button 
          size="sm"
          icon={Plus} 
          onClick={handleOpenAddModal}
          className="py-1.5 px-3 text-xs font-bold whitespace-nowrap"
        >
          {language === 'EN' ? 'Add New Partner' : 'Nieuwe Partner'}
        </Button>
      </div>

      {/* Tabs Switcher: Active Partners vs Prospective Pipeline Kanban */}
      <div className="flex gap-2 border-b border-[#D6CFC2] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('Active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-2 ${
            activeTab === 'Active'
              ? 'bg-primary text-cream shadow-sm'
              : 'bg-white/80 text-dark/70 hover:bg-[#EDE8DF]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> {language === 'EN' ? 'Active Partners List' : 'Actieve Partners Lijst'}
        </button>
        <button
          onClick={() => setActiveTab('Pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-2 ${
            activeTab === 'Pipeline'
              ? 'bg-primary text-cream shadow-sm'
              : 'bg-white/80 text-dark/70 hover:bg-[#EDE8DF]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> {language === 'EN' ? 'Prospective Partner Pipeline (Kanban)' : 'Potentiële Partner Pijplijn (Kanban)'}
        </button>
      </div>

      {/* TAB 1: ACTIVE PARTNERS VIEW */}
      {activeTab === 'Active' && (
        <div className="space-y-6">
          {/* Top Partner Summary Cards — Sleek & Compact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {filteredPartners.slice(0, 3).map(partner => (
              <Card key={partner.id} noPadding className="p-3.5 hover:shadow-md transition-all border-l-4 border-l-primary flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-xs flex-shrink-0">
                        {partner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading font-bold text-dark text-sm truncate leading-tight">{partner.name}</h3>
                        <p className="text-[10px] text-dark/50 font-mono truncate">{partner.company || partner.region}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getWorkloadBadge(partner.workload)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-dark/60 pt-1">
                    <span className="flex items-center gap-1 font-medium"><MapPin className="w-3 h-3 text-accent flex-shrink-0" /> {partner.region}</span>
                    <span className="font-bold text-primary">{getAssignedProjectsCount(partner.name)} {language === 'EN' ? 'active' : 'actief'}</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#D6CFC2]/50 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-dark/40">{partner.id}</span>
                  <button onClick={() => setDetailModalPartner(partner)} className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                    {language === 'EN' ? 'View Profile →' : 'Bekijk Profiel →'}
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="mb-6 flex flex-col sm:flex-row justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                <input
                  type="text"
                  placeholder={t('partners.searchPlaceholder') || 'Search by partner name, region or specialty...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#EDE8DF]/30 border border-[#D6CFC2] rounded-lg text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                {['All', 'Active', 'Inactive'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      statusFilter === st ? 'bg-primary text-cream border-primary' : 'bg-[#EDE8DF]/30 text-dark/70 border-[#D6CFC2]'
                    }`}
                  >
                    {st === 'All' ? (t('common.all') || 'All') : st === 'Active' ? (t('common.active') || 'Active') : (t('common.inactive') || 'Inactive')}
                  </button>
                ))}
              </div>
            </div>

            <Table columns={columns} data={filteredPartners} />
          </Card>
        </div>
      )}

      {/* TAB 2: PROSPECTIVE PARTNER KANBAN PIPELINE BOARD */}
      {activeTab === 'Pipeline' && (
        <div className="space-y-4 font-body">
          <div className="bg-[#EDE8DF]/50 p-4 rounded-xl border border-[#D6CFC2] flex justify-between items-center text-xs">
            <div>
              <h3 className="font-heading font-bold text-primary text-sm">Prospective Partner Recruitment Pipeline</h3>
              <p className="text-dark/60">Volg nieuwe vakman-sollicitaties van eerste interesse tot actief proefproject.</p>
            </div>
            <Badge variant="info">4 Fasen Pipeline</Badge>
          </div>

          {/* 4-Stage Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 'Geïnteresseerd', title: '🟡 1. Geïnteresseerd', color: 'border-amber-300 bg-amber-50/40' },
              { id: 'In gesprek', title: '🔵 2. In Gesprek', color: 'border-blue-300 bg-blue-50/40' },
              { id: 'Proefproject', title: '🟣 3. Proefproject', color: 'border-purple-300 bg-purple-50/40' },
              { id: 'Actief', title: '🟢 4. Actief Partner', color: 'border-green-300 bg-green-50/40' }
            ].map(col => {
              const cands = pipelineCandidates.filter(c => c.stage === col.id);
              return (
                <div key={col.id} className={`p-2.5 rounded-xl border-2 ${col.color} space-y-2.5 h-fit`}>
                  <div className="flex justify-between items-center pb-2 border-b border-[#D6CFC2]/60">
                    <h4 className="font-heading font-bold text-xs text-primary">{col.title}</h4>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#D6CFC2]">{cands.length}</span>
                  </div>

                  {cands.map(cand => (
                    <Card key={cand.id} noPadding className="p-2.5 bg-white space-y-1.5 border border-[#D6CFC2] shadow-xs text-xs rounded-xl">
                      <div className="flex justify-between items-start gap-1">
                        <div className="min-w-0">
                          <h5 className="font-bold text-dark text-xs truncate leading-tight">{cand.name}</h5>
                          <p className="text-[10px] text-primary font-bold truncate">{cand.company}</p>
                        </div>
                        <span className="text-[9px] font-mono font-bold bg-[#EDE8DF] text-primary px-1.5 py-0.5 rounded-md flex-shrink-0">{cand.region}</span>
                      </div>

                      <div className="text-[10px] text-dark/70 space-y-0.5 pt-1 border-t border-[#D6CFC2]/40">
                        <p className="flex items-center gap-1 truncate"><Phone className="w-3 h-3 text-primary flex-shrink-0" /> {cand.phone}</p>
                        <p className="flex items-center gap-1 truncate"><Mail className="w-3 h-3 text-primary flex-shrink-0" /> {cand.email}</p>
                      </div>

                      <div className="bg-[#F8F7F4] p-1.5 rounded-md border border-[#D6CFC2]/50 text-[10px] italic text-dark/70 truncate">
                        "{cand.notes}"
                      </div>

                      {col.id !== 'Actief' && (
                        <button
                          onClick={() => handleAdvancePipelineStage(cand.id)}
                          className="w-full mt-1 py-1.5 bg-primary text-cream hover:bg-primary/90 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                        >
                          Volgende Fase <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </Card>
                  ))}

                  {cands.length === 0 && (
                    <div className="text-center py-4 text-[10px] text-dark/40 italic">
                      Geen kandidaten in deze fase.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PARTNER DETAIL SCREEN MODAL */}
      <AnimatePresence>
        {detailModalPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-xs" onClick={() => setDetailModalPartner(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
              
              {/* Profile Header */}
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-cream flex items-center justify-center font-heading font-bold text-xl">
                    {detailModalPartner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-heading font-bold text-primary">{detailModalPartner.name}</h3>
                      {getWorkloadBadge(detailModalPartner.workload)}
                    </div>
                    <p className="text-xs font-bold text-accent">{detailModalPartner.company} — <span className="font-mono text-dark/60">{detailModalPartner.kvk || 'KVK-Geregistreerd'}</span></p>
                    <p className="text-[11px] text-dark/60 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {detailModalPartner.region}</p>
                  </div>
                </div>
                <button onClick={() => setDetailModalPartner(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              {/* Contact Actions Bar */}
              <div className="flex gap-2 flex-wrap">
                <a href={`https://wa.me/${detailModalPartner.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg font-bold text-[11px]">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a href={`tel:${detailModalPartner.phone}`} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-[11px]">
                  <Phone className="w-3.5 h-3.5" /> Bellen ({detailModalPartner.phone})
                </a>
                <a href={`mailto:${detailModalPartner.email}`} className="flex items-center gap-1 px-3 py-1.5 bg-[#3E4E36] text-white rounded-lg font-bold text-[11px]">
                  <Mail className="w-3.5 h-3.5" /> E-mail ({detailModalPartner.email})
                </a>
              </div>

              {/* Past Projects History Section */}
              <div className="space-y-2 pt-2 border-t border-[#D6CFC2]">
                <h4 className="font-heading font-bold text-primary text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Uitgevoerde Projecten Historie
                </h4>
                <div className="bg-white rounded-xl border border-[#D6CFC2]/60 divide-y divide-[#D6CFC2]/40">
                  {projectsList.filter(p => (p.partner || '').toLowerCase() === detailModalPartner.name.toLowerCase()).length > 0 ? (
                    projectsList.filter(p => (p.partner || '').toLowerCase() === detailModalPartner.name.toLowerCase()).map(p => (
                      <div key={p.id} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-dark">{p.name}</p>
                          <p className="text-[10px] text-dark/50">Klant: {p.customer} | Deadline: {p.deadline}</p>
                        </div>
                        <Badge variant={p.status === 'Completed' ? 'success' : 'primary'}>{p.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-dark/50 italic">P-2001 Luxury Outdoor Kitchen Amsterdam (Afgerond)</div>
                  )}
                </div>
              </div>

              {/* Purchase Invoices Section (Inkoopfacturen) */}
              <div className="space-y-2 pt-2 border-t border-[#D6CFC2]">
                <h4 className="font-heading font-bold text-primary text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Inkoopfacturen Partner (Purchase Invoices)
                </h4>
                <div className="bg-white rounded-xl border border-[#D6CFC2]/60 divide-y divide-[#D6CFC2]/40">
                  {detailModalPartner.invoices && detailModalPartner.invoices.length > 0 ? (
                    detailModalPartner.invoices.map(inv => (
                      <div key={inv.id} className="p-3 flex justify-between items-center font-mono">
                        <div>
                          <p className="font-bold text-dark">{inv.id}</p>
                          <p className="text-[10px] text-dark/50">Datum: {inv.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{inv.amount}</p>
                          <Badge variant="success">{inv.status}</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-dark/50 italic">Geen recente inkoopfacturen geregistreerd.</div>
                  )}
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="space-y-2 pt-2 border-t border-[#D6CFC2]">
                <h4 className="font-heading font-bold text-primary text-sm">Interne Notities (Internal Notes)</h4>
                <div className="p-3 bg-white rounded-xl border border-[#D6CFC2]/60 text-dark/80 italic">
                  "{detailModalPartner.notes || 'Geen specifieke interne notities.'}"
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setDetailModalPartner(null)}>Sluiten</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT PARTNER FORM MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">{selectedPartner ? 'Partner Bewerken' : 'Nieuwe Partner Toevoegen'}</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">Naam Vakman</label>
                  <input type="text" required value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="e.g. Sven Hoek" />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">Bedrijfsnaam</label>
                  <input type="text" value={form.company} onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="e.g. Hoek Bouw BV" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">E-mail</label>
                    <input type="email" required value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">Telefoon</label>
                    <input type="text" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">Regio / Provincie</label>
                    <input type="text" value={form.region} onChange={e => setForm(prev => ({ ...prev, region: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="e.g. Noord-Holland" />
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">Werkdruk Indicator</label>
                    <select value={form.workload} onChange={e => setForm(prev => ({ ...prev, workload: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-bold">
                      <option value="Beschikbaar">🟢 Beschikbaar</option>
                      <option value="Druk">🟡 Druk (Busy)</option>
                      <option value="Volgeboekt">🔴 Volgeboekt</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">Product Specialismen (komma gescheiden)</label>
                  <input type="text" value={form.productTypes} onChange={e => setForm(prev => ({ ...prev, productTypes: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder="Buitenkeukens, Kliko-ombouw" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">Opslaan</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
