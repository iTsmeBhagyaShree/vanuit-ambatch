import React, { useState } from 'react';
import { MessageSquare, Sparkles, Check, Download, ShieldCheck, Star, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import { downloadDirectPdfFile } from '../../utils/pdfGenerator';
import outdoorKitchenRender from '../../assets/outdoor_project_card.png';

/**
 * OutdoorKitchenHandoverView Component (Tailored implementation of Outdoor Kitchen Screen 9 in English)
 * 
 * Features:
 * - Top Tag Bar (Custom Outdoor Kitchen — project 2026-014, Updates 3, WhatsApp us)
 * - Page Title & Subtitle (Handover & Aftercare)
 * - Photo Banner Card (YOUR OUTDOOR KITCHEN · 18 SEPTEMBER 2026)
 * - Handover Approval Grid (Is everything correct? with 4 checkboxes & confirm button + Warranty & Aftercare card)
 * - Seasonal Maintenance Calendar (Spring, Summer, Autumn, Winter + reminder checkbox)
 * - Bottom Row Cards (3-Month Checkup, Google Review & Instagram, Complete Your Outdoor Living cross-sell)
 */
export default function OutdoorKitchenHandoverView({ project = null }) {
  const [feedbackToast, setFeedbackToast] = useState('');
  const [checklist, setChecklist] = useState({
    drawing: true,
    worktop: true,
    appliances: true,
    terraceClean: true
  });

  const [confirmed, setConfirmed] = useState(false);
  const [seasonalReminder, setSeasonalReminder] = useState(true);

  const projectCode = project?.id || '2026-014';

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmHandover = () => {
    setConfirmed(true);
    setFeedbackToast('Handover confirmed! Final invoice (50%) & warranty certificate activated.');
    setTimeout(() => setFeedbackToast(''), 4000);
  };

  const handleDownloadWarranty = () => {
    downloadDirectPdfFile('warranty-certificate-outdoor-kitchen');
    setFeedbackToast('Downloaded Warranty Certificate (PDF)!');
    setTimeout(() => setFeedbackToast(''), 3500);
  };

  return (
    <div className="space-y-4 font-body text-[#4A4A43] w-full">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-20 right-4 z-[9999] flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-xl border border-primary/20 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. TOP HEADER TAG BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-dark/60">
        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-md font-bold">
          Custom Outdoor Kitchen — project {projectCode}
        </span>
        <div className="flex items-center gap-2">
          <span className="bg-cream border border-[#D6CFC2] px-2 py-0.5 rounded-md font-bold text-[11px]">
            Updates 3
          </span>
          <a
            href="https://wa.me/31682008025"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-cream px-3 py-1 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            <span>WhatsApp us</span>
          </a>
        </div>
      </div>

      {/* 2. PAGE TITLE & SUBTITLE */}
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-primary">
          Handover & Aftercare
        </h1>
        <p className="text-xs text-dark/70 font-medium">
          Handed over on 18 September 2026. Enjoy your outdoor kitchen — and we remain reachable.
        </p>
      </div>

      {/* 3. PHOTO BANNER CARD */}
      <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-2 sm:p-2.5 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden bg-cover bg-center border border-[#D6CFC2]/60 flex items-end p-4" style={{ backgroundImage: `url(${outdoorKitchenRender})` }}>
          <div className="bg-[#2B3827]/90 backdrop-blur-xs text-white font-mono text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
            YOUR OUTDOOR KITCHEN · 18 SEPTEMBER 2026
          </div>
        </div>
      </div>

      {/* 4. SECTION 1: HANDOVER APPROVAL & WARRANTY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Left Card: Is Everything Correct? (2 Columns wide) */}
        <div className="md:col-span-2 bg-[#FAF8F5] border border-[#D8D2C5] p-4 sm:p-4.5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-primary text-sm sm:text-base">
              Is everything correct?
            </h3>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              We inspected the outdoor kitchen together upon delivery. Confirm below — after that the final invoice (50%) follows. Notice something later? Aftercare is always available.
            </p>

            {/* Checkbox List */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.drawing}
                  onChange={() => toggleCheck('drawing')}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-[#D6CFC2]"
                />
                <span>Built according to drawing and specifications</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.worktop}
                  onChange={() => toggleCheck('worktop')}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-[#D6CFC2]"
                />
                <span>Granite/Beton Cire worktop level and sealed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.appliances}
                  onChange={() => toggleCheck('appliances')}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-[#D6CFC2]"
                />
                <span>Kamado cutout, sink and gas connections tested</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.terraceClean}
                  onChange={() => toggleCheck('terraceClean')}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-[#D6CFC2]"
                />
                <span>Terrace and workspace left clean and tidy</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleConfirmHandover}
              disabled={confirmed}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs ${
                confirmed
                  ? 'bg-[#E5F0E3] text-[#2D5A27] border border-[#2D5A27]/30'
                  : 'bg-[#2B3827] text-white hover:bg-[#1F291C]'
              }`}
            >
              {confirmed ? '✓ Confirmed & Handed Over' : 'Everything correct — confirm'}
            </button>

            <button
              type="button"
              onClick={() => {
                setFeedbackToast('Aftercare ticket created. Tim & Bram will contact you within 24h.');
                setTimeout(() => setFeedbackToast(''), 3500);
              }}
              className="px-4 py-2 bg-white text-dark/70 border border-[#D6CFC2] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
            >
              Something is not right
            </button>
          </div>
        </div>

        {/* Right Card: Warranty & Aftercare (1 Column wide) */}
        <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 sm:p-4.5 rounded-2xl shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
              WARRANTY & AFTERCARE
            </span>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              10-year warranty on timber frame & stainless hardware. And in three months we will contact you for the 3-month checkup.
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadWarranty}
              className="w-full py-2 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs text-center block"
            >
              Download warranty certificate
            </button>

            <button
              type="button"
              onClick={() => {
                setFeedbackToast('Aftercare request sent to Tim & Bram!');
                setTimeout(() => setFeedbackToast(''), 3500);
              }}
              className="w-full py-2 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs text-center block"
            >
              Request aftercare
            </button>
          </div>
        </div>

      </div>

      {/* 5. SECTION 2: SEASONAL MAINTENANCE CALENDAR */}
      <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 sm:p-4.5 rounded-2xl shadow-xs space-y-3">
        <div className="space-y-0.5">
          <h3 className="font-heading font-bold text-primary text-base">
            Maintenance Calendar
          </h3>
          <p className="text-xs text-dark/70 font-medium">
            How to keep your outdoor kitchen beautiful for 20 years. We send a short reminder every season.
          </p>
        </div>

        {/* 4 Seasonal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          {/* Spring */}
          <div className="bg-white border border-[#D6CFC2]/70 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
              SPRING
            </span>
            <h5 className="font-heading font-bold text-primary text-xs">
              Oil timber & check seals
            </h5>
            <p className="text-[11px] text-dark/70 leading-relaxed font-medium">
              Clean hardwood and apply 1 light coat of natural oil. Inspect worktop seal.
            </p>
          </div>

          {/* Summer */}
          <div className="bg-white border border-[#D6CFC2]/70 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
              SUMMER
            </span>
            <h5 className="font-heading font-bold text-primary text-xs">
              Clean worktop
            </h5>
            <p className="text-[11px] text-dark/70 leading-relaxed font-medium">
              Wipe down granite/beton cire with warm water and neutral soap after grilling.
            </p>
          </div>

          {/* Autumn */}
          <div className="bg-white border border-[#D6CFC2]/70 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
              AUTUMN
            </span>
            <h5 className="font-heading font-bold text-primary text-xs">
              Cover Kamado & drain water
            </h5>
            <p className="text-[11px] text-dark/70 leading-relaxed font-medium">
              Drain outdoor sink lines before first frost. Fit breathable Kamado cover.
            </p>
          </div>

          {/* Winter */}
          <div className="bg-white border border-[#D6CFC2]/70 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
              WINTER
            </span>
            <h5 className="font-heading font-bold text-primary text-xs">
              Winter protection
            </h5>
            <p className="text-[11px] text-dark/70 leading-relaxed font-medium">
              Keep ventilation slots clear under cover. Teak and steel withstand frost easily.
            </p>
          </div>

        </div>

        {/* Reminder Checkbox */}
        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
            <input
              type="checkbox"
              checked={seasonalReminder}
              onChange={(e) => setSeasonalReminder(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-[#D6CFC2]"
            />
            <span>Send me a seasonal maintenance reminder</span>
          </label>
        </div>
      </div>

      {/* 6. SECTION 3: BOTTOM 3 CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: The 3-month check */}
        <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 rounded-2xl shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-primary text-xs sm:text-sm">
              The 3-month check
            </h4>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              In December we get in touch: is everything working smoothly, hinges adjusted, are you satisfied? Small adjustments made on site.
            </p>
          </div>

          <div className="pt-1">
            <span className="bg-[#EDE9E3] text-[#70624F] font-mono text-[10px] font-bold px-2.5 py-1 rounded-md inline-block">
              Scheduled · December 2026
            </span>
          </div>
        </div>

        {/* Card 2: Would you like to help us? */}
        <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 rounded-2xl shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-primary text-xs sm:text-sm">
              Would you like to help us?
            </h4>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              Word-of-mouth is everything to us. A short review helps the next customer enormously — and us even more.
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 bg-[#2B3827] text-white text-xs font-bold rounded-xl text-center block hover:bg-[#1F291C] transition-all shadow-xs"
            >
              Leave review on Google
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl text-center block hover:bg-gray-50 transition-all shadow-2xs"
            >
              Share photo on Instagram
            </a>
          </div>
        </div>

        {/* Card 3: Complete your outdoor living? */}
        <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 rounded-2xl shadow-xs space-y-2.5 flex flex-col justify-between items-start">
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-primary text-xs sm:text-sm">
              Complete your outdoor living?
            </h4>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              Many customers combine their outdoor kitchen with a custom timber canopy or garden room. Returning customer? We offer sharp pricing.
            </p>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                setFeedbackToast('Price indication requested! We will reach out with a custom proposal.');
                setTimeout(() => setFeedbackToast(''), 4000);
              }}
              className="px-4 py-1.5 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs inline-block"
            >
              Request price indication
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
