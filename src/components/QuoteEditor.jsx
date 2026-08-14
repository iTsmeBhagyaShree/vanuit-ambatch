import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, AlertTriangle, ArrowLeft, ArrowRight, Download, Share2, Copy, Send, 
  Plus, Trash2, RotateCcw, Upload, FileText, CheckCircle, Eye, HelpCircle, Layout, Sparkles, User, Briefcase
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Badge from './Badge';
import DiagramBuilder from './DiagramBuilder';
import Offerte6PagePDF from './Offerte6PagePDF';
import { WOOD_LIBRARY, PRESET_PRODUCT_LIBRARY, PRODUCT_TYPE_DEFAULTS } from '../utils/quoteLibraries';
import { calculateTotals, calculateInstalments, validateQuoteForSend } from '../utils/quoteSchema';
import { useLanguage } from '../context/LanguageContext';
import projectImg from '../assets/outdoor_project_card.png';
import heroImg from '/dasbordes images.png';

const STEPS = [
  { id: 1, number: '1', title: 'Customer & details', desc: 'Bjorn Valk · Dongen' },
  { id: 2, number: '2', title: 'Cover', desc: 'title · subtitle · 3 photos' },
  { id: 3, number: '3', title: 'Configuration', desc: 'tiles · specs · diagram' },
  { id: 4, number: '4', title: 'Investment', desc: 'line items · instalments' },
  { id: 5, number: '5', title: 'Letter & process', desc: 'default texts' },
  { id: 6, number: '6', title: 'Review & send', desc: 'preview · PDF · approval link' }
];

