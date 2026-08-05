import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, CheckSquare, Square, Trash2, Edit2, X, CheckCircle, Clock, Link as LinkIcon, Filter, Search, Calendar, Mic, Sparkles, FileText, UploadCloud, User, Bot, Play, Pause, Check, ArrowRight, Zap, FolderOpen } from 'lucide-react';
import { mockProjects, mockLeads } from '../../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const DEFAULT_SAMPLE_TRANSCRIPT = `[00:01] Tim: Goedemiddag Bjorn! Bedankt voor de koffie. Laten we de buitenkeuken opstelling bespreken.
[00:15] Bjorn Valk: Ja top! Ik wil graag een strakke houten buitenkeuken van 240x80 cm op ons achterterras.
[00:42] Bram: Welke houtsoort heeft jouw voorkeur? Eiken of Thermo Fraké?
[01:05] Bjorn Valk: Thermo Fraké is toch duurzamer en onderhoudsvrij? Laten we definitief voor Thermo Fraké gaan.
[01:35] Tim: Helder! En betreft de BBQ uitsparing?
[02:10] Bjorn Valk: Ik heb een Big Green Egg Large. Die moet rechts ingebouwd worden met een zwart beton cire werkblad van 8cm.
[02:45] Bram: Duidelijk. Ik ga vandaag nog de 3D CAD werktekening maken voor de werkplaats. Tim stuur jij de officiële offerte?
[03:15] Tim: Afgesproken, ik stuur de offerte (OF-2026-003) uiterlijk morgen naar Bjorn Valk. Aanbetaling 50% vooraf.`;

export default function Tasks() {
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  
  // Filter & Search State
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Completed'
  const [assigneeFilter, setAssigneeFilter] = useState('All'); // 'All' | 'Tim' | 'Bram'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Plaud AI Import & Analyzer State
  const [plaudModalOpen, setPlaudModalOpen] = useState(false);
  const [plaudInputMode, setPlaudInputMode] = useState('transcript'); // 'transcript' | 'audio'
  const [transcriptText, setTranscriptText] = useState(DEFAULT_SAMPLE_TRANSCRIPT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Local Audio File Upload State & Ref
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    linkedType: 'Project', // 'Project' | 'Lead' | 'None'
    linkedId: '',
    assignee: 'Tim', // 'Tim' | 'Bram'
    priority: 'Medium', // 'High' | 'Medium' | 'Low'
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false
  });

  const defaultMockTasks = [];

  // Load Initial Data
  useEffect(() => {
    const savedTasks = localStorage.getItem('app_tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) setTasks(parsed);
        else setTasks(defaultMockTasks);
      } catch (e) { setTasks(defaultMockTasks); }
    } else {
      setTasks(defaultMockTasks);
      localStorage.setItem('app_tasks', JSON.stringify(defaultMockTasks));
    }

    const savedProjects = localStorage.getItem('app_projects');
    if (savedProjects) {
      try { setProjectsList(JSON.parse(savedProjects)); } catch(e){}
    } else setProjectsList(mockProjects);

    const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
    if (savedLeads) {
      try { setLeadsList(JSON.parse(savedLeads)); } catch(e){}
    } else setLeadsList(mockLeads);
  }, [modalOpen]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Toggle Task Checkbox completion
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        showToast(nextState ? `Taak "${t.title}" gemarkeerd als afgerond! ✅` : `Taak status teruggezet.`);
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTasks(updatedTasks);
    localStorage.setItem('app_tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (id, title) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem('app_tasks', JSON.stringify(updated));
    showToast(`Taak verwijderd.`);
  };

  // Handle Local File Upload Selection from Computer
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.name.endsWith('.txt') || file.name.endsWith('.json') || file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setTranscriptText(evt.target.result);
        showToast(language === 'EN' ? `Loaded transcript from "${file.name}"!` : `Transcript ingeladen uit "${file.name}"!`);
      };
      reader.readAsText(file);
    } else {
      const objectUrl = URL.createObjectURL(file);
      setAudioPreviewUrl(objectUrl);
      showToast(language === 'EN' ? `Selected local file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB)!` : `Lokaal bestand gekozen: "${file.name}"!`);
    }
  };

  // Plaud AI Meeting Analyzer Engine
  const handleAnalyzeMeeting = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        decisions: [
          'Klant gekozen voor Thermo Fraké hout afwerking boven Eiken (duurzaam & onderhoudsarm).',
          'Akkoord op Big Green Egg Large uitsparing aan de rechterzijde van het meubel.',
          'Akkoord op 50% aanbetaling vooraf en 50% bij oplevering.'
        ],
        requirements: [
          'Afmetingen meubel: 240 x 80 cm voor achterterras.',
          '8cm Zwart Polijst Beton Cire werkblad.',
          'Levering gewenst uiterlijk binnen 3 tot 5 weken.'
        ],
        tasks: [
          {
            id: `TSK-AI-${Date.now()}-1`,
            title: 'Maak 3D CAD werktekening voor Bjorn Valk (Thermo Fraké)',
            linkedType: 'Lead',
            linkedId: 'Bjorn Valk (Utrecht)',
            assignee: 'Bram',
            priority: 'High',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: false
          },
          {
            id: `TSK-AI-${Date.now()}-2`,
            title: 'Stuur officiële 6-Pagina Offerte (OF-2026-003) naar Bjorn Valk',
            linkedType: 'Lead',
            linkedId: 'Bjorn Valk (Utrecht)',
            assignee: 'Tim',
            priority: 'High',
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: false
          },
          {
            id: `TSK-AI-${Date.now()}-3`,
            title: 'Bestel Big Green Egg Large uitsparing montagebeugel',
            linkedType: 'Project',
            linkedId: 'P-101 (Luxe Teak Buitenkeuken 4m)',
            assignee: 'Tim',
            priority: 'Medium',
            dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            completed: false
          }
        ]
      });
      showToast(language === 'EN' ? 'Plaud AI Meeting analysis complete!' : 'Plaud AI meeting analyse afgerond!');
    }, 1500);
  };

  const handleImportAITasks = () => {
    if (!analysisResult || !analysisResult.tasks) return;
    const updated = [...analysisResult.tasks, ...tasks];
    setTasks(updated);
    localStorage.setItem('app_tasks', JSON.stringify(updated));
    setPlaudModalOpen(false);
    showToast(language === 'EN' ? `${analysisResult.tasks.length} AI Tasks imported to board!` : `${analysisResult.tasks.length} AI Taken geïmporteerd naar board!`);
  };

  const handleOpenAddModal = () => {
    setSelectedTask(null);
    const defaultLinked = projectsList[0] ? `P-${projectsList[0].id} (${projectsList[0].name})` : '';
    setForm({
      title: '',
      linkedType: 'Project',
      linkedId: defaultLinked,
      priority: 'Medium',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setForm({
      title: task.title,
      linkedType: task.linkedType || 'None',
      linkedId: task.linkedId || '',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      completed: task.completed || false
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Vul een geldige taaktitel in.");
      return;
    }

    let updatedList = [];
    if (selectedTask) {
      updatedList = tasks.map(t => {
        if (t.id === selectedTask.id) {
          return {
            ...t,
            title: form.title,
            linkedType: form.linkedType,
            linkedId: form.linkedId,
            priority: form.priority,
            dueDate: form.dueDate,
            completed: form.completed
          };
        }
        return t;
      });
      showToast(`Taak geüpdatet!`);
    } else {
      const newTask = {
        id: `TSK-${tasks.length + 101}`,
        title: form.title,
        linkedType: form.linkedType,
        linkedId: form.linkedId,
        priority: form.priority,
        dueDate: form.dueDate,
        completed: false
      };
      updatedList = [newTask, ...tasks];
      showToast(`Nieuwe taak aangemaakt!`);
    }

    setTasks(updatedList);
    localStorage.setItem('app_tasks', JSON.stringify(updatedList));
    setModalOpen(false);
  };

  // Filter Tasks
  const filteredTasks = [...tasks].filter(t => {
    if (activeTab === 'Pending' && t.completed) return false;
    if (activeTab === 'Completed' && !t.completed) return false;

    const matchesSearch = 
      (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.linkedId || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 relative font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs font-body">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'EN' ? 'Tasks & To-Do Management' : 'Taken & To-Do Beheer'}
          </h2>
          <p className="text-dark/60 text-sm">
            {language === 'EN' 
              ? 'Manage daily action items linked to leads and projects.' 
              : 'Beheer dagelijkse actiepunten, gekoppeld aan leads en opleverprojecten.'}
          </p>
        </div>

        <div className="flex items-center justify-start sm:justify-end gap-2 w-full sm:w-auto flex-nowrap">
          <Button 
            size="sm"
            onClick={() => setPlaudModalOpen(true)} 
            className="bg-purple-900 hover:bg-purple-950 text-white font-bold border-none py-1.5 px-3 text-xs whitespace-nowrap"
          >
            <Mic className="w-3.5 h-3.5 mr-1 text-amber-300 flex-shrink-0" />
            <span>Plaud AI Import</span>
          </Button>
          <Button 
            size="sm"
            icon={Plus} 
            onClick={handleOpenAddModal}
            className="py-1.5 px-3 text-xs font-bold whitespace-nowrap"
          >
            {language === 'EN' ? 'Add New Task' : 'Nieuwe Taak'}
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <Card p="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all ${
                activeTab === 'All' ? 'bg-primary text-cream shadow-xs' : 'bg-[#EDE8DF]/60 text-dark/70 hover:bg-[#EDE8DF]'
              }`}
            >
              {language === 'EN' ? `All Tasks (${tasks.length})` : `Alle Taken (${tasks.length})`}
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all ${
                activeTab === 'Pending' ? 'bg-primary text-cream shadow-xs' : 'bg-[#EDE8DF]/60 text-dark/70 hover:bg-[#EDE8DF]'
              }`}
            >
              {language === 'EN' ? `Pending (${tasks.filter(t => !t.completed).length})` : `Openstaand (${tasks.filter(t => !t.completed).length})`}
            </button>
            <button
              onClick={() => setActiveTab('Completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all ${
                activeTab === 'Completed' ? 'bg-primary text-cream shadow-xs' : 'bg-[#EDE8DF]/60 text-dark/70 hover:bg-[#EDE8DF]'
              }`}
            >
              {language === 'EN' ? `Completed (${tasks.filter(t => t.completed).length})` : `Afgerond (${tasks.filter(t => t.completed).length})`}
            </button>

            {/* Assignee Filter */}
            <div className="h-6 w-px bg-dark/20 mx-1 self-center hidden sm:block" />
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider self-center ml-1">Assignee:</span>
            {['All', 'Tim', 'Bram'].map((ass) => (
              <button
                key={ass}
                onClick={() => setAssigneeFilter(ass)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  assigneeFilter === ass ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                }`}
              >
                {ass === 'All' ? 'All' : `👤 ${ass}`}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input
              type="text"
              placeholder={language === 'EN' ? 'Search by task or linked project...' : 'Zoek op taak of gekoppeld project...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#EDE8DF]/40 border border-[#D6CFC2] rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Tasks List Container */}
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-gray-50/70 border-gray-200 text-dark/50'
                  : 'bg-white border-[#D6CFC2] hover:border-primary/50 shadow-xs'
              }`}
            >
              {/* Checkbox Toggle + Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="text-primary hover:scale-110 transition-transform flex-shrink-0"
                  title={task.completed ? "Markeer als onafgerond" : "Markeer als afgerond"}
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  ) : (
                    <Square className="w-5 h-5 text-dark/40 hover:text-primary" />
                  )}
                </button>

                <div className="min-w-0">
                  <h4 className={`font-bold text-xs ${task.completed ? 'line-through text-dark/40' : 'text-dark'}`}>
                    {task.title}
                  </h4>
                  {task.linkedId && (
                    <p className="text-[10px] text-primary/80 flex items-center gap-1 mt-0.5 font-semibold">
                      <LinkIcon className="w-3 h-3 text-accent" /> Gekoppeld aan: {task.linkedId}
                    </p>
                  )}
                </div>
              </div>

              {/* Assignee + Priority + Due Date + Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                  👤 {task.assignee || 'Tim'}
                </span>

                <Badge variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'} className="text-[9px]">
                  {task.priority || 'Normal'}
                </Badge>

                <span className="text-[10px] text-dark/60 font-mono flex items-center gap-1 bg-[#EDE8DF]/60 px-2 py-1 rounded">
                  <Calendar className="w-3 h-3 text-dark/40" /> {task.dueDate}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="p-1 text-dark/50 hover:text-primary rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id, task.title)}
                    className="p-1 text-red-500 hover:text-red-700 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-xs text-dark/40 italic">
              {language === 'EN' ? 'No tasks found in this overview.' : 'Geen taken gevonden in dit overzicht.'}
            </div>
          )}
        </div>
      </Card>

      {/* CREATE / EDIT TASK MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">
                  {selectedTask 
                    ? (language === 'EN' ? 'Edit Task' : 'Taak Bewerken') 
                    : (language === 'EN' ? 'Create New Task' : 'Nieuwe Taak Aanmaken')}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">
                    {language === 'EN' ? 'Task Description / Title' : 'Taak Omschrijving / Titel'}
                  </label>
                  <input type="text" required value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder={language === 'EN' ? 'e.g. Call client for quote approval' : 'bijv. Bellen met klant voor offerte accoord'} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Assignee' : 'Toegewezen Aan'}
                    </label>
                    <select value={form.assignee || 'Tim'} onChange={e => setForm(prev => ({ ...prev, assignee: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-bold text-purple-900">
                      <option value="Tim">👤 Tim (Founder)</option>
                      <option value="Bram">👤 Bram (Founder)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Priority' : 'Prioriteit'}
                    </label>
                    <select value={form.priority} onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                      <option value="High">🔴 {language === 'EN' ? 'High' : 'Hoog (High)'}</option>
                      <option value="Medium">🟡 {language === 'EN' ? 'Medium' : 'Gemiddeld (Medium)'}</option>
                      <option value="Low">🟢 {language === 'EN' ? 'Low' : 'Laag (Low)'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Link Type' : 'Koppel Type'}
                    </label>
                    <select value={form.linkedType} onChange={e => setForm(prev => ({ ...prev, linkedType: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                      <option value="Project">{language === 'EN' ? 'Project' : 'Oplever Project'}</option>
                      <option value="Lead">{language === 'EN' ? 'Lead' : 'Klant Lead'}</option>
                      <option value="None">{language === 'EN' ? 'No Link' : 'Geen Koppeling'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Select Linked Item' : 'Selecteer Gekoppelde Item'}
                    </label>
                    {form.linkedType === 'Project' ? (
                      <select value={form.linkedId} onChange={e => setForm(prev => ({ ...prev, linkedId: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                        {projectsList.map((p, idx) => (
                          <option key={idx} value={`${p.id} (${p.name})`}>{p.id} - {p.name}</option>
                        ))}
                      </select>
                    ) : form.linkedType === 'Lead' ? (
                      <select value={form.linkedId} onChange={e => setForm(prev => ({ ...prev, linkedId: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                        {leadsList.map((l, idx) => (
                          <option key={idx} value={`${l.name} (${l.city || 'Lead'})`}>{l.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" disabled value={language === 'EN' ? 'General Task' : 'Algemene Taak'} className="w-full px-3 py-2 bg-[#EDE8DF] text-dark/40 border border-[#D6CFC2] rounded-lg font-semibold" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">
                    {language === 'EN' ? 'Due Date' : 'Vervaldatum (Due Date)'}
                  </label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">{language === 'EN' ? 'Save' : 'Opslaan'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PLAUD AI VOICE & TRANSCRIPT IMPORT MODAL */}
      <AnimatePresence>
        {plaudModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setPlaudModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-900 text-white rounded-xl">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                      Plaud AI Meeting Analyzer
                      <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">AI Powered</span>
                    </h3>
                    <p className="text-xs text-dark/60">
                      {language === 'EN' ? 'Import Plaud AI recordings/transcripts to extract decisions & auto-assign tasks.' : 'Importeer Plaud AI opnames om besluiten te analyseren en taken toe te wijzen.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setPlaudModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              {/* Input Mode Selector */}
              <div className="flex gap-2 bg-[#F8F7F4] p-1 rounded-xl border border-[#D6CFC2]">
                <button
                  onClick={() => setPlaudInputMode('transcript')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    plaudInputMode === 'transcript' ? 'bg-primary text-cream shadow-xs' : 'text-dark/70 hover:bg-[#EDE8DF]'
                  }`}
                >
                  <FileText className="w-4 h-4" /> {language === 'EN' ? 'Paste Plaud Transcript' : 'Plak Plaud Transcript'}
                </button>
                <button
                  onClick={() => setPlaudInputMode('audio')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    plaudInputMode === 'audio' ? 'bg-primary text-cream shadow-xs' : 'text-dark/70 hover:bg-[#EDE8DF]'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" /> {language === 'EN' ? 'Upload Plaud Audio (.mp3/.m4a)' : 'Upload Plaud Audio (.mp3/.m4a)'}
                </button>
              </div>

              {plaudInputMode === 'transcript' ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-dark/60 uppercase tracking-wider">
                      {language === 'EN' ? 'Raw Meeting Transcript' : 'Ruwe Meeting Transcript'}
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-bold text-purple-900 hover:underline flex items-center gap-1"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      {language === 'EN' ? 'Load .txt/.json file' : 'Laad .txt/.json bestand'}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={transcriptText}
                    onChange={e => setTranscriptText(e.target.value)}
                    className="w-full p-3 bg-[#F8F7F4] border border-[#D6CFC2] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
                    placeholder="Paste Plaud transcript text here..."
                  />
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D6CFC2] p-6 rounded-xl text-center bg-[#F8F7F4] hover:bg-[#EDE8DF]/60 transition-colors cursor-pointer space-y-3"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="audio/*,.mp3,.m4a,.wav,.txt,.json"
                    className="hidden" 
                  />
                  <Mic className="w-8 h-8 text-purple-900 mx-auto" />
                  
                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-emerald-800 bg-emerald-100 py-1.5 px-4 rounded-full inline-block">
                        🎵 Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </p>
                      {audioPreviewUrl && (
                        <div className="pt-2" onClick={e => e.stopPropagation()}>
                          <audio controls src={audioPreviewUrl} className="w-full max-w-md mx-auto h-9" />
                        </div>
                      )}
                      <p className="text-[10px] text-dark/50">Click to pick a different audio file</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-dark/80">
                        {language === 'EN' ? 'Click to Browse or Drag & Drop Plaud Audio Recording' : 'Klik om Lokaal Audio Bestand te Kiezen van Computer'}
                      </p>
                      <p className="text-[10px] text-dark/50 font-mono">Supports .mp3, .m4a, .wav, .txt (Max 50MB)</p>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2 bg-purple-900 text-white text-xs font-bold rounded-xl hover:bg-purple-950 transition-colors shadow-xs"
                      >
                        📂 {language === 'EN' ? 'Browse Audio File from Computer...' : 'Kies Bestand van Computer...'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleAnalyzeMeeting}
                  disabled={isAnalyzing}
                  className="bg-purple-900 hover:bg-purple-950 text-white font-bold w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      {language === 'EN' ? 'AI Analyzing Speech...' : 'AI Analyseert Spraak...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      {language === 'EN' ? 'Analyze Meeting with AI' : 'Analyseer Meeting met AI'}
                    </span>
                  )}
                </Button>
              </div>

              {/* AI Analysis Result Output */}
              {analysisResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-3 border-t border-[#D6CFC2]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Decisions */}
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5">
                      <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-700" /> Key Decisions (Besluiten)
                      </h4>
                      <ul className="space-y-1 text-[11px] text-emerald-950 font-body">
                        {analysisResult.decisions.map((d, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl space-y-1.5">
                      <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-blue-700" /> Client Requirements (Eisen)
                      </h4>
                      <ul className="space-y-1 text-[11px] text-blue-950 font-body">
                        {analysisResult.requirements.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Auto Generated Tasks preview */}
                  <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-amber-700" /> Auto-Extracted Tasks ({analysisResult.tasks.length})
                    </h4>

                    <div className="space-y-2">
                      {analysisResult.tasks.map((tsk, i) => (
                        <div key={i} className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs flex justify-between items-center gap-2">
                          <div>
                            <p className="font-bold text-dark">{tsk.title}</p>
                            <p className="text-[10px] text-dark/60">Gekoppeld: {tsk.linkedId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900">
                              👤 {tsk.assignee}
                            </span>
                            <Badge variant={tsk.priority === 'High' ? 'danger' : 'warning'} className="text-[9px]">
                              {tsk.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button onClick={handleImportAITasks} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 mt-2">
                      🚀 {language === 'EN' ? 'Import Extracted Tasks to Board' : 'Geïmporteerde AI Taken Toevoegen Aan Board'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter Tabs & Search */}
      <Card p="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-body transition-all ${
                activeTab === 'All' ? 'bg-primary text-cream shadow-xs' : 'bg-[#EDE8DF]/60 text-dark/70 hover:bg-[#EDE8DF]'
              }`}
            >
              {language === 'EN' ? `All Tasks (${tasks.length})` : `Alle Taken (${tasks.length})`}
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-body transition-all ${
                activeTab === 'Pending' ? 'bg-primary text-cream shadow-xs' : 'bg-[#EDE8DF]/60 text-dark/70 hover:bg-[#EDE8DF]'
              }`}
            >
              {language === 'EN' ? `Pending (${tasks.filter(t => !t.completed).length})` : `Openstaand (${tasks.filter(t => !t.completed).length})`}
            </button>
            <button
              onClick={() => setActiveTab('Completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-body transition-all ${
                activeTab === 'Completed' ? 'bg-primary text-cream shadow-xs' : 'bg-[#EDE8DF]/60 text-dark/70 hover:bg-[#EDE8DF]'
              }`}
            >
              {language === 'EN' ? `Completed (${tasks.filter(t => t.completed).length})` : `Afgerond (${tasks.filter(t => t.completed).length})`}
            </button>
          </div>

          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input
              type="text"
              placeholder={language === 'EN' ? 'Search by task or linked project...' : 'Zoek op taak of gekoppeld project...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#EDE8DF]/40 border border-[#D6CFC2] rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Tasks List Container */}
        <div className="space-y-3" key={`tasks-list-container-${tasks.length}`}>
          {filteredTasks.map((task) => (
            <motion.div
              key={`task-card-v3-${task.id}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all space-y-3 w-full overflow-hidden ${
                task.completed
                  ? 'bg-gray-50/70 border-gray-200 text-dark/50'
                  : 'bg-white border-[#D6CFC2] hover:border-primary/50 shadow-xs'
              }`}
            >
              {/* Top Section: Checkbox + Title (Full Width) */}
              <div className="flex items-start gap-3 w-full min-w-0">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="text-primary hover:scale-110 transition-transform flex-shrink-0 mt-0.5"
                  title={task.completed ? "Markeer als onafgerond" : "Markeer als afgerond"}
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  ) : (
                    <Square className="w-5 h-5 text-dark/40 hover:text-primary" />
                  )}
                </button>

                <div className="flex-1 min-w-0 text-left w-full">
                  <p className={`font-semibold text-xs sm:text-sm leading-relaxed font-sans font-body whitespace-normal break-words block w-full text-left ${task.completed ? 'line-through text-dark/40' : 'text-dark'}`}>
                    {task.title}
                  </p>
                  {task.linkedId && (
                    <p className="text-[10px] text-primary/80 flex items-center gap-1 mt-1 font-semibold whitespace-normal break-words">
                      <LinkIcon className="w-3 h-3 text-accent flex-shrink-0" /> Gekoppeld aan: {task.linkedId}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Section: Badges & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#D6CFC2]/40 w-full min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleToggleAssignee(task.id)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                    title={language === 'NL' ? 'Klik om te wisselen tussen Tim & Bram' : 'Click to toggle assignee'}
                  >
                    <User className="w-3 h-3 text-purple-700" />
                    {task.assignedTo || 'Tim'}
                  </button>
                  <Badge variant={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'} className="text-[9px]">
                    {task.priority || 'Normal'}
                  </Badge>
                  <span className="text-[10px] text-dark/60 font-mono flex items-center gap-1 bg-[#EDE8DF]/60 px-2 py-0.5 rounded">
                    <Calendar className="w-3 h-3 text-dark/40" /> {task.dueDate}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(task)}
                    className="p-1.5 text-dark/50 hover:text-primary hover:bg-[#EDE8DF]/60 rounded-md transition-colors"
                    title="Bewerken"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id, task.title)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="Verwijderen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-xs text-dark/40 italic">
              {language === 'EN' ? 'No tasks found in this overview.' : 'Geen taken gevonden in dit overzicht.'}
            </div>
          )}
        </div>
      </Card>

      {/* CREATE / EDIT TASK MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">
                  {selectedTask 
                    ? (language === 'EN' ? 'Edit Task' : 'Taak Bewerken') 
                    : (language === 'EN' ? 'Create New Task' : 'Nieuwe Taak Aanmaken')}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">
                    {language === 'EN' ? 'Task Description / Title' : 'Taak Omschrijving / Titel'}
                  </label>
                  <input type="text" required value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder={language === 'EN' ? 'e.g. Call client for quote approval' : 'bijv. Bellen met klant voor offerte accoord'} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Link Type' : 'Koppel Type'}
                    </label>
                    <select value={form.linkedType} onChange={e => setForm(prev => ({ ...prev, linkedType: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                      <option value="Project">{language === 'EN' ? 'Project' : 'Oplever Project'}</option>
                      <option value="Lead">{language === 'EN' ? 'Lead' : 'Klant Lead'}</option>
                      <option value="None">{language === 'EN' ? 'No Link' : 'Geen Koppeling'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Select Linked Item' : 'Selecteer Gekoppelde Item'}
                    </label>
                    {form.linkedType === 'Project' ? (
                      <select value={form.linkedId} onChange={e => setForm(prev => ({ ...prev, linkedId: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                        {projectsList.map((p, idx) => (
                          <option key={idx} value={`${p.id} (${p.name})`}>{p.id} - {p.name}</option>
                        ))}
                      </select>
                    ) : form.linkedType === 'Lead' ? (
                      <select value={form.linkedId} onChange={e => setForm(prev => ({ ...prev, linkedId: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                        {leadsList.map((l, idx) => (
                          <option key={idx} value={`${l.name} (${l.city || 'Lead'})`}>{l.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" disabled value={language === 'EN' ? 'General Task' : 'Algemene Taak'} className="w-full px-3 py-2 bg-[#EDE8DF] text-dark/40 border border-[#D6CFC2] rounded-lg font-semibold" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Priority' : 'Prioriteit'}
                    </label>
                    <select value={form.priority} onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold">
                      <option value="High">🔴 {language === 'EN' ? 'High' : 'Hoog (High)'}</option>
                      <option value="Medium">🟡 {language === 'EN' ? 'Medium' : 'Gemiddeld (Medium)'}</option>
                      <option value="Low">🟢 {language === 'EN' ? 'Low' : 'Laag (Low)'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">
                      {language === 'EN' ? 'Due Date' : 'Vervaldatum (Due Date)'}
                    </label>
                    <input type="date" value={form.dueDate} onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">{language === 'EN' ? 'Save' : 'Opslaan'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
