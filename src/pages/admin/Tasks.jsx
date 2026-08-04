import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, CheckSquare, Square, Trash2, Edit2, X, CheckCircle, Clock, Link as LinkIcon, Filter, Search, Calendar } from 'lucide-react';
import { mockProjects, mockLeads, mockTasks } from '../../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function Tasks() {
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  
  // Filter & Search State
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Pending' | 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    linkedType: 'Project', // 'Project' | 'Lead' | 'None'
    linkedId: '',
    priority: 'Medium', // 'High' | 'Medium' | 'Low'
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false
  });

  const translateTaskText = (str) => {
    if (language !== 'EN' || !str) return str;
    return str
      .replace(/Inmeten buitenkeuken bij Jan de Vries/g, 'Measure outdoor kitchen for John Miller')
      .replace(/Inmeten buitenkeuken bij John Miller/g, 'Measure outdoor kitchen for John Miller')
      .replace(/Kleurstalen opsturen naar Sophie Bakken/g, 'Send color samples to Sophia Taylor')
      .replace(/Kleurstalen opsturen naar Sophia Taylor/g, 'Send color samples to Sophia Taylor')
      .replace(/Offerte Q-4003 nabellen \(Mark de Boer\)/g, 'Follow up on Quote Q-4003 (Mark Davis)')
      .replace(/Offerte Q-4003 nabellen \(Mark Davis\)/g, 'Follow up on Quote Q-4003 (Mark Davis)')
      .replace(/Exclusieve Buitenkeuken - Maatwerk/g, 'Exclusive Outdoor Kitchen - Custom Build')
      .replace(/Exclusieve Buitenkeuken/g, 'Exclusive Outdoor Kitchen')
      .replace(/Luxe Teak Buitenkeuken 4m/g, 'Luxury Teak Outdoor Kitchen 4m')
      .replace(/Kliko Ombouw Triple Antraciet/g, 'Bin Storage Triple Anthracite')
      .replace(/Eiken Houten Overkapping 6x4m/g, 'Oak Wooden Canopy 6x4m')
      .replace(/Jan de Vries/g, 'John Miller')
      .replace(/Sophie Bakken/g, 'Sophia Taylor')
      .replace(/Mark de Boer/g, 'Mark Davis')
      .replace(/Anouk Visser/g, 'Emma Wilson');
  };

  const defaultMockTasks = (mockTasks || []).map(t => ({
    id: t.id,
    title: t.title,
    linkedType: 'Project',
    linkedId: `P-${t.id} (${t.project})`,
    priority: t.priority === 'Hoog' ? 'High' : t.priority,
    dueDate: t.dueDate,
    completed: t.status === 'Voltooid'
  }));

  // Load Initial Data
  useEffect(() => {
    const savedTasks = localStorage.getItem('app_tasks_v2');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) setTasks(parsed);
        else setTasks(defaultMockTasks);
      } catch (e) { setTasks(defaultMockTasks); }
    } else {
      setTasks(defaultMockTasks);
      localStorage.setItem('app_tasks_v2', JSON.stringify(defaultMockTasks));
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

  const saveTasksToStorage = (updated) => {
    localStorage.setItem('app_tasks_v2', JSON.stringify(updated));
    localStorage.setItem('app_tasks', JSON.stringify(updated));
    window.dispatchEvent(new Event('app_data_changed'));
  };

  // Toggle Task Checkbox completion
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        showToast(nextState ? (language === 'EN' ? 'Task marked as completed! ✅' : `Taak "${t.title}" gemarkeerd als afgerond! ✅`) : (language === 'EN' ? 'Task status reset.' : `Taak status teruggezet.`));
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const handleDeleteTask = (id, title) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasksToStorage(updated);
    showToast(language === 'EN' ? 'Task deleted.' : `Taak verwijderd.`);
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
    saveTasksToStorage(updatedList);
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
        <Button icon={Plus} onClick={handleOpenAddModal}>
          {language === 'EN' ? '+ Add New Task' : 'Nieuwe Taak Toevoegen'}
        </Button>
      </div>

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
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-gray-50/70 border-gray-200 text-dark/50'
                  : 'bg-white border-[#D6CFC2] hover:border-primary/50 shadow-xs'
              }`}
            >
              {/* Checkbox Toggle + Title */}
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="text-primary hover:scale-110 transition-transform flex-shrink-0 mt-0.5 sm:mt-0"
                  title={task.completed ? "Markeer als onafgerond" : "Markeer als afgerond"}
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  ) : (
                    <Square className="w-5 h-5 text-dark/40 hover:text-primary" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <h4 className={`font-bold text-xs ${task.completed ? 'line-through text-dark/40' : 'text-dark'}`}>
                    {translateTaskText(task.title)}
                  </h4>
                  {task.linkedId && (
                    <p className="text-[10px] text-primary/80 flex items-center gap-1 mt-0.5 font-semibold">
                      <LinkIcon className="w-3 h-3 text-accent flex-shrink-0" /> {language === 'EN' ? 'Linked to' : 'Gekoppeld aan'}: {translateTaskText(task.linkedId)}
                    </p>
                  )}
                </div>
              </div>

              {/* Priority + Due Date + Actions */}
              <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D6CFC2]/40">
                <Badge variant={(task.priority === 'High' || task.priority === 'Hoog') ? 'danger' : task.priority === 'Medium' ? 'warning' : 'default'} className="text-[9px]">
                  {language === 'EN' 
                    ? ((task.priority === 'Hoog' || task.priority === 'High') ? 'High' : task.priority === 'Medium' ? 'Medium' : 'Low')
                    : task.priority}
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
