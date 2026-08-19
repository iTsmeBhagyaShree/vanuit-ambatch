import React, { useState } from 'react';
import { Check, MessageSquare, Sparkles } from 'lucide-react';
import { downloadDirectPdfFile } from '../../utils/pdfGenerator';

/**
 * OutdoorKitchenDesignView Component (1-to-1 implementation of Client Mockup PDF Outdoor Kitchen Screen 3 & Screenshot 1)
 * 
 * Meticulous 1-to-1 visual parity:
 * - Top Header Tag Bar (Project Code, Updates 3, WhatsApp us)
 * - Page Title & Subtitle
 * - Full-Bleed Render Viewport (Optimal ~240px height, crisp vertical timber slat plank texture lines, RENDER badge)
 * - Layout Diagram Bar (2 Drawer Cabinet cards, Dark Forest Green Big Green Egg cutout card, Open Compartment card, Dotted scale line 0 to 240cm)
 * - 2x2 Specs Cards Grid (Alternating Soft Greige bg-[#EDE9E3] vs Soft Pale Sage bg-[#E3E8DF])
 * - About Thermo Fraké Info Card
 * - Your Choices Card (Worktop, Layout & Storage, Water & Cooling, Finishing & Delivery)
 * - Working Drawing Card (Werktekening preview box, Version 2 badge, soft blue • New pill, View & Download buttons, Question link)
 */
