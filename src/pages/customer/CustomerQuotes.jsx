import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { useLanguage } from '../../context/LanguageContext';
import { safeSetItem } from '../../utils/storageHelper';
import { downloadDirectPdfFile } from '../../utils/pdfGenerator';
import { CheckCircle, XCircle, FileText, Download, Sparkles, Check, CreditCard, ShieldCheck, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerQuotes() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [toastMsg, setToastMsg] = useState('');
  const [acceptedModalQuote, setAcceptedModalQuote] = useState(null);

  // Load quotes from localStorage or fallback
  useEffect(() => {
    const loadQuotes = () => {
      const savedV1 = localStorage.getItem('app_quotes_v1');
      const saved = localStorage.getItem('app_quotes');
      const source = savedV1 || saved;
      if (source) {
        try {
          const parsed = JSON.parse(source);
          setQuotes(parsed);
        } catch (e) {
          setQuotes([]);
        }
      } else {
        const defaultQuotes = [
          {
            id: 'Q-4001',
            customer: 'Jan de Vries',
            project: 'Luxe Teak Buitenkeuken 4m',
            category: 'Buitenkeukens',
            amount: '€ 11,300',
            status: 'Geaccepteerd',
            date: '2026-07-28',
            discountPercent: 5,
            items: [
              { description: 'Massief Teakhouten Frame met Zwart Polijst Beton werkblad (3.5m)', quantity: 1, unitPrice: 8500 },
              { description: 'Ingebouwde Kamado BBQ RVS Uitsparing & Gasfornuis Module', quantity: 1, unitPrice: 2400 },
              { description: 'Luxe RVS Kraan, Zwarte Spoelbak & Slangaansluitingen', quantity: 1, unitPrice: 1000 }
            ]
          },
          {
            id: 'Q-4004',
            customer: 'Jan de Vries',
            project: 'Exclusieve Buitenkeuken - Maatwerk',
            category: 'Buitenkeukens',
            amount: '€ 250',
            status: 'Verzonden',
            date: '2026-07-31',
            discountPercent: 0,
            items: [
              { description: 'Offerte Inventarisatie & Maatwerk Ontwerp Buitenkeuken', quantity: 1, unitPrice: 250 }
            ]
          }
        ];
        setQuotes(defaultQuotes);
        safeSetItem('app_quotes', defaultQuotes);
      }
    };

    loadQuotes();
    window.addEventListener('storage', loadQuotes);
    window.addEventListener('app_data_changed', loadQuotes);
    return () => {
      window.removeEventListener('storage', loadQuotes);
      window.removeEventListener('app_data_changed', loadQuotes);
    };
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAcceptQuote = (quote) => {
    const updated = quotes.map(q => q.id === quote.id ? { ...q, status: 'Geaccepteerd' } : q);
    setQuotes(updated);
    safeSetItem('app_quotes', updated);

    // Auto Create / Update Project (Prevent duplicates & carry over all quote data)
    const existingProjects = JSON.parse(localStorage.getItem('app_projects') || '[]');
    const totalVal = parseFloat((quote.amount || '').replace(/[^0-9.]/g, '')) || 0;
    const existingIdx = existingProjects.findIndex(p => p.quoteId === quote.id || (p.customer === quote.customer && p.name === quote.project));

    const projectPayload = {
      id: existingIdx >= 0 ? existingProjects[existingIdx].id : `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      name: quote.project,
      customer: quote.customer,
      partner: quote.partner || existingProjects[existingIdx]?.partner || 'Sven Hoek (Hoek Bouw)',
      partnerCost: quote.partnerCost || Math.round(totalVal * 0.65),
      margin: quote.margin || Math.round(totalVal * 0.35),
      products: quote.items || quote.products || [],
      progress: existingIdx >= 0 ? existingProjects[existingIdx].progress : 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'In Progress',
      orderStatus: 'In voorbereiding',
      quoteId: quote.id,
      value: quote.amount,
      numericAmount: totalVal,
      isPartnerConfirmed: existingIdx >= 0 ? (existingProjects[existingIdx].isPartnerConfirmed || false) : false,
      partnerStatus: existingIdx >= 0 ? (existingProjects[existingIdx].partnerStatus || 'Pending Confirmation') : 'Pending Confirmation'
    };

    let updatedProjectsList = [];
    if (existingIdx >= 0) {
      updatedProjectsList = existingProjects.map((p, i) => i === existingIdx ? { ...p, ...projectPayload } : p);
    } else {
      updatedProjectsList = [projectPayload, ...existingProjects];
    }
    safeSetItem('app_projects', updatedProjectsList);

    // Auto Create 2 Invoices (50% Deposit & 50% Final)
    const numAmount = parseFloat((quote.amount || '').replace(/[^0-9.]/g, '')) || 1000;
    const inv1 = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: quote.customer,
      amount: `€ ${(numAmount * 0.5).toLocaleString()}`,
      status: 'Unpaid',
      type: '50% Aanbetaling',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      quoteId: quote.id
    };
    const inv2 = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: quote.customer,
      amount: `€ ${(numAmount * 0.5).toLocaleString()}`,
      status: 'Unpaid',
      type: '50% Eindfactuur',
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      quoteId: quote.id
    };
    const existingInvoices = JSON.parse(localStorage.getItem('app_invoices') || '[]');
    safeSetItem('app_invoices', [inv1, inv2, ...existingInvoices]);

    // Auto update lead
    const savedLeads = localStorage.getItem('app_leads_v2') || localStorage.getItem('app_leads');
    if (savedLeads) {
      try {
        const leads = JSON.parse(savedLeads);
        const updatedLeads = leads.map(l => l.name === quote.customer ? { ...l, status: 'Gewonnen' } : l);
        safeSetItem('app_leads_v2', updatedLeads);
        safeSetItem('app_leads', updatedLeads);
      } catch (e) {}
    }

    window.dispatchEvent(new Event('app_data_changed'));
    setAcceptedModalQuote(quote);
    showToast(language === 'EN' ? 'Quote Accepted! Project setup initiated.' : 'Offerte geaccepteerd! Project is gestart.');
  };

  const handleDeclineQuote = (quote) => {
    const updated = quotes.map(q => q.id === quote.id ? { ...q, status: 'Afgewezen' } : q);
    setQuotes(updated);
    safeSetItem('app_quotes', updated);
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(language === 'EN' ? 'Quote marked as declined.' : 'Offerte is afgewezen.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="fixed top-20 right-4 z-[9999] flex items-center gap-2 bg-green-800 text-cream px-4 py-3 rounded-xl shadow-xl border border-green-700 font-body text-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-[#EDE8DF] border border-[#C4BEB3] p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">{language === 'NL' ? 'KLANTENPORTAAL' : 'CUSTOMER PORTAL'}</span>
          <h2 className="text-2xl font-heading font-bold text-primary mt-1">
            {language === 'EN' ? 'My Quotes & Proposals' : 'Mijn Ontvangen Offertes'}
          </h2>
          <p className="text-xs text-dark/70 mt-1">
            {language === 'EN' 
              ? 'Review, download PDF, or accept your custom proposals to initiate production.' 
              : 'Bekijk uw offerte details, accordeer direct of download de officiële PDF.'}
          </p>
        </div>
      </div>

      {/* Quotes Cards List */}
      <div className="space-y-6">
        {quotes.map((quote) => {
          const isAccepted = quote.status === 'Geaccepteerd' || quote.status === 'Accepted';
          const isRejected = quote.status === 'Afgewezen' || quote.status === 'Rejected';
          const itemsList = quote.items || [
            { description: quote.project || 'Maatwerk Keuken / Ombouw', quantity: 1, unitPrice: parseFloat((quote.amount || '0').replace(/[^0-9.]/g, '')) || 0 }
          ];

          return (
            <Card key={quote.id} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Row 1: Top Metadata & Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-[#D6CFC2]/60 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-mono font-bold text-accent">{quote.id}</span>
                    <span className="text-dark/40 text-[11px]">•</span>
                    <span className="text-[11px] text-dark/50 font-mono truncate">{quote.date}</span>
                  </div>
                  <Badge variant={isAccepted ? 'success' : isRejected ? 'danger' : 'warning'} className="flex-shrink-0 text-[10px]">
                    {isAccepted 
                      ? (language === 'EN' ? 'Accepted' : 'Geaccepteerd') 
                      : isRejected 
                      ? (language === 'EN' ? 'Declined' : 'Afgewezen') 
                      : (language === 'EN' ? 'Pending Approval' : 'Wacht op Akkoord')}
                  </Badge>
                </div>

                {/* Row 2: Project Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-primary leading-snug">
                    {language === 'EN' 
                      ? (quote.project || '')
                          .replace(/Luxe Teak Buitenkeuken 4m/g, 'Luxury Teak Outdoor Kitchen 4m')
                          .replace(/Exclusieve Buitenkeuken - Maatwerk/g, 'Exclusive Outdoor Kitchen - Custom Build')
                          .replace(/Exclusieve Buitenkeuken/g, 'Exclusive Outdoor Kitchen')
                          .replace(/Kliko Ombouw Triple Antraciet/g, 'Bin Storage Triple Anthracite')
                          .replace(/Eiken Houten Overkapping 6x4m/g, 'Oak Wooden Canopy 6x4m')
                      : quote.project}
                  </h3>
                </div>

                {/* Row 3: Itemized Breakdown (Minimal) */}
                <div className="bg-white/80 rounded-xl border border-[#D6CFC2]/60 divide-y divide-[#D6CFC2]/40 text-xs">
                  {itemsList.map((item, i) => (
                    <div key={i} className="p-2 sm:p-2.5 flex justify-between items-center gap-3">
                      <div className="min-w-0 flex items-center gap-1.5">
                        <span className="text-dark/40 font-mono text-[10px] flex-shrink-0">({item.quantity || 1}x)</span>
                        <span className="font-semibold text-dark text-xs truncate">
                          {language === 'EN'
                            ? (item.description || '')
                                .replace(/Massief Teakhouten Frame met Zwart Polijst Beton werkblad/g, 'Solid Teak Frame with Black Polished Concrete Worktop')
                                .replace(/Ingebouwde Kamado BBQ RVS Uitsparing & Gasfornuis Module/g, 'Built-in Kamado BBQ Stainless Cutout & Gas Stove Module')
                                .replace(/Luxe RVS Kraan, Zwarte Spoelbak & Slangaansluitingen/g, 'Luxury Stainless Tap, Black Sink & Hose Connections')
                                .replace(/Offerte Inventarisatie & Maatwerk Ontwerp Buitenkeuken/g, 'Quote Inventory & Custom Outdoor Kitchen Design')
                                .replace(/Buitenkeuken Teak Hout Frame 4m/g, 'Outdoor Kitchen Teak Wood Frame 4m')
                                .replace(/Beton Aanrechtblad met Kamado Uitsparing/g, 'Concrete Worktop with Kamado Cutout')
                                .replace(/Aanrechtblad & Afwerking/g, 'Worktop & Finishing')
                                .replace(/Triple 240L Klikobox Gepoedercoat Stalen Frame/g, 'Triple 240L Bin Storage Powder Coated Steel Frame')
                                .replace(/Rustiek Eiken Gebint Constructie/g, 'Rustic Oak Truss Construction')
                                .replace(/EPDM Daksysteem & Zinken Hemelwaterafvoer/g, 'EPDM Roofing System & Zinc Rainwater Drainage')
                            : item.description}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-primary whitespace-nowrap text-xs flex-shrink-0">
                        € {((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Row 4: Proposal PDF & Shareable Link Banner */}
                <div className="bg-[#EDE8DF]/70 border border-[#D6CFC2] p-2.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <FileText className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{language === 'EN' ? 'Official 6-Page Branded Proposal PDF' : 'Officiële 6-Pagina Merk Offerte PDF'}</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = `${window.location.origin}/offerte/${quote.id}`;
                        navigator.clipboard.writeText(link);
                        showToast(language === 'EN' ? 'Proposal link copied to clipboard!' : 'Offerte link gekopieerd naar klembord!');
                      }}
                      className="flex-1 sm:flex-none text-[11px] py-1 px-2.5 border-[#C4BEB3] text-dark hover:bg-white bg-white/60"
                      title={language === 'EN' ? 'Copy shareable URL link' : 'Kopieer deelbare link'}
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      {language === 'EN' ? 'Copy Link' : 'Kopieer Link'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        const fn = downloadDirectPdfFile(quote);
                        showToast(language === 'EN' ? `✓ Downloaded ${fn}!` : `✓ ${fn} gedownload!`);
                      }}
                      className="flex-1 sm:flex-none text-[11px] font-bold py-1 px-3 bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      {language === 'EN' ? 'Download PDF' : 'Download PDF'}
                    </Button>
                    <a
                      href={`/offerte/${quote.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 text-[11px] font-bold py-1 px-3 rounded-lg bg-[#3E4E36] hover:bg-[#2D3528] text-white transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {language === 'EN' ? 'Open 6-Page PDF' : 'Open 6-Pagina PDF'}
                    </a>
                  </div>
                </div>

                {/* Row 5: Clean Total & Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] text-dark/50 uppercase font-semibold">{language === 'EN' ? 'Total:' : 'Totaal:'}</span>
                    <span className="text-xl font-bold text-primary font-heading">{quote.amount}</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {!isAccepted && !isRejected && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeclineQuote(quote)}
                          className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 text-xs justify-center whitespace-nowrap py-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                          {language === 'EN' ? 'Decline' : 'Afwijzen'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptQuote(quote)}
                          className="flex-1 sm:flex-none bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-xs justify-center whitespace-nowrap py-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                          <span>{language === 'EN' ? 'Accept & Start' : 'Akkoord & Start'}</span>
                        </Button>
                      </>
                    )}
                    {isAccepted && (
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-800 px-3 py-1.5 rounded-xl text-xs font-bold w-full sm:w-auto justify-center">
                        <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span>{language === 'EN' ? 'Accepted & Active' : 'Offerte Akkoord — Gestart'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* SUCCESS ACCEPTANCE CELEBRATION MODAL */}
      <AnimatePresence>
        {acceptedModalQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-xs" onClick={() => setAcceptedModalQuote(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-center">
              <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8 text-amber-500 animate-bounce" />
              </div>

              <h3 className="text-2xl font-heading font-bold text-primary">
                {language === 'EN' ? 'Gefeliciteerd! Offerte Geaccepteerd 🎉' : 'Gefeliciteerd! Offerte Geaccepteerd 🎉'}
              </h3>
              <p className="text-xs text-dark/70 leading-relaxed font-body">
                {language === 'EN' 
                  ? `Thank you for accepting Quote ${acceptedModalQuote.id} for ${acceptedModalQuote.project}. Your project is now active in production.` 
                  : `Bedankt voor uw akkoord op offerte ${acceptedModalQuote.id} (${acceptedModalQuote.project}). Uw maatwerk project is direct aangemaakt.`}
              </p>

              <div className="p-4 bg-white/90 rounded-xl border border-[#D6CFC2] text-left text-xs space-y-2">
                <div className="flex justify-between items-center font-bold text-primary border-b border-[#D6CFC2] pb-1.5">
                  <span>50% Aanbetaling Factuur (Deposit)</span>
                  <span>{acceptedModalQuote.amount}</span>
                </div>
                <p className="text-[11px] text-dark/70">
                  U ontvangt per e-mail de officiële iDEAL / Bankoverschrijving factuur voor de 50% aanbetaling. Onze ambachtelijke vakman start direct met de hout- en betonselectie.
                </p>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={() => { 
                    setAcceptedModalQuote(null); 
                    navigate('/customer/project'); 
                  }} 
                  className="w-full"
                >
                  {language === 'EN' ? 'View My Project Progress ➔' : 'Bekijk Mijn Project Voortgang ➔'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
