import React, { useState } from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, Plus, Filter, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const INITIAL_EVENTS = [];

export default function PartnerPlanning() {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [filterType, setFilterType] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-07-22');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', client: '', location: '', time: '10:00 - 11:30', type: 'Site Visit' });

  const toggleEventStatus = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'Completed' ? 'Upcoming' : 'Completed' } : e));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;
    setEvents(prev => [
      ...prev,
      { id: Date.now(), ...newEvent, date: selectedDate, status: 'Upcoming' }
    ]);
    setShowAddModal(false);
    setNewEvent({ title: '', client: '', location: '', time: '10:00 - 11:30', type: 'Site Visit' });
  };

  const filteredEvents = filterType === 'All' 
    ? events 
    : events.filter(e => e.type === filterType || e.status === filterType);

  const filterTabs = [
    { key: 'All', label: language === 'NL' ? 'Alles' : 'All' },
    { key: 'Site Visit', label: language === 'NL' ? 'Locatiebezoek' : 'Site Visit' },
    { key: 'Delivery', label: language === 'NL' ? 'Oplevering' : 'Delivery' },
    { key: 'Assembly', label: language === 'NL' ? 'Montage' : 'Assembly' },
    { key: 'Upcoming', label: language === 'NL' ? 'Aankomend' : 'Upcoming' },
    { key: 'Completed', label: language === 'NL' ? 'Afgerond' : 'Completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'NL' ? 'Planning & Agenda' : 'Planning & Agenda'}
          </h2>
          <p className="text-dark/50 text-sm font-body">
            {language === 'NL' ? 'Beheer uw wekelijkse planning, locatiebezoeken en montages.' : 'Manage your weekly schedule, site visits, and installations.'}
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          {language === 'NL' ? 'Planningstaak Toevoegen' : 'Add Schedule Task'}
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-l-4 border-l-primary" noPadding>
          <div className="flex justify-between items-center px-4 py-2.5">
            <div>
              <p className="text-[11px] text-dark/50 font-body uppercase font-semibold tracking-wider">
                {language === 'NL' ? 'TOTAAL INGEPLAND' : 'Total Scheduled'}
              </p>
              <p className="text-xl font-heading font-bold text-dark mt-0.5">{events.length}</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-accent" noPadding>
          <div className="flex justify-between items-center px-4 py-2.5">
            <div>
              <p className="text-[11px] text-dark/50 font-body uppercase font-semibold tracking-wider">
                {language === 'NL' ? 'AANKOMENDE TAKEN' : 'Upcoming Tasks'}
              </p>
              <p className="text-xl font-heading font-bold text-dark mt-0.5">{events.filter(e => e.status === 'Upcoming').length}</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-600" noPadding>
          <div className="flex justify-between items-center px-4 py-2.5">
            <div>
              <p className="text-[11px] text-dark/50 font-body uppercase font-semibold tracking-wider">
                {language === 'NL' ? 'AFGEROND' : 'Completed'}
              </p>
              <p className="text-xl font-heading font-bold text-dark mt-0.5">{events.filter(e => e.status === 'Completed').length}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 text-green-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Calendar & Agenda list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#EDE8DF] p-3 rounded-xl border border-[#D6CFC2]">
            <div className="flex items-center gap-2 text-xs font-body font-medium text-dark/60">
              <Filter className="w-3.5 h-3.5" />
              <span>{language === 'NL' ? 'Filter:' : 'Filter:'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filterTabs.map(ft => (
                <button
                  key={ft.key}
                  onClick={() => setFilterType(ft.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-body transition-all ${
                    filterType === ft.key 
                      ? 'bg-primary text-cream font-medium shadow-sm' 
                      : 'bg-white/80 text-dark/70 hover:bg-white'
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <Card className="text-center py-8 text-dark/40 text-xs font-body">
                {language === 'NL' ? 'Geen taken gevonden voor dit filter.' : 'No tasks matching this filter.'}
              </Card>
            ) : (
              filteredEvents.map(event => (
                <Card key={event.id} className="hover:border-primary/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleEventStatus(event.id)}
                        className="mt-0.5 text-primary hover:text-primary-dark transition-colors"
                      >
                        {event.status === 'Completed' 
                          ? <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-100" />
                          : <Circle className="w-5 h-5 text-dark/30" />
                        }
                      </button>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-heading font-bold text-sm text-dark ${event.status === 'Completed' ? 'line-through text-dark/40' : ''}`}>
                            {event.title}
                          </h4>
                          <Badge variant={event.type === 'Site Visit' ? 'warning' : event.type === 'Delivery' ? 'primary' : 'success'}>
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dark/60 font-body">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-accent" /> {event.client}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent" /> {event.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" /> {event.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] font-mono font-semibold px-2.5 py-1 bg-cream-dark/60 rounded-md text-dark/70">
                        {event.date}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Calendar Sidebar Widget */}
        <div className="space-y-5">
          <Card title={language === 'NL' ? 'juli 2026 Kalender' : 'July 2026 Calendar'}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-body font-bold text-dark px-1">
                <span>{language === 'NL' ? 'juli 2026' : 'July 2026'}</span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-cream-dark rounded"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-cream-dark rounded"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-body text-dark/40 uppercase font-semibold">
                {language === 'NL' ? (
                  <><span>Ma</span><span>Di</span><span>Wo</span><span>Do</span><span>Vr</span><span>Za</span><span>Zo</span></>
                ) : (
                  <><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></>
                )}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-body">
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
                  const isSelected = selectedDate === dateStr;
                  const hasEvent = events.some(e => e.date === dateStr);

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-8 rounded-lg flex flex-col items-center justify-center relative transition-all ${
                        isSelected 
                          ? 'bg-primary text-cream font-bold shadow-sm' 
                          : 'hover:bg-cream-dark text-dark'
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvent && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-primary'} absolute bottom-1`}></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#EDE8DF] border border-[#D6CFC2] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-lg font-heading font-bold text-primary">
              {language === 'NL' ? 'Nieuwe Planningstaak Toevoegen' : 'Add New Planning Task'}
            </h3>
            <form onSubmit={handleAddEvent} className="space-y-3 font-body text-xs">
              <div>
                <label className="block text-dark/70 font-semibold mb-1">Task Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Site Visit & Measurement" 
                  value={newEvent.title}
                  onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-[#D6CFC2] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-dark"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-dark/70 font-semibold mb-1">Client Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kees Janssen" 
                    value={newEvent.client}
                    onChange={e => setNewEvent(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-[#D6CFC2] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-dark"
                  />
                </div>
                <div>
                  <label className="block text-dark/70 font-semibold mb-1">Task Type</label>
                  <select
                    value={newEvent.type}
                    onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-[#D6CFC2] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-dark"
                  >
                    <option value="Site Visit">Site Visit</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Assembly">Assembly</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-dark/70 font-semibold mb-1">Location Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. Amsterdam Outskirts 12" 
                  value={newEvent.location}
                  onChange={e => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-[#D6CFC2] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-dark"
                />
              </div>
              <div>
                <label className="block text-dark/70 font-semibold mb-1">Time Window</label>
                <input 
                  type="text" 
                  value={newEvent.time}
                  onChange={e => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-[#D6CFC2] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-dark"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Add Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