export default function OutdoorKitchenDesignView({ project = null }) {
  const [feedbackToast, setFeedbackToast] = useState('');

  const projectCode = project?.id || '2026-014';
  const city = project?.city || 'Oisterwijk';

  const handleDownloadDrawing = () => {
    downloadDirectPdfFile('drawing');
    setFeedbackToast('Working Drawing PDF downloaded successfully!');
    setTimeout(() => setFeedbackToast(''), 4000);
  };

  return (
    <div className="space-y-6 font-body text-[#4A4A43] max-w-5xl w-full mx-auto">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-20 right-4 z-[9999] flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-xl border border-primary/20 text-xs">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. TOP HEADER TAG BAR (1-to-1 Client Mockup Screenshot 1) */}
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
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary">
          Design & options
        </h1>
        <p className="text-xs text-dark/70 font-medium">
          This is what we are building for you, exactly as agreed in the quote. Notice anything unexpected? Send us a message.
        </p>
      </div>

      {/* 3. MAIN CONTENT GRID (Left 2/3 Column vs Right 1/3 Column) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2 Columns wide) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Render & Layout Main Card (Soft Warm Off-White Matching Screenshot 1) */}
          <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 sm:p-5 rounded-2xl shadow-xs space-y-4">
            
            {/* Full-Bleed Render Viewport (Height ~240px matching Screenshot 1 1-to-1) */}
            <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden border border-[#D6CFC2] shadow-xs">
              <div className="w-full h-full bg-gradient-to-br from-[#C5A072] to-[#B09267] relative flex flex-col justify-end p-4">
                
                {/* Vertical Wood Cladding Slats Texture Pattern */}
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" 
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 16px)'
                  }}
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* Render Badge (Bottom-Left 1-to-1) */}
                <div className="relative z-10 self-start bg-[#232B20]/85 text-cream px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider uppercase font-bold backdrop-blur-xs shadow-xs border border-white/10">
                  RENDER · YOUR DESIGN
                </div>
              </div>
            </div>

            {/* Footnote Caption */}
            <p className="text-[11px] text-dark/60 italic border-b border-[#D6CFC2]/60 pb-3 leading-relaxed">
              Impression based on your choices. Color and wood grain may vary in reality — wood is natural material.
            </p>

            {/* Layout Diagram Bar (INDELING · VAN LINKS NAAR RECHTS 1-to-1) */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
                LAYOUT · LEFT TO RIGHT
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-body font-bold text-center">
                {/* Module 1: Cabinet with drawers */}
                <div className="bg-white border border-[#D6CFC2] p-3 rounded-2xl flex items-center justify-center text-primary text-xs font-semibold shadow-2xs min-h-[56px] sm:min-h-[64px]">
                  cabinet<br />with drawers
                </div>

                {/* Module 2: Cabinet with drawers */}
                <div className="bg-white border border-[#D6CFC2] p-3 rounded-2xl flex items-center justify-center text-primary text-xs font-semibold shadow-2xs min-h-[56px] sm:min-h-[64px]">
                  cabinet<br />with drawers
                </div>

                {/* Module 3: Cutout Big Green Egg (Dark Forest Green 1-to-1) */}
                <div className="bg-[#3E4E36] text-cream border border-[#2D3A29] p-3 rounded-2xl flex items-center justify-center text-xs font-bold shadow-xs min-h-[56px] sm:min-h-[64px]">
                  cutout<br />Big Green Egg
                </div>

                {/* Module 4: Open compartment cabinet */}
                <div className="bg-white border border-[#D6CFC2] p-3 rounded-2xl flex items-center justify-center text-primary text-xs font-semibold shadow-2xs min-h-[56px] sm:min-h-[64px]">
                  cabinet<br />open compartment
                </div>
              </div>

              {/* Dotted Scale Dimension Line (0 cm ........ 240 cm) */}
              <div className="relative pt-2">
                <div className="border-b border-dotted border-[#C4BEB3] w-full absolute top-4 left-0" />
                <div className="flex justify-between items-center text-[10px] font-mono text-dark/50 relative z-10 px-1">
                  <span className="bg-[#FAF8F5] px-1 font-bold">0 cm</span>
                  <span className="bg-[#FAF8F5] px-1 font-bold">240 cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Your Choices Card (JOUW KEUZES Matching Screenshot 1) */}
          <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 sm:p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-primary border-b border-[#D6CFC2]/60 pb-2">
              Your choices
            </h3>

            <div className="space-y-4 text-xs text-dark/80">
              {/* Section 1: Worktop */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
                  WORKTOP
                </span>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Wooden worktop with ceramic stone inlay</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Cutout Big Green Egg Large, right of center</span>
                  </li>
                </ul>
              </div>

              {/* Section 2: Layout & Storage */}
              <div className="space-y-2 pt-2 border-t border-[#D6CFC2]/50">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
                  LAYOUT & STORAGE
                </span>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Two cabinet modules with soft-close drawers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>One open compartment for wood or accessories</span>
                  </li>
                </ul>
              </div>

              {/* Section 3: Water & Cooling */}
              <div className="space-y-2 pt-2 border-t border-[#D6CFC2]/50">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
                  WATER & COOLING
                </span>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Tap & sink with connection to outdoor water supply</span>
                  </li>
                  <li className="flex items-start gap-2 text-dark/50 italic">
                    <span className="w-4 h-4 border border-dark/30 rounded-full flex-shrink-0 mt-0.5 inline-block" />
                    <span>Refrigerator — not selected | want to know the price?</span>
                  </li>
                </ul>
              </div>

              {/* Section 4: Finishing & Delivery */}
              <div className="space-y-2 pt-2 border-t border-[#D6CFC2]/50">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
                  FINISHING & DELIVERY
                </span>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Two coats of protective oil, natural color finish</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Heavy-duty swivel wheels with brake, for easy repositioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Free delivery and installation in {city}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1 Column wide) */}
        <div className="space-y-6">
          
          {/* 2x2 Specs Cards Grid (Responsive Grid 1 col on mobile, 2 col on tablet/desktop) */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {/* Card 1: AFMETING (Soft Greige bg-[#EDE9E3]) */}
            <div className="bg-[#EDE9E3] border border-[#D8D2C5] p-3.5 sm:p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">DIMENSIONS</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">240 × 80</div>
              <div className="text-xs font-medium text-dark/70">centimeter</div>
            </div>

            {/* Card 2: HOUTSOORT (Soft Pale Sage bg-[#E3E8DF]) */}
            <div className="bg-[#E3E8DF] border border-[#C8D2C2] p-3.5 sm:p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">TIMBER TYPE</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">Thermo Fraké</div>
              <div className="text-xs font-medium text-dark/70">lifespan 20 to 25 yrs</div>
            </div>

            {/* Card 3: UITSPARING (Soft Greige bg-[#EDE9E3]) */}
            <div className="bg-[#EDE9E3] border border-[#D8D2C5] p-3.5 sm:p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">CUTOUT</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">Big Green Egg</div>
              <div className="text-xs font-medium text-dark/70">Large, right of center</div>
            </div>

            {/* Card 4: LEVERTIJD (Soft Pale Sage bg-[#E3E8DF]) */}
            <div className="bg-[#E3E8DF] border border-[#C8D2C2] p-3.5 sm:p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">DELIVERY TIME</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">3 to 5 weeks</div>
              <div className="text-xs font-medium text-dark/70">after your approval</div>
            </div>
          </div>


          {/* About Thermo Fraké Info Card (OVER THERMO FRAKÉ) */}
          <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-5 sm:p-5 rounded-2xl space-y-2 text-xs text-dark/80 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold tracking-wider text-accent block pt-0.5">
              ABOUT THERMO FRAKÉ
            </span>
            <p className="leading-relaxed text-xs sm:text-xs text-dark/70 font-medium">
              Thermally modified timber: heat treatment ensures minimal shrinkage and movement, without chemicals. Grays evenly and lasts 20 to 25 years.
            </p>
          </div>



          {/* Working Drawing Card (Werktekening 1-to-1 Client Mockup Screenshot 1) */}
          <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-4 rounded-2xl shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-[#D6CFC2]/60 pb-2">
              <h4 className="font-heading font-bold text-primary text-sm">
                Working drawing
              </h4>
              {/* Soft Blue Badge matching Screenshot 1 */}
              <span className="bg-[#D7E3EC] text-[#2B4B68] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                • New
              </span>
            </div>

            {/* Blueprint Drawing Preview Box */}
            <div className="w-full h-32 bg-[#5A6472] rounded-xl border border-[#485260] relative overflow-hidden flex flex-col justify-end p-3 shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 bg-[#232B20]/90 text-cream px-2.5 py-1 rounded-md text-[9px] font-mono tracking-wider uppercase font-bold self-start backdrop-blur-xs border border-white/10">
                DRAWING · VERSION 2
              </div>
            </div>

            <p className="text-[11px] text-dark/70 leading-relaxed">
              Shared on 12 August 2026. Contains all measurements, layout, and cutout placement — for review, so you know exactly what is being built.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadDrawing}
                className="flex-1 px-3 py-1.5 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-center shadow-2xs"
              >
                View drawing
              </button>

              <button
                type="button"
                onClick={handleDownloadDrawing}
                className="flex-1 px-3 py-1.5 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-center shadow-2xs"
              >
                Download
              </button>
            </div>

            <a
              href="https://wa.me/31682008025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-primary hover:underline font-bold inline-block pt-1"
            >
              Question about drawing?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
