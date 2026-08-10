import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, Check, X, ShieldCheck, Clock, Download, MessageSquare, Mail, Phone, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { mockQuotes as defaultQuotes } from '../utils/mockData';
import outdoorProjectCard from '../assets/outdoor_project_card.png';
import outdoorLivingLogin from '../assets/outdoor_living_login.png';

export default function PublicOfferte() {
  const { token } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);
  const [approvalDetails, setApprovalDetails] = useState(null);

  // Load quote data dynamically from localStorage or fallback mockQuotes
  useEffect(() => {
    const loadQuote = () => {
      const savedQuotes = localStorage.getItem('app_quotes_v2') || localStorage.getItem('app_quotes_v1') || localStorage.getItem('app_quotes');
      const allQuotes = savedQuotes ? JSON.parse(savedQuotes) : defaultQuotes;
      
      // Match by ID (token can be quote.id like OF-2026-4005 or Q-4004)
      const found = allQuotes.find(
        (q) => String(q.id).toLowerCase() === String(token).toLowerCase() ||
               String(q.id).replace(/[^\w]/g, '').toLowerCase() === String(token).replace(/[^\w]/g, '').toLowerCase()
      );

      if (found) {
        setQuote(found);
        if (found.signerName) setSignerName(found.signerName);
        if (found.status === 'Akkoord' || found.status === 'Accepted' || found.status === 'Approved') {
          setIsApprovedSuccess(true);
          setApprovalDetails({
            signerName: found.signerName || found.customer,
            date: found.approvedAt || '2026-08-04 17:10',
            ip: found.signerIp || '192.168.1.1'
          });
        }
      } else {
        // Fallback default quote for testing if token not found
        const fallback = allQuotes[0] || defaultQuotes[0];
        setQuote({
          ...fallback,
          id: token || 'OF-2026-4005',
          customer: 'Jan de Vries',
          project: 'Exclusieve Outdoor Kitchen - Maatwerk',
          amount: '€ 11.300',
          date: '2026-08-04',
          validUntil: '2026-09-03'
        });
      }
      setLoading(false);
    };

    loadQuote();
  }, [token]);

  // Check if quote is expired (validUntil check)
  const isExpired = quote && quote.validUntil ? new Date(quote.validUntil) < new Date('2026-08-01') : false;

  // Handle Digital Approval Submission
  const handleApproveSubmit = (e) => {
    e.preventDefault();
    if (!signerName.trim() || !agreedTerms) return;

    const approvalDate = new Date().toLocaleString('nl-NL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updatedApproval = {
      signerName: signerName.trim(),
      date: approvalDate,
      ip: '185.228.168.42 (Digitaal geverifieerd)'
    };

    // Update in LocalStorage
    const savedQuotes = localStorage.getItem('app_quotes_v1');
    const currentQuotes = savedQuotes ? JSON.parse(savedQuotes) : defaultQuotes;
    const updatedList = currentQuotes.map((q) => {
      if (String(q.id).toLowerCase() === String(quote.id).toLowerCase()) {
        return {
          ...q,
          status: 'Akkoord',
          signerName: signerName.trim(),
          approvedAt: approvalDate,
          signerIp: updatedApproval.ip
        };
      }
      return q;
    });

    localStorage.setItem('app_quotes_v1', JSON.stringify(updatedList));

    // Update local state
    setQuote((prev) => ({
      ...prev,
      status: 'Akkoord',
      signerName: signerName.trim(),
      approvedAt: approvalDate
    }));

    setApprovalDetails(updatedApproval);
    setShowApprovalModal(false);
    setIsApprovedSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE6DD] flex items-center justify-center p-4 font-body">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-primary">Offerte laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE6DD] text-dark font-body pb-32">
      {/* Top Fixed Header Bar */}
      <header className="sticky top-0 z-40 bg-[#3E4E36] text-[#FDFBF7] border-b border-[#2D3528] px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D6CFC2]" />
            <div>
              <h1 className="font-heading font-bold text-sm sm:text-base text-[#FDFBF7]">VANUIT AMBACHT</h1>
              <p className="text-[10px] text-[#D6CFC2] font-mono">Officieel Digitaal Voorstel • {quote.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${
              isApprovedSuccess || quote.status === 'Akkoord'
                ? 'bg-emerald-800/80 text-emerald-200 border-emerald-500/50'
                : 'bg-[#70624F]/40 text-[#FDFBF7] border-[#70624F]'
            }`}>
              {isApprovedSuccess || quote.status === 'Akkoord' ? '✓ Digitaal Akkoord' : `Offerte ${quote.id}`}
            </span>
          </div>
        </div>
      </header>

      {/* Main 6-Page Offerte Container */}
      <main className="max-w-3xl mx-auto p-3 sm:p-6 space-y-8 mt-4">
        
        {/* Success Banner if Approved */}
        {isApprovedSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-5 bg-emerald-900 text-emerald-100 rounded-2xl border-2 border-emerald-500 shadow-xl space-y-2"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Gefeliciteerd! Uw offerte is officieel akkoord.</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Ondertekend door <strong>{approvalDetails?.signerName || quote.customer}</strong> op {approvalDetails?.date || quote.date}.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-emerald-300 pt-1 border-t border-emerald-700/60">
              Tim & Bram hebben direct een melding ontvangen. Binnen enkele dagen ontvangt u de digitale maattekening ter bevestiging!
            </p>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* PAGE 1: BRANDED LUXURY COVER PAGE (#3E4E36)                */}
        {/* ========================================================= */}
        <div className="bg-[#3E4E36] text-[#FDFBF7] rounded-xl shadow-2xl border border-[#2D3528] overflow-hidden p-6 sm:p-10 space-y-8 relative">
          <div className="flex justify-between items-start border-b border-[#526648] pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#FDFBF7] tracking-wider">VANUIT AMBACHT</h2>
              <p className="text-[11px] text-[#D6CFC2] font-mono tracking-widest uppercase mt-0.5">EXCLUSIEVE HOUTBOUW & BUITENKEUKENS</p>
            </div>
            <span className="text-xs font-mono font-bold border border-[#70624F] text-[#FDFBF7] bg-[#70624F]/30 px-3.5 py-1.5 rounded-full shadow-xs">
              OFFERTE
            </span>
          </div>

          <div className="space-y-3 py-4">
            <span className="text-xs font-mono text-[#D6CFC2] tracking-wider uppercase block">
              VOORKEUR OP MAAT — {quote.id}
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#FDFBF7] leading-tight">
              Uw buitenkeuken, op maat gemaakt.
            </h3>
            <p className="text-xs text-[#D6CFC2] font-mono pt-2">
              Thermo Fraké • 240 × 80 cm • uitsparing Big Green Egg Large
            </p>
          </div>

          <div className="pt-6 border-t border-[#526648] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">OPDRACHTGEVER</span>
              <span className="font-bold text-[#FDFBF7] text-sm">{quote.customer}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">OFFERTENUMMER</span>
              <span className="font-bold text-[#FDFBF7]">{quote.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">DATUM</span>
              <span className="font-bold text-[#FDFBF7]">{quote.date}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#D6CFC2] uppercase block tracking-wider font-bold">GELDIG TOT</span>
              <span className="font-bold text-[#FDFBF7]">{quote.validUntil || '19 augustus 2026'}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <img src={outdoorLivingLogin} alt="Buitenkeuken 1" className="h-28 sm:h-36 w-full object-cover rounded-lg border border-[#526648]" />
            <img src={outdoorProjectCard} alt="Buitenkeuken 2" className="h-28 sm:h-36 w-full object-cover rounded-lg border border-[#526648]" />
            <img src={outdoorLivingLogin} alt="Buitenkeuken 3" className="h-28 sm:h-36 w-full object-cover rounded-lg border border-[#526648]" />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-[#D6CFC2] pt-4 border-t border-[#526648]">
            <span>Vanuit Ambacht B.V. • Keizersgracht 402</span>
            <span>AMBACHT • KWALITEIT • ZEKERHEID</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PAGE 2: PERSONAL LETTER & 4 USP CARDS (#FDFBF7)            */}
        {/* ========================================================= */}
        <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
          <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
            <span>VANUIT AMBACHT • OFFERTE SPECIFICATIE</span>
            <span>Pagina 2 van 6</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">01 - PERSOONLIJK WOORD</span>
              <h3 className="text-xl font-serif font-bold text-primary">Beste {quote.customer},</h3>
              <p className="leading-relaxed text-dark/80">
                Leuk dat we met je mee mogen nadenken over jouw buitenkeuken. In deze offerte vind je ons voorstel, volledig afgestemd op jouw wensen en jouw buitenruimte.
              </p>
              <p className="leading-relaxed text-dark/80">
                Bij Vanuit Ambacht geloven we in echt ambachtelijk vakwerk. Elk meubel wordt met de hand gemaakt door vakmensen die het ambacht verstaan. Geen massaproductie, maar een zorgvuldig vervaardigd meubel met duurzame uitstraling en lange levensduur.
              </p>
              <p className="leading-relaxed text-dark/80">
                Vragen, of wil je een aanpassing? App of bel ons gerust. Schakelen bij Vanuit Ambacht betekent rechtstreeks contact met een van ons beiden.
              </p>
              <div className="pt-2">
                <p className="font-serif font-bold text-primary text-sm">Tim & Bram</p>
                <p className="text-[10px] text-accent font-semibold font-mono">OPRICHTERS VANUIT AMBACHT</p>
              </div>
            </div>

            <div className="p-3 bg-[#EDE8DF] rounded-xl border border-[#C4BEB3] space-y-2 text-center">
              <img src={outdoorLivingLogin} alt="Tim & Bram" className="h-32 w-full object-cover rounded-lg border border-[#C4BEB3]" />
              <p className="text-[10px] font-body text-dark/70 italic">
                Tim & Bram, jouw vaste aanspreekpunt van eerste schets tot nazorg.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#C4BEB3]/60 space-y-3">
            <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">02 - WAAROM VANUIT AMBACHT?</span>
            <h4 className="text-base font-serif font-bold text-primary">Waar je op kunt rekenen</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                <div>
                  <p className="font-bold text-primary text-xs">Gecertificeerde vakmanschap</p>
                  <p className="text-[11px] text-dark/70 mt-0.5">Kwalitatief hoogwaardig kwaliteitsmateriaal en ambachtelijk gemaakt door ervaren vakmensen.</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                <div>
                  <p className="font-bold text-primary text-xs">Eén vast aanspreekpunt</p>
                  <p className="text-[11px] text-dark/70 mt-0.5">Rechtstreeks contact met Tim of Bram via WhatsApp, telefoon of e-mail voor al je vragen.</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                <div>
                  <p className="font-bold text-primary text-xs">Garantie én nazorg</p>
                  <p className="text-[11px] text-dark/70 mt-0.5">Garantie op het product en de montage. Ook na de levering staan wij altijd voor je klaar.</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#EDE8DF]/60 rounded-xl border border-[#C4BEB3]/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary text-cream flex items-center justify-center font-bold flex-shrink-0 text-xs">✓</div>
                <div>
                  <p className="font-bold text-primary text-xs">Eerlijke prijs, bewust online</p>
                  <p className="text-[11px] text-dark/70 mt-0.5">Geen dure showroom en tussenpersonen. Zeer scherpe prijs voor vakwerk.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 2 van 6</div>
        </div>

        {/* ========================================================= */}
        {/* PAGE 3: UW CONFIGURATIE & 2D BLOCK DIAGRAM (#FDFBF7)       */}
        {/* ========================================================= */}
        <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
          <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
            <span>VANUIT AMBACHT • PRODUCT CONFIGURATIE</span>
            <span>Pagina 3 van 6</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">03 - CONFIGURATIE</span>
            <h3 className="text-xl font-serif font-bold text-primary">Jouw buitenkeuken in één oogopslag</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">AFMETING</span>
              <p className="text-base font-bold font-mono">240 × 80 cm</p>
              <span className="text-[9px] text-[#D6CFC2] block">Totale footprint</span>
            </div>

            <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">HOUTSOORT</span>
              <p className="text-base font-bold font-mono">Thermo Fraké</p>
              <span className="text-[9px] text-[#D6CFC2] block">Onderhoudsarm</span>
            </div>

            <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">UITSPARING</span>
              <p className="text-base font-bold font-mono">Big Green Egg</p>
              <span className="text-[9px] text-[#D6CFC2] block">Geschikt voor Large</span>
            </div>

            <div className="bg-[#3E4E36] text-[#FDFBF7] p-3.5 rounded-xl text-center space-y-1 shadow-sm">
              <span className="text-[9px] uppercase font-mono tracking-wider text-[#D6CFC2] block">LEVERTIJD</span>
              <p className="text-base font-bold font-mono">3 tot 5 weken</p>
              <span className="text-[9px] text-[#D6CFC2] block">Montage inbegrepen</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3 font-body">
              <div>
                <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">BOVENBLAD</p>
                <p className="text-dark/80 text-[11px]">✓ Houten bovenblad met keramische tegels en uitsparing voor de Big Green Egg Large, rechts van het midden.</p>
              </div>

              <div>
                <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">INDELING & OPBERGRUIMTE</p>
                <p className="text-dark/80 text-[11px]">✓ Drie kastjes met deurtjes: links 1x klein kastje, uitsparing Big Green Egg, rechts 1x lang kastje.</p>
              </div>

              <div>
                <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">AFWERKING & MOBILITEIT</p>
                <p className="text-dark/80 text-[11px]">✓ Behandeld met olie. Wielen onder de benen voor optimale mobiliteit op het terras.</p>
              </div>

              <div>
                <p className="font-bold text-primary uppercase text-[10px] tracking-wider mb-0.5">BEZORGING</p>
                <p className="text-dark/80 text-[11px]">✓ Gratis bezorging en inhuizen op de gewenste plek in jouw tuin.</p>
              </div>
            </div>

            <div className="space-y-3">
              <img src={outdoorProjectCard} alt="Render" className="h-32 w-full object-cover rounded-xl border border-[#C4BEB3]" />

              <div className="p-3 bg-[#EDE8DF] rounded-xl border border-[#C4BEB3] text-center space-y-2">
                <span className="text-[9px] font-mono uppercase font-bold text-accent">2D FRONT VIEW SCHEMA</span>
                <div className="flex items-center justify-center gap-1.5 font-mono text-[9px]">
                  <div className="px-2 py-3 bg-white border border-dark/30 rounded font-bold text-dark">Kastje</div>
                  <div className="px-2 py-3 bg-white border border-dark/30 rounded font-bold text-dark">Kastje</div>
                  <div className="px-2 py-3 bg-[#3E4E36] text-white rounded font-bold">Big Green Egg</div>
                  <div className="px-2 py-3 bg-white border border-dark/30 rounded font-bold text-dark">Kastje</div>
                </div>
                <div className="text-[9px] font-mono text-dark/60 border-t border-dark/20 pt-1">
                  |&lt;------------------ 240 cm ------------------&gt;|
                </div>
              </div>

              <div className="p-3.5 bg-[#3E4E36] text-[#FDFBF7] rounded-xl text-xs space-y-1 shadow-sm">
                <p className="font-serif font-bold text-[#FDFBF7] text-xs">Over Thermo Fraké</p>
                <p className="text-[10px] text-[#D6CFC2] leading-relaxed">
                  Thermisch gemodificeerd hout is duurzaam, vormvast en bestand tegen alle weersinvloeden. Het hout verkleurt mooi en heeft een levensduur van meer dan 20 jaar.
                </p>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 3 van 6</div>
        </div>

        {/* ========================================================= */}
        {/* PAGE 4: DETAILED PRICING & PAYMENT TERMS (#FDFBF7)         */}
        {/* ========================================================= */}
        <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
          <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
            <span>VANUIT AMBACHT • FINANCIEEL OVERZICHT</span>
            <span>Pagina 4 van 6</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">04 - INVESTERING</span>
            <h3 className="text-xl font-serif font-bold text-primary">Heldere prijs, alles inbegrepen</h3>
          </div>

          <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-[#C4BEB3]">
            <thead>
              <tr className="bg-[#3E4E36] text-[#FDFBF7] text-[10px] font-mono uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Omschrijving</th>
                <th className="py-3 px-2 text-center">Aantal</th>
                <th className="py-3 px-4 text-right">Bedrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C4BEB3]/50 bg-white">
              <tr>
                <td className="py-3.5 px-4 font-bold text-dark text-xs">
                  {quote.project || 'Buitenkeuken Thermo Fraké - 240 × 80 cm'}
                  <span className="block text-[10px] font-normal text-dark/60 mt-0.5">Houten bovenblad met keramische tegels, uitsparing Big Green Egg Large, drie kastjes.</span>
                </td>
                <td className="py-3.5 px-2 text-center font-mono font-bold">1</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-primary text-sm whitespace-nowrap">{quote.amount || '€ 3.495,00'}</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-dark text-xs">
                  Bezorging inhuizen
                  <span className="block text-[10px] font-normal text-dark/60 mt-0.5">Levering op de gewenste plek in jouw tuin.</span>
                </td>
                <td className="py-3.5 px-2 text-center font-mono font-bold">1</td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">Inbegrepen</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            <div className="p-4 bg-[#EDE8DF]/70 rounded-xl border border-[#C4BEB3] space-y-2">
              <p className="font-mono text-[10px] uppercase font-bold text-accent tracking-wider">INBEGREPEN BIJ JOUW INVESTERING</p>
              <ul className="space-y-1.5 text-[11px] text-dark/80">
                <li className="flex items-center gap-2">✓ Volledig maatwerk, met de hand gemaakt</li>
                <li className="flex items-center gap-2">✓ Digitale maattekening vóór productie</li>
                <li className="flex items-center gap-2">✓ Oliebehandeling (naturel)</li>
                <li className="flex items-center gap-2">✓ Gratis bezorging en inhuizen</li>
                <li className="flex items-center gap-2">✓ Garantie op het product en montage</li>
              </ul>
            </div>

            <div className="p-5 bg-[#3E4E36] text-[#FDFBF7] rounded-xl space-y-3 flex flex-col justify-between shadow-md">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#D6CFC2]"><span>Totaal excl. btw</span><span>€ 2.888,43</span></div>
                <div className="flex justify-between text-[#D6CFC2]"><span>Btw 21%</span><span>€ 606,57</span></div>
                <div className="flex justify-between text-base font-bold text-[#FDFBF7] pt-2 border-t border-[#526648]">
                  <span>Totaal incl. btw</span>
                  <span className="text-lg text-white font-mono">{quote.amount || '€ 3.495,00'}</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#EDE8DF] text-primary text-[10px] font-mono rounded-lg font-bold text-center">
                Deze offerte is geldig tot en met {quote.validUntil || '19 augustus 2026'}
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <p className="font-mono text-[10px] uppercase font-bold text-accent tracking-wider">BETAALTERMIJNEN IN TWEE STAPPEN</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body">
              <div className="p-3.5 bg-white rounded-xl border border-[#C4BEB3] flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-primary">50%</span>
                <div>
                  <p className="font-bold text-dark text-xs">Bij akkoord € 1.747,50</p>
                  <p className="text-[10px] text-dark/60 mt-0.5">Hiermee reserveren we de productie direct.</p>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#C4BEB3] flex items-center gap-3">
                <span className="text-xl font-bold font-mono text-primary">50%</span>
                <div>
                  <p className="font-bold text-dark text-xs">Bij levering € 1.747,50</p>
                  <p className="text-[10px] text-dark/60 mt-0.5">Het restant betaal je pas wanneer de keuken staat.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 4 van 6</div>
        </div>

        {/* ========================================================= */}
        {/* PAGE 5: PROCESS TIMELINE & GUARANTEES (#FDFBF7)            */}
        {/* ========================================================= */}
        <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
          <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
            <span>VANUIT AMBACHT • WERKWIJZE</span>
            <span>Pagina 5 van 6</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">05 - VAN AKKOORD TOT OPLEVERING</span>
            <h3 className="text-xl font-serif font-bold text-primary">Zo werkt het in vijf stappen</h3>
          </div>

          <div className="space-y-3 relative pl-2">
            {[
              { step: '1', title: 'Akkoord op de offerte', desc: 'Bevestig eenvoudig via WhatsApp, mail of onderteken met de groene knop onderaan.' },
              { step: '2', title: 'Digitale tekening ter bevestiging', desc: 'Je ontvangt een maattekening van jouw buitenkeuken. Zo weet je precies wat je krijgt.' },
              { step: '3', title: 'Productie door onze vakspecialisten', badge: '3 TOT 5 WEKEN', desc: 'Jouw keuken wordt met de hand gemaakt door onze vakspecialisten.' },
              { step: '4', title: 'Bezorging inhuizen', badge: 'GRATIS', desc: 'We leveren de buitenkeuken op het moment dat jou uitkomt.' },
              { step: '5', title: 'Garantie & nazorg', desc: 'Met garantie op het product en advies over onderhoud.' }
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#3E4E36] text-[#FDFBF7] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  {s.step}
                </div>
                <div className="flex-1 bg-[#EDE8DF]/50 p-3 rounded-xl border border-[#C4BEB3]/60">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary text-xs">{s.title}</p>
                    {s.badge && <span className="bg-[#70624F] text-[#FDFBF7] text-[9px] font-mono font-bold px-2 py-0.5 rounded">{s.badge}</span>}
                  </div>
                  <p className="text-[11px] text-dark/75 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#EDE8DF] border border-[#C4BEB3] rounded-xl text-center space-y-1 italic font-serif">
            <p className="text-sm font-bold text-primary">"Geen massa. Geen tussenoplossing. Gewoon goed gemaakt. Voor jou."</p>
            <p className="text-[10px] font-mono text-accent font-semibold not-italic">Tim & Bram - Vanuit Ambacht</p>
          </div>

          <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-2">Pagina 5 van 6</div>
        </div>

        {/* ========================================================= */}
        {/* PAGE 6: APPROVAL & SIGNATURES (#FDFBF7)                    */}
        {/* ========================================================= */}
        <div className="bg-[#FDFBF7] rounded-xl shadow-lg border border-[#C4BEB3] p-6 sm:p-8 space-y-6 text-xs font-body text-dark">
          <div className="flex justify-between items-center border-b border-[#C4BEB3]/60 pb-2 text-[10px] font-mono text-accent font-bold">
            <span>VANUIT AMBACHT • AKKOORD</span>
            <span>Pagina 6 van 6</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-accent font-bold uppercase tracking-wider block">06 - AKKOORD</span>
            <h3 className="text-xl font-serif font-bold text-primary">Zullen we hem gaan maken?</h3>
          </div>

          <div className="p-5 bg-[#3E4E36] text-[#FDFBF7] rounded-xl space-y-3 shadow-md">
            <div>
              <h4 className="text-base font-serif font-bold text-[#FDFBF7]">Akkoord geven kan in één minuut</h4>
              <p className="text-xs text-[#D6CFC2] mt-0.5">Klik onderaan op de groene knop 'Akkoord geven' om digitaal te bevestigen, of neem contact op via WhatsApp.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <a href="https://wa.me/31682008005" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 bg-[#70624F] hover:bg-[#5e5241] text-[#FDFBF7] text-xs font-mono font-bold rounded-lg transition-colors inline-flex items-center gap-1.5">
                💬 WhatsApp - 06 82 00 80 05
              </a>
              <a href="mailto:info@vanuitambacht.nl" className="px-3.5 py-1.5 bg-[#70624F] hover:bg-[#5e5241] text-[#FDFBF7] text-xs font-mono font-bold rounded-lg transition-colors inline-flex items-center gap-1.5">
                ✉️ info@vanuitambacht.nl
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#EDE8DF]/70 rounded-xl border border-[#C4BEB3] space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider block">VOOR AKKOORD - OPDRACHTGEVER</span>
              <p className="font-bold text-primary text-sm">{approvalDetails?.signerName || quote.customer}</p>
              <div className="space-y-3 pt-2 text-[10px] font-mono text-dark/60">
                <div className="border-b border-dark/40 pb-1">Datum: {approvalDetails?.date || quote.date}</div>
                <div className="border-b border-dark/40 pb-4">
                  Handtekening: {isApprovedSuccess || quote.status === 'Akkoord' ? '✓ Digitaal Geaccepteerd' : ''}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#EDE8DF]/70 rounded-xl border border-[#C4BEB3] space-y-4">
              <span className="text-[10px] font-mono uppercase font-bold text-accent tracking-wider block">NAMENS VANUIT AMBACHT</span>
              <p className="font-bold text-primary text-sm">Tim & Bram</p>
              <div className="space-y-3 pt-2 text-[10px] font-mono text-dark/60">
                <div className="border-b border-dark/40 pb-1">Datum: {quote.date}</div>
                <div className="border-b border-dark/40 pb-4">Handtekening: Tim & Bram</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#C4BEB3] grid grid-cols-3 gap-4 text-[10px] font-mono text-dark/70">
            <div>
              <span className="font-bold uppercase text-primary block">ADRES</span>
              Vanuit Ambacht B.V.<br />Keizersgracht 402<br />1016 GC Amsterdam
            </div>
            <div>
              <span className="font-bold uppercase text-primary block">CONTACT</span>
              06 82 00 80 05<br />info@vanuitambacht.nl<br />vanuitambacht.nl
            </div>
            <div>
              <span className="font-bold uppercase text-primary block">GEGEVENS</span>
              KvK 93067429<br />BTW NL866264863B01<br />IBAN NL48 INGB 0001 2345 67
            </div>
          </div>

          <div className="text-right text-[10px] text-dark/50 font-mono font-semibold pt-1">Pagina 6 van 6</div>
        </div>

      </main>

      {/* ========================================================= */}
      {/* STICKY FLOATING APPROVAL BAR (BOTTOM OF SCREEN)          */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#3E4E36] text-[#FDFBF7] border-t-2 border-[#70624F] p-3 sm:p-4 shadow-2xl backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#70624F]/30 rounded-lg border border-[#70624F]/50 hidden sm:block">
              <FileText className="w-6 h-6 text-[#D6CFC2]" />
            </div>
            <div>
              <span className="text-[10px] text-[#D6CFC2] font-mono block uppercase">Totaal Investering (Incl. 21% BTW)</span>
              <p className="text-lg sm:text-xl font-mono font-bold text-white">{quote.amount || '€ 3.495,00'}</p>
            </div>
          </div>

          {isApprovedSuccess || quote.status === 'Akkoord' ? (
            <div className="flex items-center gap-2 bg-emerald-800/90 text-emerald-100 px-5 py-2.5 rounded-xl border border-emerald-400 font-bold text-xs sm:text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>✓ Offerte Officieel Digitaal Akkoord</span>
            </div>
          ) : isExpired ? (
            <div className="flex items-center gap-2 bg-amber-950 text-amber-200 px-4 py-2 rounded-xl border border-amber-600 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Offerte verlopen — Neem contact op met Tim & Bram</span>
            </div>
          ) : (
            <button
              onClick={() => setShowApprovalModal(true)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Akkoord geven (Approve Quote)</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* DIGITAL APPROVAL CONFIRMATION MODAL                      */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
              onClick={() => setShowApprovalModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#FDFBF7] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex justify-between items-start border-b border-[#C4BEB3] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary">Offerte Digitaal Ondertekenen</h3>
                    <p className="text-[11px] text-dark/60 font-mono">Vanuit Ambacht • Quote {quote.id}</p>
                  </div>
                </div>
                <button onClick={() => setShowApprovalModal(false)} className="p-1 text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApproveSubmit} className="space-y-4">
                <div className="p-3 bg-[#EDE8DF] rounded-xl border border-[#C4BEB3] space-y-1">
                  <p className="text-xs font-bold text-primary">Offerte Samenvatting:</p>
                  <p className="text-xs text-dark/80">Klant: <strong>{quote.customer}</strong></p>
                  <p className="text-xs text-dark/80">Project: <strong>{quote.project}</strong></p>
                  <p className="text-xs font-mono font-bold text-primary">Bedrag: {quote.amount}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-dark">
                    Uw Volledige Naam (Naam Ondertekenaar) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="bijv. Bjorn Valk"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#C4BEB3] rounded-xl text-sm text-dark font-body focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary rounded border-[#C4BEB3] focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-dark/80 cursor-pointer leading-relaxed">
                    Ik ga akkoord met deze offerte (<strong>{quote.id}</strong>) en de algemene voorwaarden van Vanuit Ambacht. Ik bevestig dat ik de bevoegde opdrachtgever ben.
                  </label>
                </div>

                <div className="p-3 bg-[#3E4E36]/10 border border-[#3E4E36]/20 rounded-xl text-[10px] text-dark/70 font-mono space-y-0.5">
                  <p>🔒 Beveiligde audit-trail logboek:</p>
                  <p>• Datum &amp; Tijdstipstempel geactiveerd</p>
                  <p>• E-mail notificatie naar info@vanuitambacht.nl</p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#C4BEB3]">
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 bg-dark/10 text-dark text-xs font-bold rounded-xl hover:bg-dark/20 transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={!signerName.trim() || !agreedTerms}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold font-heading rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Bevestigen &amp; Ondertekenen</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