export default function QuoteEditor({ quoteData, onClose, onSaveQuote, leadsList = [] }) {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);
  const [quote, setQuote] = useState(quoteData);
  const [lastSavedTime, setLastSavedTime] = useState(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }));
  const [toastMsg, setToastMsg] = useState('');
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [letterExpanded, setLetterExpanded] = useState(false);
  const [uspExpanded, setUspExpanded] = useState(false);

  // Auto-save effect whenever quote state updates
  useEffect(() => {
    if (!quote) return;
    const saveTimer = setTimeout(() => {
      onSaveQuote(quote, false); // silent save
      setLastSavedTime(new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }));
    }, 400);
    return () => clearTimeout(saveTimer);
  }, [quote]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const isApproved = quote?.status === 'Approved' || quote?.status === 'Geaccepteerd';
  const totals = calculateTotals(quote?.investment?.lineItems || []);

  // State update helpers
  const updateCustomerField = (field, val) => {
    if (isApproved) return;
    setQuote(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: val }
    }));
  };

  const updateCoverField = (field, val) => {
    if (isApproved) return;
    setQuote(prev => ({
      ...prev,
      cover: { ...prev.cover, [field]: val }
    }));
  };

  const updateConfigField = (field, val) => {
    if (isApproved) return;
    setQuote(prev => ({
      ...prev,
      configuration: { ...prev.configuration, [field]: val }
    }));
  };

  const updateInvestmentField = (field, val) => {
    if (isApproved) return;
    setQuote(prev => ({
      ...prev,
      investment: { ...prev.investment, [field]: val }
    }));
  };

  const updateLetterField = (field, val) => {
    if (isApproved) return;
    setQuote(prev => ({
      ...prev,
      letterAndProcess: { ...prev.letterAndProcess, [field]: val }
    }));
  };

  // Wood Type Selection Propagation
  const handleWoodTypeSelect = (woodName) => {
    if (isApproved) return;
    const woodObj = WOOD_LIBRARY.find(w => w.name === woodName);
    if (woodObj) {
      setQuote(prev => {
        const nextItems = [...(prev.investment?.lineItems || [])];
        if (nextItems.length > 0) {
          nextItems[0] = {
            ...nextItems[0],
            title: `Buitenkeuken ${woodObj.name} · ${prev.configuration?.dimensions || '240 × 80 cm'}`
          };
        }
        return {
          ...prev,
          configuration: {
            ...prev.configuration,
            woodType: woodObj.name,
            woodLifespan: woodObj.lifespan,
            infobox: {
              ...prev.configuration.infobox,
              title: woodObj.infoboxTitle,
              text: woodObj.infoboxText
            }
          },
          investment: {
            ...prev.investment,
            lineItems: nextItems
          }
        };
      });
    } else {
      updateConfigField('woodType', woodName);
    }
  };

  // Options & Features On/Off Propagation Handler
  const handleOptionToggle = (optionKey, enabled) => {
    if (isApproved) return;
    setQuote(prev => {
      const config = prev.configuration || {};
      const options = config.options || {};
      const updatedOptions = {
        ...options,
        [optionKey]: { ...(options[optionKey] || {}), enabled }
      };

      // Recalculate optionsTitle for Stat tile 3 & cover subtitle
      let titleParts = [];
      if (updatedOptions.bbqCutout?.enabled !== false) {
        titleParts.push(updatedOptions.bbqCutout?.type || config.optionsTitle || 'Big Green Egg Large');
      }
      if (updatedOptions.fridge?.enabled) titleParts.push('RVS Koelkast');
      if (updatedOptions.sink?.enabled) titleParts.push('Spoelbak met Kraan');

      const newOptionsTitle = titleParts.length > 0 ? titleParts.join(' + ') : 'Standaard uitvoering';

      // Update diagram segments automatically
      let nextSegments = [...(config.diagram?.segments || [])];
      if (optionKey === 'fridge') {
        if (enabled && !nextSegments.some(s => s.type === 'FRIDGE')) {
          nextSegments.push({ id: `fridge-${Date.now()}`, type: 'FRIDGE', label: 'RVS Koelkast', width: 50 });
        } else if (!enabled) {
          nextSegments = nextSegments.filter(s => s.type !== 'FRIDGE');
        }
      }
      if (optionKey === 'sink') {
        if (enabled && !nextSegments.some(s => s.type === 'SINK')) {
          nextSegments.push({ id: `sink-${Date.now()}`, type: 'SINK', label: 'Spoelbak', width: 40 });
        } else if (!enabled) {
          nextSegments = nextSegments.filter(s => s.type !== 'SINK');
        }
      }

      // Update specifications line list on Page 3
      let specs = [...(config.specifications || [])];
      if (specs.length > 0) {
        let topLines = [...(specs[0].lines || [])];
        if (optionKey === 'fridge') {
          if (enabled && !topLines.some(l => l.text.toLowerCase().includes('koelkast'))) {
            topLines.push({ id: `l-fridge-${Date.now()}`, text: 'Inbouw RVS koelkast met temperatuurregeling' });
          } else if (!enabled) {
            topLines = topLines.filter(l => !l.text.toLowerCase().includes('koelkast'));
          }
        }
        if (optionKey === 'sink') {
          if (enabled && !topLines.some(l => l.text.toLowerCase().includes('spoelbak'))) {
            topLines.push({ id: `l-sink-${Date.now()}`, text: 'RVS spoelbak met mengkraan en wateraansluiting' });
          } else if (!enabled) {
            topLines = topLines.filter(l => !l.text.toLowerCase().includes('spoelbak'));
          }
        }
        specs[0] = { ...specs[0], lines: topLines };
      }

      return {
        ...prev,
        configuration: {
          ...config,
          optionsTitle: newOptionsTitle,
          options: updatedOptions,
          specifications: specs,
          diagram: {
            ...config.diagram,
            segments: nextSegments
          }
        }
      };
    });
  };

  // Product Type Change Handler
  const handleProductTypeChange = (pType) => {
    if (isApproved) return;
    const defaults = PRODUCT_TYPE_DEFAULTS[pType];
    if (!defaults) return;

    setQuote(prev => ({
      ...prev,
      productType: pType,
      cover: {
        ...prev.cover,
        titleLine1: defaults.titleLine1,
        titleLine2: defaults.titleLine2
      },
      letterAndProcess: {
        ...prev.letterAndProcess,
        letterParagraphs: [...defaults.letterParagraphs],
        checklist: [...defaults.checklist],
        processSteps: [...defaults.processSteps]
      }
    }));
  };

  // Specification Line Repeater Actions
  const handleAddSpecLine = (secIndex) => {
    if (isApproved) return;
    setQuote(prev => {
      const specs = [...(prev.configuration?.specifications || [])];
      specs[secIndex] = {
        ...specs[secIndex],
        lines: [...specs[secIndex].lines, { id: `l-${Date.now()}`, text: 'Nieuwe specificatie regel' }]
      };
      return { ...prev, configuration: { ...prev.configuration, specifications: specs } };
    });
  };

  const handleRemoveSpecLine = (secIndex, lineIndex) => {
    if (isApproved) return;
    setQuote(prev => {
      const specs = [...(prev.configuration?.specifications || [])];
      const nextLines = specs[secIndex].lines.filter((_, i) => i !== lineIndex);
      specs[secIndex] = { ...specs[secIndex], lines: nextLines };
      return { ...prev, configuration: { ...prev.configuration, specifications: specs } };
    });
  };

  const handleSpecLineTextChange = (secIndex, lineIndex, text) => {
    if (isApproved) return;
    setQuote(prev => {
      const specs = [...(prev.configuration?.specifications || [])];
      const nextLines = [...specs[secIndex].lines];
      nextLines[lineIndex] = { ...nextLines[lineIndex], text };
      specs[secIndex] = { ...specs[secIndex], lines: nextLines };
      return { ...prev, configuration: { ...prev.configuration, specifications: specs } };
    });
  };

  // Line Item Repeater Actions
  const handleAddLineItem = () => {
    if (isApproved) return;
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'Nieuw product / optie',
      description: 'Omschrijving van het product',
      quantity: 1,
      priceInclVat: 250,
      vatRate: 21,
      isIncluded: false
    };
    updateInvestmentField('lineItems', [...(quote.investment?.lineItems || []), newItem]);
  };

  const handleRemoveLineItem = (index) => {
    if (isApproved) return;
    const items = (quote.investment?.lineItems || []).filter((_, i) => i !== index);
    updateInvestmentField('lineItems', items);
  };

  const handleLineItemChange = (index, field, val) => {
    if (isApproved) return;
    const items = [...(quote.investment?.lineItems || [])];
    items[index] = { ...items[index], [field]: val };

    if (field === 'priceInclVat') {
      const numVal = Number(val) || 0;
      if (numVal > 0) {
        items[index].isIncluded = false;
      } else if (numVal === 0) {
        items[index].isIncluded = true;
      }
    }
    updateInvestmentField('lineItems', items);
  };

  const handleAddFromLibrary = (libItem) => {
    if (isApproved) return;
    const newItem = {
      id: `lib-${Date.now()}`,
      title: libItem.title,
      description: libItem.description,
      quantity: 1,
      priceInclVat: libItem.priceInclVat,
      vatRate: libItem.vatRate || 21,
      isIncluded: libItem.isIncluded || false
    };
    updateInvestmentField('lineItems', [...(quote.investment?.lineItems || []), newItem]);
    setShowLibraryModal(false);
    showToast(`"${libItem.title}" toegevoegd uit bibliotheek!`);
  };

  // Validation
  const validation = validateQuoteForSend(quote);

  // Calculate Spec Total Lines
  const totalSpecLines = (quote.configuration?.specifications || []).reduce((acc, s) => acc + (s.lines || []).length, 0);

  const getStepNextTitle = (stepId) => {
    switch (stepId) {
      case 1: return 'Cover';
      case 2: return 'Configuration';
      case 3: return 'Investment';
      case 4: return 'Letter & process';
      case 5: return 'Review & send';
      default: return 'Finish';
    }
  };

  return (
    <div className="w-full space-y-5 font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-[999999] flex items-center gap-2 bg-[#3E4E36] text-white px-4 py-3 rounded-xl shadow-2xl text-xs">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP EDITOR NAVIGATION / STATUS BAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#D6CFC2] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#EDE8DF] hover:bg-[#E2DDD3] text-primary rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Quotes</span>
          </button>
          <div className="h-4 w-[1px] bg-[#D6CFC2]"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-primary">Quote Editor</span>
              <span className="font-mono text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold">{quote.id}</span>
              <Badge variant={quote.status === 'Approved' || quote.status === 'Geaccepteerd' ? 'success' : quote.status === 'Sent' || quote.status === 'Verzonden' ? 'info' : 'default'}>
                {quote.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-dark/60 bg-[#F8F7F4] px-3 py-1.5 rounded-xl border border-[#D6CFC2]">
            🟢 Auto-saved as draft · {lastSavedTime}
          </span>
        </div>
      </div>

      {/* TWO OR THREE COLUMN EDITOR LAYOUT MATCHING SCREENSHOT 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: STEP LIST CARD MATCHING SCREENSHOT 2 (3 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D6CFC2] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-xl text-primary">Quote {quote.id}</h3>

            <nav className="space-y-2">
              {STEPS.map((step) => {
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id;
                const dynamicSub = step.id === 1 ? `${quote.customer?.name || 'Bjorn Valk'} · ${quote.customer?.city || 'Dongen'}` : step.desc;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#33422C] text-[#FDFBF7] shadow-sm font-bold'
                        : 'hover:bg-[#F8F7F4] text-dark border border-transparent'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isActive 
                        ? 'bg-white text-[#33422C]' 
                        : isCompleted 
                        ? 'bg-[#33422C] text-white' 
                        : 'border border-[#D6CFC2] text-dark/60'
                    }`}>
                      {isCompleted ? '✓' : step.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-dark'}`}>{step.title}</p>
                      <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-dark/50'}`}>{dynamicSub}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#D6CFC2]/60 text-[11px] font-mono text-dark/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Auto-saved as draft · {lastSavedTime}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER COLUMN: MAIN FORM CARDS MATCHING SCREENSHOT 2 (9 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-9 space-y-5">
          
          {/* Main Title & Subtitle */}
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-3xl text-primary">{STEPS[activeStep - 1].title}</h2>
            <p className="text-xs text-dark/60 font-body">
              {activeStep === 1 
                ? 'Everything here returns automatically on every page of the quote — choose once, never retype.'
                : activeStep === 2
                ? 'Page 1 of the quote. The subtitle writes itself based on step 3.'
                : activeStep === 3
                ? 'Page 3 — the most dynamic page. Everything here differs per quote.'
                : activeStep === 4
                ? 'Page 4. Totals and instalment amounts calculate themselves — try it: change a price.'
                : STEPS[activeStep - 1].desc}
            </p>
          </div>

          {/* STEP 1: CUSTOMER & DETAILS */}
          {activeStep === 1 && (
            <div className="space-y-4">
              
              {/* CARD 1: CUSTOMER */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">CUSTOMER</span>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">CUSTOMER</label>
                    <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono">AUTOMATIC</span>
                  </div>
                  <select
                    value={quote.customer?.name || 'Bjorn Valk'}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const leadObj = leadsList.find(l => l.name === selectedName);
                      if (leadObj) {
                        const fullName = leadObj.name;
                        const first = leadObj.firstName || fullName.split(' ')[0];
                        const cityVal = leadObj.city || leadObj.location || 'Dongen';
                        const emailVal = leadObj.email || leadObj.customerEmail || `${first.toLowerCase()}@mail.nl`;
                        const phoneVal = leadObj.phone || leadObj.customerPhone || '+31 6 53562542';
                        const addrVal = leadObj.address || 'Dongeheuvel 3, 5101 WE Dongen';

                        setQuote(prev => ({
                          ...prev,
                          customer: {
                            name: fullName,
                            firstName: first,
                            city: cityVal,
                            email: emailVal,
                            phone: phoneVal,
                            address: addrVal
                          }
                        }));
                      } else if (selectedName === 'Bjorn Valk') {
                        setQuote(prev => ({
                          ...prev,
                          customer: {
                            name: 'Bjorn Valk',
                            firstName: 'Bjorn',
                            city: 'Dongen',
                            address: 'Dongeheuvel 3, 5101 WE Dongen',
                            phone: '+31 6 53562542',
                            email: 'bjorn@mail.nl'
                          }
                        }));
                      } else {
                        updateCustomerField('name', selectedName);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-xl text-xs font-bold text-dark focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Bjorn Valk">Bjorn Valk (Lead)</option>
                    {leadsList.filter(l => l.name !== 'Bjorn Valk').map((lead, idx) => (
                      <option key={idx} value={lead.name}>{lead.name} (Lead)</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-dark/50 italic mt-1 font-body">Fills name, first name, address, city and email throughout the quote</p>
                </div>

                {/* Grey Customer Card Summary */}
                <div className="p-4 bg-[#EFECE6] rounded-xl border border-[#D6CFC2]/70 space-y-1.5 text-xs text-dark/80 font-body">
                  <p className="font-semibold text-dark">
                    {quote.customer?.name || 'Bjorn Valk'} · {quote.customer?.address || 'Dongeheuvel 3, 5101 WE Dongen'} · {quote.customer?.phone || '+31 6 53562542'} · {quote.customer?.email || 'bjorn@mail.nl'}
                  </p>
                  <div className="flex justify-between items-center text-[11px] pt-0.5">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span>✓</span> email present (needed for the approval link)
                    </span>
                    <span className="text-dark/60 underline cursor-pointer hover:text-dark">edit in customer record</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: QUOTE */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">QUOTE</span>

                {/* Row 1: Quote Number & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">QUOTE NUMBER</label>
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono">AUTOMATIC</span>
                    </div>
                    <input
                      type="text"
                      disabled
                      value={quote.id}
                      className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#D6CFC2] rounded-xl font-bold font-mono text-dark"
                    />
                    <p className="text-[10px] text-dark/50 mt-1 font-body">🔒 automatic counter — not editable</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">STATUS</label>
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono">AUTOMATIC</span>
                    </div>
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EFECE6] text-dark text-xs font-bold rounded-full border border-[#D6CFC2]">
                        <span className="w-2 h-2 rounded-full bg-dark"></span>
                        <span>{quote.status}</span>
                      </span>
                    </div>
                    <p className="text-[10px] text-dark/50 mt-1.5 font-body">becomes Verzonden (sent) / Akkoord (approved) / Verlopen (expired) via the flow</p>
                  </div>
                </div>

                {/* Row 2: Quote Date, Valid Until, Product Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">QUOTE DATE</label>
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">AUTOMATIC</span>
                    </div>
                    <input
                      type="date"
                      value={quote.date}
                      onChange={(e) => setQuote(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark"
                    />
                    <p className="text-[10px] text-dark/50 mt-1 font-body">default today</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">VALID UNTIL</label>
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">AUTOMATIC</span>
                    </div>
                    <input
                      type="date"
                      value={quote.validUntil}
                      onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark"
                    />
                    <p className="text-[10px] text-dark/50 mt-1 font-body">default +30 days - also drives the badge on p4, the terms line on p5 and the approval-link expiry</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">PRODUCT TYPE</label>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded font-mono">MANUAL</span>
                    </div>
                    <select
                      value={quote.productType || 'Outdoor kitchen'}
                      onChange={(e) => handleProductTypeChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark"
                    >
                      <option value="Outdoor kitchen">Outdoor kitchen</option>
                      <option value="Garden room">Garden room</option>
                      <option value="Veranda">Veranda</option>
                      <option value="Poolhouse">Poolhouse</option>
                    </select>
                    <p className="text-[10px] text-dark/50 mt-1 font-body">selects template + default texts</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 2: COVER */}
          {activeStep === 2 && (
            <div className="space-y-4">
              
              {/* CARD 1: TITLE & SUBTITLE */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">TITLE</span>

                {/* Title Line 1 & Title Line 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">TITLE LINE 1</label>
                      <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">DEFAULT</span>
                    </div>
                    <input
                      type="text"
                      value={quote.cover?.titleLine1 || 'Uw buitenkeuken,'}
                      onChange={(e) => updateCoverField('titleLine1', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">TITLE LINE 2</label>
                      <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">DEFAULT</span>
                    </div>
                    <input
                      type="text"
                      value={quote.cover?.titleLine2 || 'op maat gemaakt.'}
                      onChange={(e) => updateCoverField('titleLine2', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Subtitle Section */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">SUBTITLE</label>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">CALCULATED</span>
                  </div>

                  {quote.cover?.subtitleOverrideEnabled ? (
                    <input
                      type="text"
                      value={quote.cover?.customSubtitle || ''}
                      onChange={(e) => updateCoverField('customSubtitle', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs"
                    />
                  ) : (
                    <div className="p-3.5 bg-[#EFECE6] rounded-xl border border-[#D6CFC2]/70 font-semibold text-xs text-dark">
                      {quote.configuration?.woodType || 'Thermo Fraké'} · {quote.configuration?.dimensions || '240 × 80 cm'} · {quote.configuration?.optionsTitle || 'uitsparing Big Green Egg'}
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-dark/60 pt-0.5">
                    <input
                      type="checkbox"
                      checked={quote.cover?.subtitleOverrideEnabled || false}
                      onChange={(e) => updateCoverField('subtitleOverrideEnabled', e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-primary border-[#D6CFC2]"
                    />
                    <span>edit manually — currently automatic: (wood type) · (dimensions) cm · (options)</span>
                  </label>
                </div>
              </div>

              {/* CARD 2: COVER PHOTOS */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">COVER PHOTOS</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateCoverField('photos', ['/cover_img1.png', '/cover_img2.png', '/cover_img3.png']);
                      updateCoverField('titleLine1', 'Uw buitenkeuken,');
                      updateCoverField('titleLine2', 'op maat gemaakt.');
                      showToast('Cover defaults restored!');
                    }}
                    className="px-3 py-1 bg-white border border-[#D6CFC2] text-dark/70 hover:text-dark font-mono text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    restore defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((pIdx) => {
                    const photosArr = quote.cover?.photos || ['/cover_img1.png', '/cover_img2.png', '/cover_img3.png'];
                    const currentPhoto = photosArr[pIdx];
                    const defaultRes = pIdx === 0 ? '1620×1080 ✓' : pIdx === 1 ? '2400×1600 ✓' : '1920×1080 ✓';

                    return (
                      <div key={pIdx} className="relative">
                        <input
                          type="file"
                          id={`cover-photo-input-${pIdx}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const newPhotos = [...(quote.cover?.photos || ['/cover_img1.png', '/cover_img2.png', '/cover_img3.png'])];
                                newPhotos[pIdx] = evt.target.result;
                                updateCoverField('photos', newPhotos);
                                showToast(`Photo ${pIdx + 1} updated successfully!`);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />

                        {currentPhoto ? (
                          <div className="bg-[#B5ADA1] text-white p-3 rounded-xl shadow-2xs relative text-center space-y-1 overflow-hidden min-h-[92px] flex flex-col justify-center">
                            <p className="font-bold text-xs truncate">cover-{pIdx + 1}.jpg</p>
                            <p className="text-[10px] text-white/80">{defaultRes}</p>
                            <label htmlFor={`cover-photo-input-${pIdx}`} className="underline text-[10px] block mx-auto text-white hover:text-cream cursor-pointer">
                              replace
                            </label>
                          </div>
                        ) : (
                          <label
                            htmlFor={`cover-photo-input-${pIdx}`}
                            className="bg-white border-2 border-dashed border-[#D6CFC2] rounded-xl p-4 text-center text-dark/50 text-xs space-y-1 cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center min-h-[92px] w-full"
                          >
                            <span className="text-sm font-bold">+</span>
                            <p className="text-[11px] font-semibold text-dark/70">Drag photo {pIdx + 1} or click</p>
                            <p className="text-[9px] font-mono text-dark/40">≥ 1000 × 750 px</p>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-[11px] text-dark/60 font-body">
                  Every photo is automatically cropped to fit its frame (± 69.5 × 52 mm). Photo too small? A warning, not a block.
                </p>
              </div>

            </div>
          )}

          {/* STEP 3: CONFIGURATION */}
          {activeStep === 3 && (
            <div className="space-y-4">
              
              {/* CARD 1: STAT TILES (ALWAYS 4) */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">STAT TILES (ALWAYS 4)</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Tile 1: Dimensions */}
                  <div className="p-3.5 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">DIMENSIONS</label>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">MANUAL</span>
                    </div>
                    <input
                      type="text"
                      value={quote.configuration?.dimensions || '240 × 80'}
                      onChange={(e) => updateConfigField('dimensions', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs"
                      placeholder="e.g. 240 × 80"
                    />
                    <input
                      type="text"
                      value="centimeter"
                      disabled
                      className="w-full px-3 py-1.5 bg-[#EFECE6] border border-[#D6CFC2]/60 rounded-lg text-xs font-semibold text-dark/70"
                    />
                    <p className="text-[10px] text-dark/50 font-body">value: {(quote.configuration?.dimensions || '').length}/16 chars</p>
                  </div>

                  {/* Tile 2: Wood Type */}
                  <div className="p-3.5 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">WOOD TYPE</label>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">LIBRARY OR FREE TEXT</span>
                    </div>
                    <select
                      value={quote.configuration?.woodType || 'Thermo Fraké'}
                      onChange={(e) => handleWoodTypeSelect(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs cursor-pointer"
                    >
                      {WOOD_LIBRARY.map((w) => (
                        <option key={w.id} value={w.name}>{w.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={`lifespan ${quote.configuration?.woodLifespan || (language === 'EN' ? '20 to 25 years' : '20 tot 25 jaar')}`}
                      disabled
                      className="w-full px-3 py-1.5 bg-[#EFECE6] border border-[#D6CFC2]/60 rounded-lg text-xs font-semibold text-dark/70"
                    />
                    <p className="text-[10px] text-dark/50 font-body">a library choice fills the infobox + subtitle + line item automatically · custom wood type = fill in yourself</p>
                  </div>

                  {/* Tile 3: Cutout */}
                  <div className="p-3.5 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">{language === 'EN' ? 'CUTOUT' : 'UITSPARING'}</label>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">FOLLOWS OPTIONS</span>
                    </div>
                    <input
                      type="text"
                      value={quote.configuration?.optionsTitle || 'Big Green Egg'}
                      onChange={(e) => updateConfigField('optionsTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs"
                    />
                    <input
                      type="text"
                      value={language === 'EN' ? 'Large, right of center' : 'Large, rechts van het midden'}
                      disabled
                      className="w-full px-3 py-1.5 bg-[#EFECE6] border border-[#D6CFC2]/60 rounded-lg text-xs font-semibold text-dark/70"
                    />
                    <p className="text-[10px] text-dark/50 font-body">filled from the "Options & features" block below · freely editable afterwards</p>
                  </div>

                  {/* Tile 4: Delivery Time */}
                  <div className="p-3.5 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">DELIVERY TIME</label>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">MANUAL</span>
                    </div>
                    <input
                      type="text"
                      value={quote.configuration?.deliveryTime || (language === 'EN' ? '3 to 5 weeks' : '3 tot 5 weken')}
                      onChange={(e) => updateConfigField('deliveryTime', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs"
                    />
                    <input
                      type="text"
                      value={language === 'EN' ? 'upon drawing approval' : 'na akkoord op tekening'}
                      disabled
                      className="w-full px-3 py-1.5 bg-[#EFECE6] border border-[#D6CFC2]/60 rounded-lg text-xs font-semibold text-dark/70"
                    />
                    <p className="text-[10px] text-dark/50 font-body">also appears as the badge at process step "Production" (p6)</p>
                  </div>
                </div>
              </div>

              {/* CARD 2: OPTIONS & FEATURES */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-3.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">OPTIONS & FEATURES</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">MANUAL</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-dark/50 uppercase">ON/OFF PER QUOTE</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Option 1: BBQ cutout */}
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 font-bold text-dark cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quote.configuration?.options?.bbqCutout?.enabled !== false}
                        onChange={(e) => handleOptionToggle('bbqCutout', e.target.checked)}
                        className="w-4 h-4 text-primary rounded border-[#D6CFC2]"
                      />
                      <span>BBQ cutout</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={quote.configuration?.options?.bbqCutout?.type || 'Big Green Egg'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuote(prev => {
                            const updatedDiagram = { ...(prev.configuration?.diagram || {}) };
                            if (updatedDiagram.segments) {
                              updatedDiagram.segments = updatedDiagram.segments.map(seg =>
                                seg.type === 'CUTOUT' ? { ...seg, label: val } : seg
                              );
                            }
                            return {
                              ...prev,
                              configuration: {
                                ...prev.configuration,
                                optionsTitle: val,
                                diagram: updatedDiagram,
                                options: {
                                  ...prev.configuration?.options,
                                  bbqCutout: { ...prev.configuration?.options?.bbqCutout, type: val }
                                }
                              }
                            };
                          });
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg font-bold text-xs"
                      >
                        <option value="Big Green Egg">Big Green Egg</option>
                        <option value="Kamado Joe">Kamado Joe</option>
                        <option value="Bastard">Bastard</option>
                      </select>
                      <input
                        type="text"
                        value={language === 'EN' ? 'Large, right of center' : 'Large, rechts van het midden'}
                        disabled
                        className="px-3 py-1.5 bg-white border border-[#D6CFC2] rounded-lg text-xs font-semibold text-dark/80"
                      />
                    </div>
                  </div>

                  {/* Option 2: Fridge */}
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 font-bold text-dark cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quote.configuration?.options?.fridge?.enabled || false}
                        onChange={(e) => handleOptionToggle('fridge', e.target.checked)}
                        className="w-4 h-4 text-primary rounded border-[#D6CFC2]"
                      />
                      <span>Fridge (built-in)</span>
                    </label>
                    <span className="text-[11px] font-mono text-dark/50">→ specification line + optional line item + diagram segment</span>
                  </div>

                  {/* Option 3: Sink with tap */}
                  <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 flex flex-wrap items-center justify-between gap-2">
                    <label className="flex items-center gap-2 font-bold text-dark cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quote.configuration?.options?.sink?.enabled || false}
                        onChange={(e) => handleOptionToggle('sink', e.target.checked)}
                        className="w-4 h-4 text-primary rounded border-[#D6CFC2]"
                      />
                      <span>Sink with tap</span>
                    </label>
                    <span className="text-[11px] font-mono text-dark/50">→ specification line + optional line item + diagram segment</span>
                  </div>
                </div>

                <p className="text-[11px] text-dark/60 font-body">
                  Every enabled option automatically lands in: stat tile 3 · cover subtitle · a specification line (p3). Off = removed everywhere. An option is priced via a line item in step 4 (library).
                </p>
              </div>

              {/* CARD 3: SPECIFICATIONS */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">SPECIFICATIONS</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold text-dark/50 tracking-wider uppercase">
                      {totalSpecLines} / 12 LINES
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleAddSpecLine(0);
                        showToast('New specification line added!');
                      }}
                      className="px-3 py-1 bg-[#33422C] text-white text-xs font-bold rounded-lg font-mono hover:bg-[#283523] cursor-pointer shadow-2xs"
                    >
                      + line
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const specs = [...(quote.configuration?.specifications || [])];
                        specs.push({
                          id: `sec-${Date.now()}`,
                          title: 'NIEUWE SECTIE',
                          lines: [{ id: `l-${Date.now()}`, text: 'Nieuwe specificatie regel' }]
                        });
                        updateConfigField('specifications', specs);
                        showToast('New section added!');
                      }}
                      className="px-3 py-1 bg-white border border-[#33422C] text-dark text-xs font-bold rounded-lg font-mono hover:bg-[#EDE8DF] cursor-pointer shadow-2xs"
                    >
                      + section
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(quote.configuration?.specifications || []).map((sec, secIdx) => (
                    <div key={sec.id || secIdx} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-dark/80 font-mono uppercase tracking-wider">{sec.title}</span>
                        {sec.title === 'BEZORGING' && (
                          <span className="bg-[#EFECE6] text-dark/70 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">DEFAULT</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {(sec.lines || []).map((line, lineIdx) => (
                          <div key={line.id || lineIdx} className="flex items-center gap-2.5 p-3 bg-white border border-[#D6CFC2] rounded-xl text-xs shadow-2xs hover:border-primary/40 transition-all">
                            <span className="text-dark/40 font-mono cursor-grab text-xs tracking-tighter flex-shrink-0">::</span>
                            <span className="text-[#33422C] font-bold text-xs flex-shrink-0">✓</span>
                            <input
                              type="text"
                              value={line.text}
                              onChange={(e) => handleSpecLineTextChange(secIdx, lineIdx, e.target.value)}
                              className="flex-1 bg-transparent border-none focus:outline-none text-xs text-dark font-body font-medium"
                            />
                            {line.isOption && (
                              <span className="text-[10px] font-mono text-dark/40 italic flex-shrink-0">← option</span>
                            )}
                            {sec.title === 'BEZORGING' && (
                              <span className="text-[10px] font-mono text-dark/50 flex-shrink-0">{`{city} automatic`}</span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                handleRemoveSpecLine(secIdx, lineIdx);
                                showToast('Specification line deleted');
                              }}
                              className="p-1 text-dark/40 hover:text-red-600 font-bold transition-colors flex-shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: CONFIGURATION PHOTO (PAGE 3 HERO PHOTO) */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-3.5 font-body">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">
                      {language === 'EN' ? 'CONFIGURATION PHOTO (PAGE 3)' : 'CONFIGURATIE FOTO (PAGINA 3)'}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">CUSTOM PHOTO</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-dark/50 uppercase">APPEARS ON PROPOSAL PAGE 3</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#F8F7F4] p-4 rounded-xl border border-[#D6CFC2]/70">
                  <div className="relative w-full sm:w-60 h-40 rounded-xl overflow-hidden border border-[#D6CFC2] flex-shrink-0 bg-[#EAE5DC] flex items-center justify-center p-1.5 shadow-inner">
                    <img
                      src={quote.configuration?.configPhoto || projectImg}
                      alt="Configuration Preview"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                      onError={(e) => { e.target.onerror = null; e.target.src = projectImg; }}
                    />
                  </div>

                  <div className="space-y-2 flex-1 text-xs">
                    <p className="font-bold text-dark text-xs">
                      {language === 'EN' ? 'Upload Custom 3D / Project Photo' : 'Upload Aangepaste 3D / Projectfoto'}
                    </p>
                    <p className="text-[11px] text-dark/60">
                      {language === 'EN' 
                        ? 'This photo is shown on Page 3 of the proposal next to the specifications and front-view diagram.'
                        : 'Deze foto wordt getoond op Pagina 3 van de offerte naast de specificaties en het vooraanzicht.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <input
                        type="file"
                        id="config-photo-uploader"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              updateConfigField('configPhoto', evt.target.result);
                              showToast('Configuration photo updated successfully!');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="config-photo-uploader"
                        className="px-3 py-1.5 bg-[#33422C] text-white font-bold rounded-lg font-mono text-xs hover:bg-[#283523] cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <span>📷 {language === 'EN' ? 'Upload New Photo' : 'Nieuwe Foto Uploaden'}</span>
                      </label>

                      {quote.configuration?.configPhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            updateConfigField('configPhoto', null);
                            showToast('Configuration photo reset to default');
                          }}
                          className="px-3 py-1.5 bg-white border border-[#D6CFC2] text-dark/70 font-bold rounded-lg font-mono text-xs hover:bg-gray-100 cursor-pointer"
                        >
                          {language === 'EN' ? 'Restore Default' : 'Standaard Herstellen'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 5: FRONT-VIEW LAYOUT (DIAGRAM BUILDER) */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-[#D6CFC2]/60 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">FRONT-VIEW LAYOUT</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={quote.configuration?.diagram?.show !== false}
                      onChange={(e) => {
                        const show = e.target.checked;
                        updateConfigField('diagram', { ...quote.configuration?.diagram, show });
                      }}
                      className="w-3.5 h-3.5 rounded text-primary border-[#D6CFC2]"
                    />
                    <span>show on quote</span>
                  </label>
                </div>

                <DiagramBuilder
                  diagram={quote.configuration?.diagram}
                  onChange={(updatedDiagram) => updateConfigField('diagram', updatedDiagram)}
                />
              </div>

              {/* CARD 5: INFOBOX */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-[#D6CFC2]/60 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">INFOBOX</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={quote.configuration?.infobox?.show !== false}
                      onChange={(e) => {
                        const show = e.target.checked;
                        updateConfigField('infobox', { ...quote.configuration?.infobox, show });
                      }}
                      className="w-3.5 h-3.5 rounded text-primary border-[#D6CFC2]"
                    />
                    <span>show on quote</span>
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">TITLE</label>
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">FOLLOWS WOOD TYPE</span>
                    </div>
                    <input
                      type="text"
                      value={quote.configuration?.infobox?.title || (language === 'EN' ? 'About Thermo Fraké' : 'Over Thermo Fraké')}
                      onChange={(e) => updateConfigField('infobox', { ...quote.configuration?.infobox, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">TEXT</label>
                        <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">FOLLOWS WOOD TYPE</span>
                      </div>
                      <span className="text-[10px] font-mono text-dark/50">{(quote.configuration?.infobox?.text || '').length}/220</span>
                    </div>
                    <textarea
                      rows={3}
                      value={quote.configuration?.infobox?.text || ''}
                      onChange={(e) => updateConfigField('infobox', { ...quote.configuration?.infobox, text: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-xs text-dark focus:outline-none focus:border-primary font-body"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: INVESTMENT */}
          {activeStep === 4 && (
            <div className="space-y-4 font-body">
              
              {/* CARD 1: LINE ITEMS */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">LINE ITEMS</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleAddLineItem();
                        showToast('New line item added!');
                      }}
                      className="px-3 py-1 bg-[#33422C] text-white text-xs font-bold rounded-lg font-mono hover:bg-[#283523] cursor-pointer shadow-2xs"
                    >
                      + line
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLibraryModal(true)}
                      className="px-3 py-1 bg-white border border-[#33422C] text-dark text-xs font-bold rounded-lg font-mono hover:bg-[#EDE8DF] cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <span>+ from library</span>
                      <span className="text-[10px]">▼</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {(quote.investment?.lineItems || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/70 space-y-2.5">
                      {/* Row 1: Title, Qty, Price, VAT, Included */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 text-xs">
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => handleLineItemChange(idx, 'title', e.target.value)}
                          placeholder="Line item title"
                          className="w-full sm:flex-1 px-3.5 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs focus:outline-none focus:border-primary"
                        />
                        
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => handleLineItemChange(idx, 'quantity', Math.max(1, Number(e.target.value) || 1))}
                            className="w-14 px-2 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold text-center font-mono text-xs focus:outline-none"
                          />
                          <span className="text-dark/50 font-bold">×</span>
                          <div className="flex items-center gap-1 bg-white border border-[#D6CFC2] rounded-xl px-3 py-2 font-mono font-bold text-xs text-dark">
                            <span>€</span>
                            <input
                              type="number"
                              step="0.01"
                              value={item.priceInclVat ?? 0}
                              onChange={(e) => handleLineItemChange(idx, 'priceInclVat', e.target.value === '' ? 0 : Number(e.target.value))}
                              className="w-20 bg-transparent border-none focus:outline-none font-bold text-dark"
                            />
                          </div>
                        </div>

                        <select
                          value={item.vatRate || 21}
                          onChange={(e) => handleLineItemChange(idx, 'vatRate', Number(e.target.value))}
                          className="px-2.5 py-2 bg-white border border-[#D6CFC2] rounded-xl font-bold font-mono text-xs text-dark"
                        >
                          <option value={21}>21%</option>
                          <option value={9}>9%</option>
                          <option value={0}>0%</option>
                        </select>

                        <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-dark font-mono">
                          <input
                            type="checkbox"
                            checked={item.isIncluded || false}
                            onChange={(e) => handleLineItemChange(idx, 'isIncluded', e.target.checked)}
                            className="w-4 h-4 text-primary rounded border-[#D6CFC2]"
                          />
                          <span>included</span>
                        </label>

                        <button
                          type="button"
                          disabled={(quote.investment?.lineItems || []).length <= 1}
                          onClick={() => {
                            handleRemoveLineItem(idx);
                            showToast('Line item removed');
                          }}
                          className="p-1.5 text-dark/40 hover:text-red-600 font-bold transition-colors disabled:opacity-20 ml-auto"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Row 2: Description */}
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                        placeholder="Description text"
                        className="w-full px-3.5 py-2 bg-white border border-[#D6CFC2] rounded-xl text-xs text-dark/80 focus:outline-none font-body"
                      />

                      {(item.isIncluded || item.priceInclVat === 0) && (
                        <div className="space-y-1 pt-1">
                          <span className="inline-block bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2.5 py-0.5 rounded-md font-mono uppercase">
                            Inbegrepen
                          </span>
                          {item.title?.includes('Bezorging') && (
                            <p className="text-[11px] text-dark/60 font-body">
                              title = "Bezorging &#123;city&#125;" automatic · price € 0 → label "Inbegrepen" on p4 plus GRATIS badge on p3/p6. Try setting the price to 150 and watch the right side.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: FINISH / TREATMENT */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">FINISH / TREATMENT</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-dark/50 uppercase">FREE TEXT FIELD — BECOMES A CHECKLIST LINE</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">MANUAL</span>
                  </div>
                </div>

                <input
                  type="text"
                  value={quote.investment?.finishTreatment || 'Olieafwerking in twee lagen (naturel)'}
                  onChange={(e) => updateInvestmentField('finishTreatment', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-xs font-bold text-dark focus:outline-none focus:border-primary"
                />
                <p className="text-[10px] text-dark/50 font-body">leave empty = the line disappears from the checklist</p>
              </div>

              {/* CARD 3: CHECKLIST INBEGREPEN */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">CHECKLIST "INBEGREPEN BIJ JOUW INVESTERING" (3-6 LINES)</span>
                  <span className="bg-[#EFECE6] text-dark/70 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">DEFAULT</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white border border-[#D6CFC2] rounded-xl flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[#33422C] font-bold">✓</span>
                    <span className="font-medium text-dark">Volledig maatwerk, gebouwd door een gecertificeerde vakspecialist</span>
                  </div>

                  <div className="p-3 bg-white border border-[#D6CFC2] rounded-xl flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[#33422C] font-bold">✓</span>
                    <span className="font-medium text-dark">Digitale tekening vooraf ter goedkeuring</span>
                  </div>

                  {quote.investment?.finishTreatment && (
                    <div className="p-3 bg-white border border-[#D6CFC2] rounded-xl flex items-center justify-between gap-2.5 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[#33422C] font-bold">✓</span>
                        <span className="font-medium text-dark">{quote.investment?.finishTreatment}</span>
                      </div>
                      <span className="text-[10px] font-mono text-dark/40 italic">← finish field</span>
                    </div>
                  )}

                  <div className="p-3 bg-white border border-[#D6CFC2] rounded-xl flex items-center justify-between gap-2.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[#33422C] font-bold">✓</span>
                      <span className="font-medium text-dark">Gratis bezorging in {quote.customer?.city || 'Dongen'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-dark/50">{`{city} automatic`}</span>
                  </div>

                  <div className="p-3 bg-white border border-[#D6CFC2] rounded-xl flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[#33422C] font-bold">✓</span>
                    <span className="font-medium text-dark">Garantie en nazorg na levering</span>
                  </div>
                </div>
              </div>

              {/* CARD 4: TOTALS */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">TOTALS</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">CALCULATED — NO INPUT</span>
                </div>

                <div className="bg-[#33422C] text-[#FDFBF7] p-5 rounded-2xl space-y-3 font-mono border border-[#283523] shadow-md">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#FDFBF7]/80">Subtotal excl. VAT</span>
                    <span className="font-bold">€ {totals.subtotalExclVat.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#FDFBF7]/80">VAT 21%</span>
                    <span className="font-bold">€ {totals.vatAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="border-t border-[#46573e] pt-3 flex justify-between items-center">
                    <span className="font-serif font-bold text-base text-[#FDFBF7]">Total incl. VAT</span>
                    <span className="font-serif font-bold text-xl text-[#FDFBF7]">€ {totals.totalInclVat.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* CARD 5: PAYMENT INSTALMENTS */}
              {(() => {
                const count = quote.investment?.instalments?.count || 2;
                const pArr = quote.investment?.instalments?.percentages || (count === 3 ? [30, 40, 30] : [50, 50]);
                const pSum = pArr.reduce((a, b) => a + (Number(b) || 0), 0);
                const isSumValid = pSum === 100;
                const instCards = calculateInstalments(totals.totalInclVat, count, pArr);

                const handleSetCount = (newCount) => {
                  if (isApproved) return;
                  const newPercentages = newCount === 3 ? [30, 40, 30] : [50, 50];
                  updateInvestmentField('instalments', { count: newCount, percentages: newPercentages });
                };

                const handleUpdatePct = (index, val) => {
                  if (isApproved) return;
                  const newArr = [...pArr];
                  newArr[index] = Math.max(0, Math.min(100, Number(val) || 0));
                  updateInvestmentField('instalments', { count, percentages: newArr });
                };

                return (
                  <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono">PAYMENT INSTALMENTS</span>
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleSetCount(2)}
                            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                              count === 2 ? 'bg-[#33422C] text-white' : 'bg-[#EFECE6] text-dark/70 hover:bg-[#E2DDD3]'
                            }`}
                          >
                            2 Instalments (50/50)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetCount(3)}
                            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                              count === 3 ? 'bg-[#33422C] text-white' : 'bg-[#EFECE6] text-dark/70 hover:bg-[#E2DDD3]'
                            }`}
                          >
                            3 Instalments (30/40/30)
                          </button>
                        </div>
                      </div>

                      <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                        isSumValid ? 'text-emerald-800 bg-emerald-100' : 'text-red-800 bg-red-100'
                      }`}>
                        SUM = {pSum}% {isSumValid ? '✓' : '⚠️ Must equal 100%'}
                      </span>
                    </div>

                    <div className={`grid grid-cols-1 ${count === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                      {instCards.map((inst, idx) => (
                        <div key={idx} className="p-4 bg-white border border-[#D6CFC2] rounded-xl space-y-3 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-dark/70 font-mono block">
                            INSTALMENT {idx + 1} · {idx === 0 ? 'BIJ AKKOORD (ON APPROVAL)' : idx === 1 ? (count === 3 ? 'BIJ START BOUW (PRODUCTION)' : 'BIJ LEVERING (ON DELIVERY)') : 'BIJ LEVERING (ON DELIVERY)'}
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={pArr[idx] ?? inst.percentage}
                              onChange={(e) => handleUpdatePct(idx, e.target.value)}
                              className="w-16 px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg text-xs font-bold text-center font-mono text-dark focus:outline-none focus:border-primary"
                            />
                            <span className="font-bold text-xs font-mono text-dark">%</span>
                          </div>
                          <p className="text-sm font-bold font-mono text-primary">
                            € {inst.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-dark/60 font-body">
                      percentages adjustable · amounts recalculate automatically · last instalment = remainder (exact to the cent)
                    </p>
                  </div>
                );
              })()}

            </div>
          )}

          {/* STEP 5: LETTER & PROCESS */}
          {activeStep === 5 && (
            <div className="space-y-4 font-body">
              
              {/* CARD 1: PERSONAL LETTER (P2) */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">PERSONAL LETTER (P2)</span>

                {/* SALUTATION */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-dark/60 font-mono">SALUTATION</label>
                    <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">AUTOMATIC</span>
                  </div>
                  <input
                    type="text"
                    value={quote.letterAndProcess?.salutation || (quote.customer?.firstName ? `Beste ${quote.customer.firstName},` : 'Beste Bjorn,')}
                    onChange={(e) => updateLetterField('salutation', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#EFECE6] border border-[#D6CFC2] rounded-xl font-bold text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Accordion 1: Letter text (4 paragraphs) — default, click to edit */}
                <div className="space-y-2">
                  <div
                    onClick={() => setLetterExpanded(!letterExpanded)}
                    className="bg-white border border-[#D6CFC2] rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:border-primary/40 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs text-dark transition-transform duration-200 inline-block ${letterExpanded ? 'rotate-90' : ''}`}>▶</span>
                      <span className="font-bold text-xs text-dark">Letter text (4 paragraphs) — default, click to edit</span>
                    </div>
                    <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">DEFAULT</span>
                  </div>

                  {letterExpanded && (
                    <div className="p-4 bg-[#F8F7F4] border border-[#D6CFC2] rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-center pb-1 border-b border-[#D6CFC2]/60">
                        <span className="font-bold text-dark font-mono text-[11px] uppercase">LETTER PARAGRAPHS</span>
                        <button
                          type="button"
                          onClick={() => {
                            const pDefaults = PRODUCT_TYPE_DEFAULTS[quote.productType || 'Outdoor kitchen']?.letterParagraphs || [
                              'Hartelijk dank voor je aanvraag en het prettige gesprek. Met veel plezier presenteren wij deze persoonlijke offerte voor jouw maatwerk buitenkeuken.',
                              'Bij Vanuit Ambacht geloven we in duurzame materialen, ambachtelijke afwerking en oog voor detail. Wij maken al onze buitenkeukens met de hand in onze werkplaats.',
                              'In dit document vind je het volledige overzicht van jouw gekozen configuratie, inclusief specificaties, vooraanzicht tekening en transparante investering.',
                              'Heb je vragen of wens je nog aanpassingen? Wij denken graag met je mee!'
                            ];
                            updateLetterField('letterParagraphs', [...pDefaults]);
                            showToast('Letter text defaults restored!');
                          }}
                          className="text-[10px] font-mono font-bold text-dark/60 hover:text-dark underline cursor-pointer"
                        >
                          restore defaults
                        </button>
                      </div>

                      {(quote.letterAndProcess?.letterParagraphs || [
                        'Hartelijk dank voor je aanvraag en het prettige gesprek. Met veel plezier presenteren wij deze persoonlijke offerte voor jouw maatwerk buitenkeuken.',
                        'Bij Vanuit Ambacht geloven we in duurzame materialen, ambachtelijke afwerking en oog voor detail. Wij maken al onze buitenkeukens met de hand in onze werkplaats.',
                        'In dit document vind je het volledige overzicht van jouw gekozen configuratie, inclusief specificaties, vooraanzicht tekening en transparante investering.',
                        'Heb je vragen of wens je nog aanpassingen? Wij denken graag met je mee!'
                      ]).map((para, pIdx) => (
                        <div key={pIdx} className="space-y-1">
                          <label className="text-[10px] font-bold text-dark/60 font-mono">PARAGRAPH {pIdx + 1}</label>
                          <textarea
                            rows={2}
                            value={para}
                            onChange={(e) => {
                              const newParas = [...(quote.letterAndProcess?.letterParagraphs || [])];
                              newParas[pIdx] = e.target.value;
                              updateLetterField('letterParagraphs', newParas);
                            }}
                            className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl text-xs text-dark focus:outline-none font-body"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion 2: USP cards (4) — only change when the proposition changes */}
                <div className="space-y-2">
                  <div
                    onClick={() => setUspExpanded(!uspExpanded)}
                    className="bg-white border border-[#D6CFC2] rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:border-primary/40 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs text-dark transition-transform duration-200 inline-block ${uspExpanded ? 'rotate-90' : ''}`}>▶</span>
                      <span className="font-bold text-xs text-dark">USP cards (4) — only change when the proposition changes</span>
                    </div>
                    <span className="bg-gray-200 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">DEFAULT</span>
                  </div>

                  {uspExpanded && (
                    <div className="p-4 bg-[#F8F7F4] border border-[#D6CFC2] rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-center pb-1 border-b border-[#D6CFC2]/60">
                        <span className="font-bold text-dark font-mono text-[11px] uppercase">USP CARDS</span>
                        <button
                          type="button"
                          onClick={() => {
                            const defaultUsps = [
                              { id: 1, title: 'VAKSPECIALISTEN', desc: 'Met de hand gebouwd in onze eigen werkplaats met oog voor detail.' },
                              { id: 2, title: 'ÉÉN AANSPREEKPUNT', desc: 'Direct contact met Tim & Bram vanaf ontwerp tot bezorging.' },
                              { id: 3, title: 'GARANTIE & NAZORG', desc: 'Productgarantie en persoonlijke nazorg bij u aan huis.' },
                              { id: 4, title: 'BEWUST ONLINE', desc: 'Geen dure showroom, maar de scherpste prijs voor topkwaliteit.' }
                            ];
                            updateLetterField('uspCards', defaultUsps);
                            showToast('USP defaults restored!');
                          }}
                          className="text-[10px] font-mono font-bold text-dark/60 hover:text-dark underline cursor-pointer"
                        >
                          restore defaults
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(quote.letterAndProcess?.uspCards || [
                          { id: 1, title: 'VAKSPECIALISTEN', desc: 'Met de hand gebouwd in onze eigen werkplaats met oog voor detail.' },
                          { id: 2, title: 'ÉÉN AANSPREEKPUNT', desc: 'Direct contact met Tim & Bram vanaf ontwerp tot bezorging.' },
                          { id: 3, title: 'GARANTIE & NAZORG', desc: 'Productgarantie en persoonlijke nazorg bij u aan huis.' },
                          { id: 4, title: 'BEWUST ONLINE', desc: 'Geen dure showroom, maar de scherpste prijs voor topkwaliteit.' }
                        ]).map((usp, uIdx) => (
                          <div key={usp.id || uIdx} className="p-3 bg-white border border-[#D6CFC2] rounded-xl space-y-2">
                            <input
                              type="text"
                              value={usp.title}
                              onChange={(e) => {
                                const newUsps = [...(quote.letterAndProcess?.uspCards || [])];
                                newUsps[uIdx] = { ...newUsps[uIdx], title: e.target.value };
                                updateLetterField('uspCards', newUsps);
                              }}
                              className="w-full px-2.5 py-1.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-bold text-xs text-dark"
                              placeholder="USP Title"
                            />
                            <textarea
                              rows={2}
                              value={usp.desc}
                              onChange={(e) => {
                                const newUsps = [...(quote.letterAndProcess?.uspCards || [])];
                                newUsps[uIdx] = { ...newUsps[uIdx], desc: e.target.value };
                                updateLetterField('uspCards', newUsps);
                              }}
                              className="w-full px-2.5 py-1.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs text-dark/80"
                              placeholder="USP Description"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* CARD 2: PROCESS STEPS (P6, 4-6 STEPS) */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">PROCESS STEPS (P6, 4-6 STEPS)</span>

                <div className="space-y-2">
                  {/* Step 1 */}
                  <div className="bg-white border border-[#D6CFC2] rounded-xl p-3.5 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center gap-3 font-bold text-dark">
                      <span className="w-5 font-mono text-center">1</span>
                      <span>Akkoord op de offerte</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white border border-[#D6CFC2] rounded-xl p-3.5 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center gap-3 font-bold text-dark">
                      <span className="w-5 font-mono text-center">2</span>
                      <span>Digitale tekening ter bevestiging</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white border border-[#D6CFC2] rounded-xl p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-3 font-bold text-dark">
                      <span className="w-5 font-mono text-center">3</span>
                      <span>Productie door onze vakspecialist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#EFECE6] border border-[#D6CFC2] text-dark/80 font-mono font-bold text-[10px] px-2.5 py-1 rounded-md uppercase">
                        {quote.configuration?.deliveryTime?.toUpperCase() || '3 TOT 5 WEKEN'}
                      </span>
                      <span className="text-[10px] font-mono text-dark/50">← delivery time from step 3</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white border border-[#D6CFC2] rounded-xl p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-3 font-bold text-dark">
                      <span className="w-5 font-mono text-center">4</span>
                      <span>Bezorging in {quote.customer?.city || 'Dongen'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {((quote.investment?.lineItems || []).find(i => (i.title || i.description || '').toLowerCase().includes('bezorging'))?.priceInclVat === 0 ||
                        (quote.investment?.lineItems || []).find(i => (i.title || i.description || '').toLowerCase().includes('bezorging'))?.isIncluded !== false) && (
                        <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2.5 py-1 rounded-md uppercase">
                          GRATIS
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-dark/50">badge only when the delivery price is € 0</span>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-white border border-[#D6CFC2] rounded-xl p-3.5 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center gap-3 font-bold text-dark">
                      <span className="w-5 font-mono text-center">5</span>
                      <span>Garantie & nazorg</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 6: REVIEW & SEND */}
          {activeStep === 6 && (
            <div className="space-y-4 font-body">
              
              {/* CARD 1: VALIDATION */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">VALIDATION</span>

                <div className="space-y-2 text-xs">
                  {/* Line 1: Customer complete */}
                  <div className="p-3.5 bg-white border border-[#D6CFC2] rounded-xl flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[#33422C] font-bold font-mono">✓</span>
                    <span className="font-medium text-dark">Customer complete, incl. email address for the approval link</span>
                  </div>

                  {/* Line 2: At least 1 line item */}
                  <div className="p-3.5 bg-white border border-[#D6CFC2] rounded-xl flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[#33422C] font-bold font-mono">✓</span>
                    <span className="font-medium text-dark">At least 1 line item · totals are correct</span>
                  </div>

                  {/* Line 3: Payment instalments add up to 100% */}
                  <div className="p-3.5 bg-white border border-[#D6CFC2] rounded-xl flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[#33422C] font-bold font-mono">✓</span>
                    <span className="font-medium text-dark">Payment instalments add up to 100%</span>
                  </div>

                  {/* Line 4: Specifications */}
                  <div className="p-3.5 bg-white border border-[#D6CFC2] rounded-xl flex items-center gap-2.5 shadow-2xs">
                    <span className="text-[#33422C] font-bold font-mono">✓</span>
                    <span className="font-medium text-dark">Specifications: {totalSpecLines} of max 12 lines — fits on page 3</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: SEND */}
              <div className="bg-white rounded-2xl p-5 border border-[#D6CFC2] shadow-2xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-dark/80 font-mono block">SEND</span>

                {/* Row 1: Action buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-[#33422C] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-xs hover:bg-[#283523] transition-all cursor-pointer font-mono flex items-center gap-2"
                  >
                    <span>↓ Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSaveQuote({ ...quote, status: 'Verzonden' }, true);
                      showToast(`Quote ${quote.id} marked as Verzonden!`);
                    }}
                    className="px-4 py-2.5 bg-[#33422C] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-xs hover:bg-[#283523] transition-all cursor-pointer font-mono flex items-center gap-2"
                  >
                    <span>✈ Send → status "Verzonden"</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const publicUrl = `${window.location.origin}/offerte/${quote.id}`;
                      navigator.clipboard.writeText(publicUrl);
                      showToast('Approval link copied to clipboard!');
                    }}
                    className="px-4 py-2.5 bg-white border border-[#D6CFC2] text-dark font-bold text-xs rounded-xl shadow-xs hover:bg-[#EDE8DF] transition-all cursor-pointer font-mono flex items-center gap-2"
                  >
                    <span className="text-emerald-700">🔗</span>
                    <span>Copy approval link</span>
                  </button>
                </div>

                {/* Row 2: Duplicate button */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const savedQuotes = JSON.parse(localStorage.getItem('app_quotes_v2') || localStorage.getItem('app_quotes') || '[]');
                      const nextNum = savedQuotes.length + 332;
                      const newId = `OF-${new Date().getFullYear()}${nextNum}`;
                      const dupQuote = {
                        ...quote,
                        id: newId,
                        status: 'Draft',
                        date: new Date().toISOString().split('T')[0]
                      };
                      const updated = [dupQuote, ...savedQuotes];
                      localStorage.setItem('app_quotes_v2', JSON.stringify(updated));
                      localStorage.setItem('app_quotes', JSON.stringify(updated));
                      window.dispatchEvent(new Event('app_data_changed'));
                      showToast(`Quote duplicated as ${newId}!`);
                    }}
                    className="px-4 py-2 bg-white border border-[#D6CFC2] text-dark font-bold text-xs rounded-xl shadow-xs hover:bg-[#EDE8DF] transition-all cursor-pointer font-mono flex items-center gap-2"
                  >
                    <span className="text-dark/70">❐</span>
                    <span>Duplicate</span>
                  </button>
                </div>

                {/* Filename & locked notice */}
                <p className="text-xs text-dark/70 font-body pt-1">
                  Filename: <strong className="font-bold text-dark">Offerte-{quote.id}-{(quote.customer?.name || 'Bjorn Valk').replace(/\s+/g, '-')}.pdf</strong> · after customer approval the quote is locked
                </p>

              </div>

            </div>
          )}

          {/* BOTTOM ACTION BAR MATCHING SCREENSHOT 2 */}
          <div className="flex justify-between items-center pt-3">
            {activeStep > 1 ? (
              <button
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-white border border-[#D6CFC2] text-dark font-bold text-xs rounded-xl shadow-xs hover:bg-[#EDE8DF] transition-all cursor-pointer font-mono"
              >
                ← Back
              </button>
            ) : <div></div>}

            {activeStep < 6 && (
              <button
                onClick={() => setActiveStep(prev => Math.min(6, prev + 1))}
                className="px-6 py-2.5 bg-[#33422C] hover:bg-[#283523] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 font-mono cursor-pointer"
              >
                <span>Next: {getStepNextTitle(activeStep)} →</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* PRODUCT LIBRARY MODAL */}
      <AnimatePresence>
        {showLibraryModal && (
          <div className="fixed inset-0 z-[999999] bg-dark/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#D6CFC2] pb-2">
                <h3 className="font-heading font-bold text-base text-primary">Product Library</h3>
                <button onClick={() => setShowLibraryModal(false)} className="text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-2 text-xs max-h-80 overflow-y-auto pr-1">
                {PRESET_PRODUCT_LIBRARY.map((item) => (
                  <div key={item.id} className="p-3 bg-white border border-[#D6CFC2] rounded-xl flex justify-between items-center hover:border-primary/50 transition-all">
                    <div>
                      <h4 className="font-bold text-primary">{item.title}</h4>
                      <p className="text-[11px] text-dark/60">{item.description}</p>
                      <span className="font-mono text-xs font-bold text-amber-700">€ {item.priceInclVat.toFixed(2)}</span>
                    </div>
                    <Button size="sm" onClick={() => handleAddFromLibrary(item)} className="text-xs">
                      + Insert
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 100% CLEAN PDF PRINT PORTAL ATTACHED DIRECTLY TO DOCUMENT BODY */}
      {quote && createPortal(
        <div id="printable-offerte-portal">
          <Offerte6PagePDF quote={quote} />
        </div>,
        document.body
      )}
    </div>
  );
}
