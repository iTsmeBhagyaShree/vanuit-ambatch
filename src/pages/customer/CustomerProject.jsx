import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { CheckCircle2, Circle, Clock, Calendar, MapPin, Wrench, ShieldCheck, Compass, Sparkles, Camera, Eye, X, ArrowRight, FileText, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { normalizeProjectData } from '../../utils/gardenRoomDataModel';
import { isGardenRoomFamily } from '../../utils/projectType';

import RenderViewer from '../../components/customer/RenderViewer';
import RenderDetailCards from '../../components/customer/RenderDetailCards';
import RenderVersionList from '../../components/customer/RenderVersionList';
import WeekBar from '../../components/customer/WeekBar';
import PrepChecklist from '../../components/customer/PrepChecklist';
import SchouwProposalCard from '../../components/customer/SchouwProposalCard';

export default function CustomerProject() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');


  const [activeProject, setActiveProject] = useState(() => {
    const rawDefault = {
      id: 'P-2001',
      name: language === 'EN' ? 'Luxury Outdoor Kitchen Amsterdam' : 'Luxe Teak Buitenkeuken Amsterdam',
      division: language === 'EN' ? 'Custom Outdoor Kitchens' : 'Buitenkeukens op maat',
      customer: user?.name || (language === 'EN' ? 'John Miller' : 'Jan de Vries'),
      address: 'Keizersgracht 420, 1016 GC Amsterdam',
      expectedDelivery: '15 November 2026',
      craftsman: 'Sven Hoek (Hoek Bouw)',
      progress: 45,
      status: 'In Progress'
    };
    return normalizeProjectData(rawDefault);
  });

  const handleUpdateProject = (updatedProject) => {
    setActiveProject(updatedProject);
    try {
      const saved = localStorage.getItem('app_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        const updatedList = parsed.map(p => p.id === updatedProject.id ? updatedProject : p);
        localStorage.setItem('app_projects', JSON.stringify(updatedList));
        window.dispatchEvent(new Event('app_data_changed'));
      }
    } catch (e) {}
  };


  const [sharedPhotos, setSharedPhotos] = useState([]);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

  const loadCustomerProjectData = () => {
    try {
      const currentCustName = user?.name || (language === 'EN' ? 'John Miller' : 'Jan de Vries');

      // Load Projects
      const savedProjects = localStorage.getItem('app_projects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const match = parsed.find(p => 
            (p.customer || '').toLowerCase().includes(currentCustName.toLowerCase()) ||
            currentCustName.toLowerCase().includes((p.customer || '').toLowerCase())
          ) || parsed[0];

          if (match) {
            const normalized = normalizeProjectData({
              id: match.id || 'P-2001',
              name: match.name || (language === 'EN' ? 'Luxury Outdoor Kitchen' : 'Luxe Buitenkeuken'),
              division: match.category || (language === 'EN' ? 'Custom Outdoor Kitchens' : 'Buitenkeukens op maat'),
              customer: match.customer || currentCustName,
              address: match.deliveryAddress || 'Keizersgracht 420, 1016 GC Amsterdam',
              expectedDelivery: match.deadline || '15 November 2026',
              craftsman: match.partner && match.partner !== 'Unassigned' ? match.partner : 'Sven Hoek (Hoek Bouw)',
              progress: Number(match.progress) || 45,
              status: match.status || 'In Progress',
              category: match.category,
              projectType: match.projectType,
              renderPackage: match.renderPackage
            });
            setActiveProject(normalized);
          }
        }
      }

      // Load Shared Photos
      const savedPhotos = localStorage.getItem('app_project_photos');
      if (savedPhotos) {
        const parsedP = JSON.parse(savedPhotos);
        if (Array.isArray(parsedP) && parsedP.length > 0) {
          const visiblePhotos = parsedP.filter(p => p.isShared !== false);
          setSharedPhotos(visiblePhotos);
        }
      }
    } catch (e) {}
  };


  useEffect(() => {
    loadCustomerProjectData();
    window.addEventListener('storage', loadCustomerProjectData);
    window.addEventListener('app_data_changed', loadCustomerProjectData);
    return () => {
      window.removeEventListener('storage', loadCustomerProjectData);
      window.removeEventListener('app_data_changed', loadCustomerProjectData);
    };
  }, [language, user]);

  const progressVal = activeProject.progress;

  const timelineSteps = [
    { 
      title: language === 'EN' ? '1. Quote Accepted & Design Approval' : '1. Offerte Akkoord & Ontwerp', 
      date: '01 Oct 2026', 
      status: 'completed', 
      desc: language === 'EN' ? 'Quote approved and workshop production queued.' : 'Offerte goedgekeurd en productie ingepland.' 
    },
    { 
      title: language === 'EN' ? '2. Premium Materials Sourced' : '2. Materialen Besteld & Gecontroleerd', 
      date: '05 Oct 2026', 
      status: progressVal >= 25 ? 'completed' : 'active', 
      desc: language === 'EN' ? 'Solid teak wood and concrete top components delivered to workshop.' : 'Massief teakhout en betonblad onderdelen ontvangen in werkplaats.' 
    },
    { 
      title: language === 'EN' ? '3. Workshop Build & Crafting' : '3. Werkplaats Constructie & Bouw', 
      date: '15 Oct 2026', 
      status: progressVal >= 100 ? 'completed' : progressVal >= 25 ? 'active' : 'pending', 
      desc: language === 'EN' ? `Craftsman ${activeProject.craftsman} is currently fabricating frame, drawers & finish.` : `Vakman ${activeProject.craftsman} bouwt het frame, de lades en afwerking.` 
    },
    { 
      title: language === 'EN' ? '4. On-Site Assembly & Final Delivery' : '4. Oplevering & Locatie Montage', 
      date: activeProject.expectedDelivery, 
      status: progressVal >= 100 ? 'completed' : 'pending', 
    },
  ];

  const isGardenRoom = isGardenRoomFamily(activeProject);

  // 1. DESIGN & RENDERS TAB
  if (activeTab === 'design' || activeTab === 'renders') {
    if (isGardenRoom) {
      return (
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#D6CFC2]">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary">
                Design & Renders
              </h2>
              <p className="text-xs text-dark/60 mt-0.5">
                Interactive 3D visualization, material details and version history for your project.
              </p>
            </div>
          </div>
          <RenderViewer renderPackage={activeProject.renderPackage} />
          <RenderDetailCards detailRenders={activeProject.renderPackage?.detailRenders} />
          <RenderVersionList versionHistory={activeProject.renderPackage?.versionHistory} />
        </div>
      );
    }

    // Outdoor Kitchen Design & Options
    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#D6CFC2]">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary">
              Design & Options
            </h2>
            <p className="text-xs text-dark/60 mt-0.5">
              Custom specifications, materials and configuration for your outdoor kitchen.
            </p>
          </div>
        </div>
        <Card title="Design Specifications" icon={FileText}>
          <div className="space-y-3 font-body text-xs text-dark/80">
            <div className="p-4 bg-white border border-[#D6CFC2] rounded-xl space-y-2">
              <h4 className="font-bold text-primary text-sm font-heading">{activeProject.name}</h4>
              <p>Worktop: Solid Concrete Polished finish</p>
              <p>Timber: Teak Wood Grade A</p>
              <p>Appliance integration: Kamado Joe Big II & Gas Burner</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 2. PLANNING & BUILD TAB
  if (activeTab === 'planning' || activeTab === 'build') {
    if (isGardenRoom) {
      return (
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#D6CFC2]">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary">
                Planning & Build
              </h2>
              <p className="text-xs text-dark/60 mt-0.5">
                Construction timeline, site survey scheduling, customer preparation and neighbour notice.
              </p>
            </div>
          </div>
          <SchouwProposalCard project={activeProject} onUpdateProject={handleUpdateProject} />
          <WeekBar weekSchedule={activeProject.weekSchedule} />
          <PrepChecklist projectId={activeProject.id} prepChecklist={activeProject.prepChecklist} />
        </div>
      );
    }

    // Outdoor Kitchen Planning & Delivery
    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#D6CFC2]">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary">
              Planning & Delivery
            </h2>
            <p className="text-xs text-dark/60 mt-0.5">
              Production schedule and assembly timeline for your custom outdoor kitchen.
            </p>
          </div>
        </div>
        <Card title="Production Progress Timeline" icon={Calendar}>
          <div className="space-y-4 p-2 font-body">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    step.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-300' :
                    step.status === 'active' ? 'bg-primary text-cream font-bold' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  {idx < timelineSteps.length - 1 && <div className="w-0.5 flex-1 bg-[#D6CFC2] my-1" />}
                </div>
                <div className="pb-3 space-y-0.5">
                  <div className="font-bold text-primary">{step.title}</div>
                  <div className="text-[11px] text-dark/60 font-mono">{step.date}</div>
                  {step.desc && <div className="text-[11px] text-dark/70 mt-1">{step.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // 3. PAYMENTS TAB
  if (activeTab === 'payments') {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#D6CFC2]">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary">
              Payments
            </h2>
            <p className="text-xs text-dark/60 mt-0.5">
              Payment schedule, instalments and transaction history for your project.
            </p>
          </div>
        </div>
        <Card title="Project Payment Overview" icon={CreditCard}>
          <div className="p-8 text-center bg-[#F7F4EE] border border-dashed border-[#C4BEB3] rounded-xl space-y-2">
            <CreditCard className="w-8 h-8 text-primary mx-auto opacity-50" />
            <h4 className="font-heading font-bold text-primary text-sm">Payment Schedule & Invoices</h4>
            <p className="text-xs text-dark/60 max-w-md mx-auto">
              Your 40% deposit, 40% pre-assembly, and 20% completion instalment breakdown will be displayed here.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // 4. HANDOVER & AFTERCARE TAB
  if (activeTab === 'handover') {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#D6CFC2]">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary">
              Handover & Aftercare
            </h2>
            <p className="text-xs text-dark/60 mt-0.5">
              Final sign-off, warranty certificate, seasonal maintenance and 3-month checkup.
            </p>
          </div>
        </div>
        <Card title="Completion & Warranty" icon={ShieldCheck}>
          <div className="p-8 text-center bg-[#F7F4EE] border border-dashed border-[#C4BEB3] rounded-xl space-y-2">
            <ShieldCheck className="w-8 h-8 text-primary mx-auto opacity-50" />
            <h4 className="font-heading font-bold text-primary text-sm">Handover Protocol & Maintenance</h4>
            <p className="text-xs text-dark/60 max-w-md mx-auto">
              Your final sign-off report, 10-year timber warranty certificate, and maintenance guides will be available here after completion.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // 5. OVERVIEW TAB (Default when no tab selected)
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">


      {/* Read-Only Header Banner */}

      <div className="bg-[#EDE8DF] border border-[#C4BEB3] p-4 sm:p-6 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent">{activeProject.id}</span>
              <Badge variant="primary">{activeProject.division}</Badge>
            </div>
            <h2 className="text-lg sm:text-2xl font-heading font-bold text-primary mt-1 leading-snug">{activeProject.name}</h2>
          </div>
          <div className="bg-white/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#D6CFC2] text-left sm:text-right w-full sm:w-auto">
            <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Target Delivery' : 'Verwachte Oplevering'}</span>
            <span className="text-xs font-bold text-primary flex items-center gap-1 mt-0.5 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-accent flex-shrink-0" /> {activeProject.expectedDelivery}
            </span>
          </div>
        </div>

        {/* Project Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#D6CFC2]/60 text-xs">
          <div className="flex items-center gap-2 bg-white/70 p-2 sm:p-2.5 rounded-xl border border-[#D6CFC2]/40 min-w-0">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Delivery Location' : 'Opleverlocatie'}</span>
              <span className="font-semibold text-dark truncate block">{activeProject.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/70 p-2 sm:p-2.5 rounded-xl border border-[#D6CFC2]/40 min-w-0">
            <Wrench className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Assigned Craftsman' : 'Toegewezen Vakman'}</span>
              <span className="font-semibold text-primary truncate block">{activeProject.craftsman}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Workshop Photos Section */}
      <Card 
        title={language === 'EN' ? `Recent Workshop Photo Updates (${sharedPhotos.length})` : `Werkplaats Foto-Updates (${sharedPhotos.length})`} 
        icon={Camera}
      >
        <div className="space-y-3">
          {sharedPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sharedPhotos.slice(0, 3).map((photo) => (
                <div 
                  key={photo.id} 
                  onClick={() => setSelectedPhotoModal(photo)}
                  className="relative group bg-white border border-[#D6CFC2] rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="h-32 bg-cream-dark/20 overflow-hidden relative">
                    <img src={photo.img} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold text-primary font-mono">
                      {photo.phase || 'Workshop Photo'}
                    </span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <h5 className="font-bold text-primary text-xs truncate">{photo.title}</h5>
                    <p className="text-[10px] text-dark/60 line-clamp-1">{photo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-dark/50 italic py-2">
              {language === 'EN' ? 'No workshop build photos shared yet.' : 'Nog geen werkplaatsfoto\'s gedeeld.'}
            </p>
          )}

          <div className="pt-2 border-t border-[#D6CFC2]/60 flex justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/customer/photos')}
              className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'EN' ? 'View All Photo Updates →' : 'Bekijk Alle Foto-Updates →'}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Interactive Read-Only Project Timeline */}
      <Card title={language === 'EN' ? 'Project Progress Timeline' : 'Projectvoortgang Tijdlijn'} icon={Compass}>
        <div className="relative border-l-2 border-[#D6CFC2] ml-2.5 sm:ml-4 mt-4 mb-4 space-y-6 sm:space-y-8">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8">
              {/* Icon marker */}
              <div className="absolute -left-[17px] top-0.5 bg-[#EDE8DF] p-1">
                {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-600 bg-white rounded-full" />}
                {step.status === 'active' && <Clock className="w-6 h-6 text-primary bg-white rounded-full animate-pulse" />}
                {step.status === 'pending' && <Circle className="w-6 h-6 text-dark/30 bg-white rounded-full" />}
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
                  <h4 className={`text-xs sm:text-sm font-bold font-heading ${step.status === 'pending' ? 'text-dark/40' : 'text-primary'}`}>
                    {step.title}
                  </h4>
                  <span className="text-[10px] sm:text-xs font-mono text-dark/50 self-start sm:self-auto">{step.date}</span>
                </div>
                
                <p className="text-xs text-dark/60 leading-relaxed">{step.desc}</p>

                {step.status === 'active' && (
                  <div className="mt-3 bg-primary/10 border border-primary/20 p-3 sm:p-4 rounded-xl space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs">
                      <span className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" /> {language === 'EN' ? 'Current Phase: In Workshop Construction' : 'Huidige Fase: In Werkplaats Constructie'}
                      </span>
                      <span className="font-mono font-bold text-primary text-xs">{progressVal}% {language === 'EN' ? 'Completed' : 'Compleet'}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progressVal}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {selectedPhotoModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-dark/85 backdrop-blur-md z-[99999]" onClick={() => setSelectedPhotoModal(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-5 shadow-2xl z-[100000] space-y-3 text-xs my-auto">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-2">
                <div>
                  <span className="text-[10px] font-mono text-accent font-bold">{selectedPhotoModal.phase}</span>
                  <h3 className="text-lg font-heading font-bold text-primary">{selectedPhotoModal.title}</h3>
                </div>
                <button onClick={() => setSelectedPhotoModal(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <div className="rounded-xl overflow-hidden max-h-[50vh] bg-black/90 border border-[#D6CFC2] flex items-center justify-center p-2">
                <img src={selectedPhotoModal.img} alt={selectedPhotoModal.title} className="max-h-[48vh] w-auto max-w-full object-contain mx-auto rounded-lg" />
              </div>

              <p className="text-dark/80 bg-white p-3 rounded-xl border border-[#D6CFC2]/60 text-xs">
                {selectedPhotoModal.description}
              </p>

              <div className="flex justify-end pt-1">
                <button onClick={() => setSelectedPhotoModal(null)} className="px-4 py-2 bg-primary text-cream font-bold rounded-xl text-xs hover:bg-primary/90">
                  {language === 'EN' ? 'Close' : 'Sluiten'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

