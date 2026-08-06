import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Calendar as CalendarIcon, Clock, AlertTriangle, UserX, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, Compass, MapPin, User, ArrowRight, ShieldAlert, Plus, Filter, Wrench } from 'lucide-react';
import { mockProjects, mockPartners } from '../../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function Planning() {
  const { t, language } = useLanguage();
  const label = (english, dutch) => language === 'EN' ? english : dutch;

  const translateProjectName = (name) => {
    if (language !== 'EN' || !name) return name;
    return name
      .replace(/Eiken Houten Overkapping/gi, 'Oak Wooden Canopy')
      .replace(/Luxe Teak Buitenkeuken/gi, 'Luxury Teak Outdoor Kitchen')
      .replace(/Kliko Ombouw Triple Antraciet/gi, 'Triple Bin Storage Anthracite')
      .replace(/Luxury Buitenkeukens/gi, 'Luxury Outdoor Kitchens')
      .replace(/Kliko Ombouw/gi, 'Bin Storage');
  };

  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedPartnerFilter, setSelectedPartnerFilter] = useState('All');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [assignPartnerModalProject, setAssignPartnerModalProject] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // 6 Weeks definition generator starting from current week
  const generate6Weeks = () => {
    const weeks = [];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    for (let i = 0; i < 6; i++) {
      const weekStart = new Date(monday);
      weekStart.setDate(monday.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const firstJan = new Date(weekStart.getFullYear(), 0, 1);
      const weekNum = Math.ceil((((weekStart - firstJan) / 86400000) + firstJan.getDay() + 1) / 7);

      weeks.push({
        index: i + 1,
        weekNum: weekNum || (31 + i),
        title: `Week ${weekNum || (31 + i)}`,
        dateRange: `${weekStart.getDate()} ${weekStart.toLocaleString('default', { month: 'short' })} - ${weekEnd.getDate()} ${weekEnd.toLocaleString('default', { month: 'short' })}`,
        startDate: weekStart,
        endDate: weekEnd
      });
    }
    return weeks;
  };

  const [weeksList] = useState(generate6Weeks());

  // Helper to place project into specific week cell cleanly across the 6 weeks
  const getProjectWeekIndex = (proj, index) => {
    if (proj.weekIndex) return proj.weekIndex;
    if (proj.deadline) {
      const pDate = new Date(proj.deadline);
      for (let i = 0; i < weeksList.length; i++) {
        if (pDate >= weeksList[i].startDate && pDate <= weeksList[i].endDate) {
          return weeksList[i].index;
        }
      }
    }
    // Even distribution fallback for mock data
    const distribution = [1, 2, 4, 1, 5, 1];
    return distribution[index % distribution.length];
  };

  // Load Data from LocalStorage with mock fallbacks
  useEffect(() => {
    const savedProjects = localStorage.getItem('app_projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed);
        else setProjects(mockProjects);
      } catch (e) { setProjects(mockProjects); }
    } else {
      setProjects(mockProjects);
    }

    const savedPartners = localStorage.getItem('app_partners_v3') || localStorage.getItem('app_partners_v2');
    if (savedPartners) {
      try {
        const parsed = JSON.parse(savedPartners);
        if (Array.isArray(parsed) && parsed.length > 0) setPartners(parsed);
        else setPartners(mockPartners);
      } catch (e) { setPartners(mockPartners); }
    } else {
      setPartners(mockPartners);
    }
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAssignPartnerToProject = (projectId, partnerName) => {
    const updatedProjects = projects.map(p => p.id === projectId ? { ...p, partner: partnerName } : p);
    setProjects(updatedProjects);
    localStorage.setItem('app_projects', JSON.stringify(updatedProjects));
    showToast(`Partner "${partnerName}" toegewezen aan project ${projectId}!`);
    setAssignPartnerModalProject(null);
  };

  // Filter projects by partner filter
  const activeProjects = projects.filter(p => {
    if (selectedPartnerFilter === 'All') return true;
    return (p.partner || '').toLowerCase() === selectedPartnerFilter.toLowerCase();
  });

  // Calculate Capacity Overloads & Unassigned Warnings
  const partnerCapacityOverloads = [];
  const unassignedProjects = projects.filter(p => !p.partner || p.partner === 'Unassigned' || p.partner === 'Niet toegewezen');

  weeksList.forEach(w => {
    const weekIndex = w.index;
    const weekProjects = projects.filter((p, idx) => getProjectWeekIndex(p, idx) === weekIndex);
    
    // Group by partner
    const partnerCounts = {};
    weekProjects.forEach(p => {
      if (p.partner && p.partner !== 'Unassigned' && p.partner !== 'Niet toegewezen') {
        partnerCounts[p.partner] = (partnerCounts[p.partner] || 0) + 1;
      }
    });

    Object.keys(partnerCounts).forEach(partnerName => {
      if (partnerCounts[partnerName] > 2) {
        partnerCapacityOverloads.push({
          week: w.title,
          weekNum: w.weekNum,
          partner: partnerName,
          count: partnerCounts[partnerName]
        });
      }
    });
  });

  return (
    <div className="space-y-6 font-body text-[#4A4A43] max-w-full">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs font-body">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">{label('Planning & 6-Week Calendar', 'Planning en 6-wekenkalender')}</h2>
        <p className="text-dark/60 text-sm">{label('6-week delivery calendar, partner capacity and scheduling conflict warnings.', '6-wekenopleverkalender, partnercapaciteit en waarschuwingen voor planningsconflicten.')}</p>
      </div>

      {/* CAPACITY & UNASSIGNED WARNINGS BANNER PANEL — Full Width Layout */}
      {(partnerCapacityOverloads.length > 0 || unassignedProjects.length > 0) && (
        <div className="space-y-3">
          {/* Overload Warnings Banner */}
          {partnerCapacityOverloads.length > 0 && (
            <Card noPadding className="p-4 bg-red-50/90 border-2 border-red-200">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs mb-2">
                <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
                <span>{label('Capacity conflict! Partner overloaded', 'Capaciteitsconflict! Partner overbelast')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-red-700">
                {partnerCapacityOverloads.map((ov, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/90 p-2.5 rounded-lg border border-red-200">
                    <div>
                      <span className="font-bold text-dark">{ov.partner}</span> {label('has', 'heeft')} <span className="font-bold text-red-600">{ov.count} {label('deliveries', 'opleveringen')}</span> in {ov.week}
                    </div>
                    <Badge variant="danger">⚠️ {label('Overloaded', 'Overbelast')}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Unassigned Projects Warnings Banner — Full Width */}
          {unassignedProjects.length > 0 && (
            <Card noPadding className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 mb-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <UserX className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <span>{label(`No Partner Assigned Yet (${unassignedProjects.length} Projects)`, `Nog geen partner toegewezen (${unassignedProjects.length} projecten)`)}</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">{label('Action Required', 'Actie Vereist')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unassignedProjects.map((un, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/90 p-3 rounded-xl border border-amber-200 gap-2 shadow-xs">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="font-bold text-dark text-xs truncate">{translateProjectName(un.name)}</p>
                      <p className="text-[10px] text-amber-900/80 truncate">{label('Client:', 'Klant:')} <span className="font-semibold">{un.customer}</span></p>
                      <p className="text-[10px] text-dark/50 font-mono truncate">📅 {un.deadline}</p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setAssignPartnerModalProject(un)}
                      className="text-[10px] py-1 px-3 flex-shrink-0 shadow-xs"
                    >
                      {label('Assign →', 'Wijs Toe →')}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* 6-WEEK CALENDAR GRID CARD */}
      <Card noPadding className="p-5 sm:p-6 overflow-hidden">
        {/* Toolbar Header with Partner Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#D6CFC2] mb-5">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-heading font-bold text-primary text-base sm:text-lg leading-tight">{label('6-Week Delivery Planning Grid', '6-wekenopleverplanning')}</h3>
              <p className="text-[11px] text-dark/60">{label('Overview of scheduled installation deliveries per week', 'Overzicht ingeplande opleveringen per week')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full flex-shrink-0">
              {label(`Total Scheduled: ${activeProjects.length}`, `Totaal ingepland: ${activeProjects.length}`)}
            </span>

            {/* Custom Sleek Partner Filter Dropdown — Zero Native Bevel Box */}
            <div className="relative flex items-center bg-[#EDE8DF] border border-[#C4BEB3] px-3 py-1.5 rounded-xl shadow-xs gap-2 hover:border-primary/50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <select
                value={selectedPartnerFilter}
                onChange={(e) => setSelectedPartnerFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-primary cursor-pointer appearance-none outline-none border-none pr-6 focus:outline-none focus:ring-0"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent'
                }}
              >
                <option value="All">{label(`All Partners (${partners.length})`, `Alle partners (${partners.length})`)}</option>
                {partners.map((pt, idx) => (
                  <option key={idx} value={pt.name}>
                    {pt.company && pt.company !== '-' ? `${pt.name} — ${pt.company}` : pt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-primary flex-shrink-0 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Comfortable 6-Week Horizontal Grid Container with Overflow Scroll */}
        <div className="overflow-x-auto pb-3">
          <div className="grid grid-cols-6 gap-3.5 min-w-[1080px]">
            {weeksList.map((week) => {
              const weekProjects = activeProjects.filter((p, idx) => getProjectWeekIndex(p, idx) === week.index);
              const hasUnassigned = weekProjects.some(p => !p.partner || p.partner === 'Unassigned' || p.partner === 'Niet toegewezen');
              const isOverloaded = partnerCapacityOverloads.some(o => o.week === week.title);

              return (
                <div key={week.index} className="space-y-2.5 flex flex-col justify-between min-w-[170px]">
                  {/* Column Week Header */}
                  <div className={`p-2.5 rounded-xl border text-center font-body transition-all ${
                    isOverloaded
                      ? 'bg-red-100 border-red-300 text-red-900'
                      : hasUnassigned
                      ? 'bg-amber-100/90 border-amber-300 text-amber-900'
                      : 'bg-[#EDE8DF] border-[#D6CFC2] text-primary'
                  }`}>
                    <p className="font-heading font-bold text-xs sm:text-sm">{week.title}</p>
                    <p className="text-[10px] text-dark/60 font-mono mt-0.5">{week.dateRange}</p>
                    <div className="mt-1 flex justify-center">
                      <span className="text-[9px] font-bold bg-white/90 text-primary px-2 py-0.5 rounded-full border border-[#D6CFC2]/60">
                        {label(`${weekProjects.length} deliveries`, `${weekProjects.length} opleveringen`)}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Cards Container — Equal Clean Height */}
                  <div className="space-y-2 flex-1 bg-[#F8F7F4]/80 p-2.5 rounded-xl border border-[#D6CFC2]/60 flex flex-col">
                    {weekProjects.map((proj) => {
                      const isProjUnassigned = !proj.partner || proj.partner === 'Unassigned' || proj.partner === 'Niet toegewezen';
                      return (
                        <motion.div
                          key={proj.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedProjectModal(proj)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs space-y-1.5 overflow-hidden ${
                            isProjUnassigned
                              ? 'bg-amber-50/90 border-amber-300 hover:border-amber-500'
                              : 'bg-white border-[#D6CFC2] hover:border-primary'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono font-bold text-accent text-[10px] shrink-0">{proj.id}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-tight ${
                              proj.status === 'Completed' || proj.status === 'Voltooid' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : proj.status === 'In Progress' || proj.status === 'Lopend'
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {proj.status === 'In Progress' ? label('ONGOING', 'LOPEND') : proj.status === 'Completed' ? label('COMPLETED', 'VOLTOOID') : label('PENDING', 'WACHTEND')}
                            </span>
                          </div>

                          <h4 className="font-heading font-bold text-xs text-primary leading-tight line-clamp-2">
                            {translateProjectName(proj.name)}
                          </h4>

                          <p className="text-[10px] text-dark/60 truncate">
                            {label('Client:', 'Klant:')} <span className="font-semibold text-dark">{proj.customer}</span>
                          </p>

                          <div className="pt-1.5 border-t border-[#D6CFC2]/40 text-[9px] space-y-0.5">
                            <p className={`font-bold truncate ${isProjUnassigned ? 'text-amber-800' : 'text-primary'}`}>
                              {isProjUnassigned ? label('⚠️ No Partner', '⚠️ Geen Partner') : `👷 ${proj.partner}`}
                            </p>
                            <p className="text-dark/50 font-mono truncate">
                              📅 {proj.deadline}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}

                    {weekProjects.length === 0 && (
                      <div className="flex-1 flex items-center justify-center text-center py-6 text-[10px] text-dark/40 italic">
                        {label('No delivery planned in this week', 'Geen oplevering gepland in deze week')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ASSIGN PARTNER MODAL */}
      <AnimatePresence>
        {assignPartnerModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-xs" onClick={() => setAssignPartnerModalProject(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs font-body">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-3">
                <h3 className="font-heading font-bold text-primary text-base">Wijs Partner Toe aan Project</h3>
                <button onClick={() => setAssignPartnerModalProject(null)} className="p-1 text-dark/40 hover:text-dark">✕</button>
              </div>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-[#D6CFC2]">
                <p className="font-bold text-dark text-xs">{assignPartnerModalProject.name}</p>
                <p className="text-[10px] text-dark/60">Klant: {assignPartnerModalProject.customer} • Deadline: {assignPartnerModalProject.deadline}</p>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-dark text-xs">Kies Vakman / Partner:</label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {partners.map(pt => (
                    <div
                      key={pt.id}
                      onClick={() => handleAssignPartnerToProject(assignPartnerModalProject.id, pt.name)}
                      className="p-3 bg-white hover:bg-primary/10 border border-[#D6CFC2] hover:border-primary rounded-xl cursor-pointer transition-all flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-primary">{pt.name}</p>
                        <p className="text-[10px] text-dark/50">{pt.company} ({pt.region})</p>
                      </div>
                      <Badge variant={pt.workload === 'Beschikbaar' ? 'success' : pt.workload === 'Druk' ? 'warning' : 'danger'}>
                        {pt.workload}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-xs" onClick={() => setSelectedProjectModal(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs font-body">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-3">
                <div>
                  <h3 className="font-heading font-bold text-primary text-base">{selectedProjectModal.name}</h3>
                  <p className="text-[10px] font-mono text-accent">ID: {selectedProjectModal.id}</p>
                </div>
                <button onClick={() => setSelectedProjectModal(null)} className="p-1 text-dark/40 hover:text-dark">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#D6CFC2]">
                <div>
                  <p className="text-[10px] text-dark/50 uppercase font-bold">Klant</p>
                  <p className="font-bold text-dark">{selectedProjectModal.customer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-dark/50 uppercase font-bold">Status</p>
                  <Badge variant={selectedProjectModal.status === 'Completed' ? 'success' : selectedProjectModal.status === 'In Progress' ? 'primary' : 'warning'}>
                    {selectedProjectModal.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] text-dark/50 uppercase font-bold">Toegewezen Vakman</p>
                  <p className="font-bold text-primary">{selectedProjectModal.partner || '⚠️ Niet toegewezen'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-dark/50 uppercase font-bold">Opleverdeadline</p>
                  <p className="font-mono font-bold text-dark">{selectedProjectModal.deadline}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedProjectModal(null)}>Sluiten</Button>
                {(!selectedProjectModal.partner || selectedProjectModal.partner === 'Unassigned') && (
                  <Button variant="primary" size="sm" onClick={() => { setAssignPartnerModalProject(selectedProjectModal); setSelectedProjectModal(null); }}>
                    Wijs Partner Toe →
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
