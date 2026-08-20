import React, { useState } from 'react';
import { MessageSquare, Sparkles, Check, Download, ShieldCheck, Star, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import { downloadDirectPdfFile } from '../../utils/pdfGenerator';
import outdoorKitchenRender from '../../assets/outdoor_project_card.png';

/**
 * OutdoorKitchenHandoverView Component (1-to-1 implementation of Client Mockup PDF Outdoor Kitchen Screen 9)
 * 
 * 100% Responsive & Non-Overlapping Layout:
 * - Top Tag Bar (Custom Outdoor Kitchen — project 2026-014, Updates 3, WhatsApp us)
 * - Page Title & Subtitle (Handover & Aftercare)
 * - Photo Banner Card (IN YOUR GARDEN · 15 SEPTEMBER 2026)
 * - Section 1: Handover Approval Grid (Is everything correct? [2 cols] + Warranty & Aftercare soft greige card [1 col])
 * - Section 2: Maintenance in three steps (Full width 3-step maintenance card)
 * - Section 3: Bottom 2 Cards Grid (Side-by-side on sm/md/lg: Google Review/Instagram + Build further in your garden)
 */
export default function OutdoorKitchenHandoverView({ project = null }) {
  const [feedbackToast, setFeedbackToast] = useState('');
  const [checklist, setChecklist] = useState({
    drawingComplete: true,
    noDamage: true,
    drawersHinges: true,
    instructionsReceived: true
  });

  const [confirmed, setConfirmed] = useState(false);
  const [springReminder, setSpringReminder] = useState(true);

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
    <div className="space-y-4 sm:space-y-5 font-body text-[#4A4A43] w-full">
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
        <p className="text-xs sm:text-[13px] text-dark/70 font-medium">
          Delivered on 15 September 2026. Enjoy cooking — and we remain reachable.
        </p>
      </div>

      {/* 3. PHOTO BANNER CARD */}
      <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-2 sm:p-2.5 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="relative h-44 sm:h-52 w-full rounded-xl overflow-hidden bg-cover bg-center border border-[#D6CFC2]/60 flex items-end p-4" style={{ backgroundImage: `url(${outdoorKitchenRender})` }}>
          <div className="bg-[#2B3827]/90 backdrop-blur-xs text-white font-mono text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
            IN YOUR GARDEN · 15 SEPTEMBER 2026
          </div>
        </div>
      </div>

      {/* 4. SECTION 1: HANDOVER APPROVAL & WARRANTY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Card: Is Everything Correct? (2 Columns wide on lg) */}
        <div className="lg:col-span-2 bg-[#FAF8F5] border border-[#D8D2C5] p-4 sm:p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-primary text-base sm:text-lg">
              Is everything correct?
            </h3>
            <p className="text-xs sm:text-[13px] text-dark/70 leading-relaxed font-medium">
              We went through the checklist together. Confirm below, then delivery is complete. Notice something later? Aftercare is always available.
            </p>

            {/* Checkbox List */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.drawingComplete}
                  onChange={() => toggleCheck('drawingComplete')}
                  className="w-4 h-4 rounded text-primary border-[#D6CFC2] focus:ring-primary accent-[#2B3827]"
                />
                <span>Delivered complete according to drawing</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.noDamage}
                  onChange={() => toggleCheck('noDamage')}
                  className="w-4 h-4 rounded text-primary border-[#D6CFC2] focus:ring-primary accent-[#2B3827]"
                />
                <span>No damage to wood or worktop</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.drawersHinges}
                  onChange={() => toggleCheck('drawersHinges')}
                  className="w-4 h-4 rounded text-primary border-[#D6CFC2] focus:ring-primary accent-[#2B3827]"
                />
                <span>Drawers and hinges operating smoothly</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
                <input
                  type="checkbox"
                  checked={checklist.instructionsReceived}
                  onChange={() => toggleCheck('instructionsReceived')}
                  className="w-4 h-4 rounded text-primary border-[#D6CFC2] focus:ring-primary accent-[#2B3827]"
                />
                <span>Explanation of use and maintenance received</span>
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

        {/* Right Card: Warranty & Aftercare (1 Column wide on lg - Soft Greige bg-[#EAE6DD]) */}
        <div className="lg:col-span-1 bg-[#EAE6DD] border border-[#C8C2B4] p-4 sm:p-5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#70624F] block">
              WARRANTY & AFTERCARE
            </span>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              Warranty on structure and finish, plus aftercare post delivery. Something loosened or a question about maintenance? One message is enough.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadWarranty}
              className="w-full py-2 bg-white text-dark/80 border border-[#C8C2B4] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs text-center block"
            >
              Download warranty certificate
            </button>

            <button
              type="button"
              onClick={() => {
                setFeedbackToast('Aftercare request sent to Tim & Bram!');
                setTimeout(() => setFeedbackToast(''), 3500);
              }}
              className="w-full py-2 bg-white text-dark/80 border border-[#C8C2B4] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs text-center block"
            >
              Request aftercare
            </button>
          </div>
        </div>

      </div>

      {/* 5. SECTION 2: MAINTENANCE IN THREE STEPS (Full Width Container Card) */}
      <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
        <div className="space-y-0.5">
          <h3 className="font-heading font-bold text-primary text-base sm:text-lg">
            Maintenance in three steps
          </h3>
          <p className="text-xs text-dark/70 font-medium">
            How to keep your outdoor kitchen beautiful for 20 years. We send a short reminder every season.
          </p>
        </div>

        {/* 3 Numbered Steps List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-[#F5F2EC] border border-[#D6CFC2] p-3.5 rounded-xl space-y-1 shadow-2xs">
            <span className="font-bold font-heading text-primary text-sm font-mono block">1</span>
            <p className="text-[11px] sm:text-xs text-dark/80 leading-relaxed font-medium">
              Cleaning with water and a soft cloth — no aggressive chemicals.
            </p>
          </div>

          <div className="bg-[#F5F2EC] border border-[#D6CFC2] p-3.5 rounded-xl space-y-1 shadow-2xs">
            <span className="font-bold font-heading text-primary text-sm font-mono block">2</span>
            <p className="text-[11px] sm:text-xs text-dark/80 leading-relaxed font-medium">
              Lightly sand and oil once a year, preferably in spring.
            </p>
          </div>

          <div className="bg-[#F5F2EC] border border-[#D6CFC2] p-3.5 rounded-xl space-y-1 shadow-2xs">
            <span className="font-bold font-heading text-primary text-sm font-mono block">3</span>
            <p className="text-[11px] sm:text-xs text-dark/80 leading-relaxed font-medium">
              Cover worktop during prolonged frost or extreme heat.
            </p>
          </div>
        </div>

        {/* Reminder Checkbox */}
        <div className="pt-2 border-t border-[#D6CFC2]/40">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-dark/80 hover:text-primary">
            <input
              type="checkbox"
              checked={springReminder}
              onChange={(e) => setSpringReminder(e.target.checked)}
              className="w-4 h-4 rounded text-primary border-[#D6CFC2] focus:ring-primary accent-[#2B3827]"
            />
            <span>Send me a maintenance reminder in spring</span>
          </label>
        </div>
      </div>

      {/* 6. SECTION 3: BOTTOM 2 CARDS GRID (Side-by-Side Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Card 1: Would you like to help us? */}
        <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4.5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-primary text-xs sm:text-sm">
              Would you like to help us?
            </h4>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              Word-of-mouth is everything to us. A short review helps the next customer enormously — and us even more.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-[#2B3827] text-white text-xs font-bold rounded-xl text-center block hover:bg-[#1F291C] transition-all shadow-xs"
            >
              Leave review on Google
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl text-center block hover:bg-gray-50 transition-all shadow-2xs"
            >
              Share photo on Instagram
            </a>
          </div>
        </div>

        {/* Card 2: Build further in your garden? */}
        <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4.5 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between items-start">
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-primary text-xs sm:text-sm">
              Build further in your garden?
            </h4>
            <p className="text-xs text-dark/70 leading-relaxed font-medium">
              Many customers continue after their outdoor kitchen with a canopy or garden room. Returning customer? We offer sharp pricing.
            </p>
          </div>

          <div className="pt-1 w-full">
            <button
              type="button"
              onClick={() => {
                setFeedbackToast('Price indication requested! We will reach out with a custom proposal.');
                setTimeout(() => setFeedbackToast(''), 4000);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs text-center block"
            >
              Request price indication
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
