import React, { useState } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { 
  Sun, Moon, Check, Eye, MessageSquare, AlertCircle, Sparkles, ArrowRight, Layers 
} from 'lucide-react';

/**
 * GardenRoomDesignView Component (1-to-1 implementation of Client Mockup PDF Page 8 & Screenshot 1)
 * 
 * Features:
 * - Top Header Tag Bar (Project Code, Updates 3, WhatsApp us)
 * - Page Title & Subtitle
 * - Render Viewer Card (Day/Night Mode Toggle, 4 View Angle Thumbnails, Active Badge)
 * - Full-bleed Render Viewport (matching Screenshot 1 mockup 1-to-1)
 * - Material & Finishing Details Grid (Douglas, EPDM Flat Roof, Ceramic Tiles 60x60)
 * - Layout Diagram Bar (To scale: Poolhouse enclosed 3.00m + Lounge covered 5.00m = 8.00m)
 * - Specs 2x2 Grid (Dimensions, Timber, Roof, Build Time)
 * - Your Selections List (with Provisional Sum note)
 * - About Douglas Timber Info Card
 * - Design Version History Card (Version 2 Current vs Version 1, Submit Feedback button)
 */
export default function GardenRoomDesignView({ project = null }) {
  const [activeAngle, setActiveAngle] = useState('front'); // 'front' | 'side' | 'interior' | 'garden'
  const [isNightMode, setIsNightMode] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState('');

  const projectCode = project?.id || '2026-021';

  const viewAngles = [
    {
      id: 'front',
      name: 'Front View',
      badge: 'RENDER · FRONT VIEW · VERSION 2',
      thumbGradient: 'from-[#C5A072] to-[#B09267]',
      nightGradient: 'from-[#2D3A29] via-[#3D4E39] to-[#1E2B1D]',
      spotlight: 'radial-gradient(ellipse at 50% 40%, rgba(255, 220, 160, 0.4) 0%, rgba(0,0,0,0) 70%)'
    },
    {
      id: 'side',
      name: 'Side View',
      badge: 'RENDER · SIDE VIEW · VERSION 2',
      thumbGradient: 'from-[#B09267] to-[#8F7550]',
      nightGradient: 'from-[#2B3828] via-[#384A35] to-[#1C281B]',
      spotlight: 'radial-gradient(ellipse at 40% 40%, rgba(255, 220, 160, 0.4) 0%, rgba(0,0,0,0) 70%)'
    },
    {
      id: 'interior',
      name: 'Interior Poolhouse',
      badge: 'RENDER · INTERIOR POOLHOUSE · VERSION 2',
      thumbGradient: 'from-[#9C825B] to-[#756040]',
      nightGradient: 'from-[#3A2E20] via-[#524230] to-[#241B13]',
      spotlight: 'radial-gradient(ellipse at 60% 35%, rgba(255, 220, 160, 0.45) 0%, rgba(0,0,0,0) 65%)'
    },
    {
      id: 'garden',
      name: 'From the Garden',
      badge: 'RENDER · FROM THE GARDEN · VERSION 2',
      thumbGradient: 'from-[#4D5E44] to-[#2E3C27]',
      nightGradient: 'from-[#223220] via-[#32452F] to-[#162315]',
      spotlight: 'radial-gradient(ellipse at 50% 45%, rgba(255, 220, 160, 0.35) 0%, rgba(0,0,0,0) 75%)'
    }
  ];

  const currentView = viewAngles.find(v => v.id === activeAngle) || viewAngles[0];

  const handleSendFeedback = () => {
    setFeedbackToast('Feedback form opened! You can describe requested modifications for Version 3.');
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
          Custom Garden Room — project {projectCode}
        </span>
        <div className="flex items-center gap-2">
          <span className="bg-cream border border-[#D6CFC2] px-2 py-0.5 rounded-md font-bold text-[11px]">
            Updates 3
          </span>
          <a
            href="https://wa.me/31682008025"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-cream px-3 py-1 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            <span>WhatsApp us</span>
          </a>
        </div>
      </div>

      {/* 2. PAGE TITLE & SUBTITLE */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary">
          Design & renders
        </h1>
        <p className="text-xs text-dark/70 font-medium">
          This is how your garden room will look. View all angles — and see it at night too.
        </p>
      </div>

      {/* 3. RENDER VIEWER CARD (Matching Screenshot 1 1-to-1) */}
      <div className="bg-white border border-[#D6CFC2] p-4 sm:p-5 rounded-2xl shadow-xs space-y-4">
        {/* Render Viewer Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#D6CFC2]/60 pb-3">
          <h2 className="text-lg font-heading font-bold text-primary">
            Render viewer
          </h2>

          <div className="flex items-center gap-2 text-xs">
            {/* Version Pill (Soft Blue-Gray Matching Screenshot 1) */}
            <span className="bg-[#D7E3EC] text-[#2B4B68] px-3 py-1 rounded-full font-mono text-[11px] font-bold">
              • Version 2 · 14 August
            </span>

            {/* Day / Night Switcher Buttons */}
            <div className="flex items-center bg-[#EDE8DF] border border-[#D6CFC2] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setIsNightMode(false)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isNightMode ? 'bg-[#2B3827] text-white shadow-xs' : 'text-dark/70 hover:text-dark'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Day</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNightMode(true)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  isNightMode ? 'bg-[#2B3827] text-white shadow-xs' : 'text-dark/70 hover:text-dark'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Night</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full-Bleed Render Viewport (Matching Screenshot 1 1-to-1) */}
        <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-[#D6CFC2] shadow-xs transition-all duration-500">
          {/* Full-bleed Timber Render Texture Backdrop */}
          <div className={`w-full h-full bg-gradient-to-br ${
            isNightMode ? currentView.nightGradient : currentView.thumbGradient
          } relative flex flex-col justify-end p-4 transition-all duration-500`}>
            
            {/* Real Vertical Wood Slat Plank Lines Pattern (Crisp in Night Mode) */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-300" 
              style={{
                opacity: isNightMode ? 0.65 : 0.4,
                mixBlendMode: isNightMode ? 'overlay' : 'overlay',
                backgroundImage: isNightMode
                  ? 'repeating-linear-gradient(90deg, rgba(255, 230, 190, 0.4) 0px, rgba(255, 230, 190, 0.4) 2px, transparent 2px, transparent 16px)'
                  : 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 16px)'
              }}
            />

            {/* Warm Night Ambient Spotlight Lighting Effect */}
            {isNightMode && (
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-500" 
                style={{ background: currentView.spotlight }}
              />
            )}

            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Active Render Badge (Bottom-Left 1-to-1) */}
            <div className="relative z-10 self-start bg-[#232B20]/85 text-cream px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider uppercase font-bold backdrop-blur-xs shadow-xs border border-white/10">
              {currentView.badge} {isNightMode ? '· NIGHT' : ''}
            </div>
          </div>
        </div>

        {/* 4 Interactive View Thumbnails Row (Matching Screenshot 1 1-to-1) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
          {viewAngles.map((angle) => {
            const isSelected = activeAngle === angle.id;
            return (
              <button
                key={angle.id}
                type="button"
                onClick={() => setActiveAngle(angle.id)}
                className={`group rounded-xl border transition-all overflow-hidden cursor-pointer ${
                  isSelected 
                    ? 'border-2 border-primary bg-white shadow-sm ring-2 ring-primary/20' 
                    : 'border-[#D6CFC2] bg-white hover:bg-gray-50'
                }`}
              >
                {/* Thumbnail Image Box with Vertical Wood Slat Lines */}
                <div className={`w-full h-16 sm:h-20 bg-gradient-to-br ${
                  isNightMode ? angle.nightGradient : angle.thumbGradient
                } relative border-b border-[#D6CFC2] overflow-hidden`}>
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-300" 
                    style={{
                      opacity: isNightMode ? 0.6 : 0.4,
                      backgroundImage: isNightMode
                        ? 'repeating-linear-gradient(90deg, rgba(255, 230, 190, 0.35) 0px, rgba(255, 230, 190, 0.35) 2px, transparent 2px, transparent 14px)'
                        : 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 14px)'
                    }}
                  />
                  {isNightMode && (
                    <div 
                      className="absolute inset-0 pointer-events-none" 
                      style={{ background: angle.spotlight }}
                    />
                  )}
                </div>

                {/* Label Bar Below Thumbnail */}
                <div className="p-2 text-center">
                  <span className={`text-xs font-bold font-body block truncate ${
                    isSelected ? 'text-primary' : 'text-dark/70 group-hover:text-dark'
                  }`}>
                    {angle.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>



        {/* Footnote Caption */}
        <p className="text-[11px] text-dark/60 italic pt-1">
          Impression based on your choices. Color and wood grain may vary in reality — wood is natural material.
        </p>
      </div>

      {/* 4. MAIN CONTENT GRID (Left 2/3 Column vs Right 1/3 Column) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2 Columns wide) */}
        <div className="md:col-span-2 space-y-6">
          {/* Material & Finishing Details Card */}
          <div className="bg-white border border-[#D6CFC2] p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-base font-heading font-bold text-primary">
              Material & finishing in detail
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Material 1: Douglas */}
              <div className="bg-[#FFFDF9] border border-[#D6CFC2] p-3.5 rounded-xl space-y-2">
                <div className="w-full h-20 bg-[#B09267] rounded-lg border border-[#8F7550] flex items-end p-2 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 14px)'
                    }}
                  />
                  <span className="relative z-10 bg-dark/70 text-cream text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-xs">
                    DOUGLAS
                  </span>
                </div>
                <h4 className="font-heading font-bold text-primary text-xs">
                  Douglas, fine-sawn
                </h4>
                <p className="text-[11px] text-dark/70 leading-relaxed">
                  Warm reddish brown, grays nicely. Lifespan 10-15 years, longer with maintenance.
                </p>
              </div>


              {/* Material 2: EPDM Flat Roof */}
              <div className="bg-[#FFFDF9] border border-[#D6CFC2] p-3.5 rounded-xl space-y-2">
                <div className="w-full h-20 bg-[#363F47] rounded-lg border border-[#232930] flex items-end p-2">
                  <span className="bg-dark/70 text-cream text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-xs">
                    FLAT ROOF
                  </span>
                </div>
                <h4 className="font-heading font-bold text-primary text-xs">
                  EPDM roof & aluminum trim
                </h4>
                <p className="text-[11px] text-dark/70 leading-relaxed">
                  Low maintenance and 100% waterproof, sleek anthracite edge.
                </p>
              </div>

              {/* Material 3: Ceramic Tiles */}
              <div className="bg-[#FFFDF9] border border-[#D6CFC2] p-3.5 rounded-xl space-y-2">
                <div className="w-full h-20 bg-[#9C9488] rounded-lg border border-[#827A6F] flex items-end p-2">
                  <span className="bg-dark/70 text-cream text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-xs">
                    FLOOR
                  </span>
                </div>
                <h4 className="font-heading font-bold text-primary text-xs">
                  Ceramic tiles 60×60
                </h4>
                <p className="text-[11px] text-dark/70 leading-relaxed">
                  In the poolhouse section, greige color — cool in summer, easy to clean.
                </p>
              </div>
            </div>

            {/* Layout Diagram Bar (To Scale) */}
            <div className="pt-3 border-t border-[#D6CFC2]/60 space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
                LAYOUT · LEFT TO RIGHT
              </span>

              <div className="space-y-1.5">
                <div className="flex w-full h-12 rounded-xl overflow-hidden border border-[#D6CFC2] font-mono text-xs font-bold">
                  {/* Left 3m: Enclosed Poolhouse */}
                  <div className="w-[37.5%] bg-[#3E4E36] text-cream flex items-center justify-center p-2 text-center text-[11px]">
                    poolhouse enclosed 3.00 m
                  </div>
                  {/* Right 5m: Covered Lounge */}
                  <div className="w-[62.5%] bg-white text-primary flex items-center justify-center p-2 text-center text-[11px]">
                    lounge covered 5.00 m
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-dark/50 px-1">
                  <span>0 m</span>
                  <span>8.00 m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1 Column wide) */}
        <div className="space-y-6">
          {/* 2x2 Specs Grid Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-[#EDE9E3] border border-[#D8D2C5] p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">DIMENSIONS</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">8.00 × 4.00</div>
              <div className="text-xs font-medium text-dark/70">meter, height 2.60 m</div>
            </div>

            <div className="bg-[#E3E8DF] border border-[#C8D2C2] p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">TIMBER TYPE</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">Douglas</div>
              <div className="text-xs font-medium text-dark/70">fine-sawn, treated</div>
            </div>

            <div className="bg-[#EDE9E3] border border-[#D8D2C5] p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">ROOF</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">Flat roof</div>
              <div className="text-xs font-medium text-dark/70">EPDM · aluminum trim</div>
            </div>

            <div className="bg-[#E3E8DF] border border-[#C8D2C2] p-4 rounded-2xl space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold text-accent tracking-wider block">BUILD TIME</span>
              <div className="text-base sm:text-lg font-bold text-primary font-heading">2 weeks</div>
              <div className="text-xs font-medium text-dark/70">week 41 & 42 (tentative)</div>
            </div>
          </div>


          {/* Your Selections Card */}
          <div className="bg-white border border-[#D6CFC2] p-4 rounded-2xl shadow-xs space-y-3">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent block">
              YOUR SELECTIONS
            </span>

            <ul className="space-y-2 text-xs text-dark/80">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Enclosed poolhouse (3.00 m) with sliding glass door on south side</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Covered lounge (5.00 m) with open sides</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Electrical package: 4 spots, wall socket, switch*</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Ceramic floor tiles in poolhouse section</span>
              </li>
              <li className="flex items-start gap-2 text-dark/50 italic">
                <span className="w-4 h-4 border border-dark/30 rounded-full flex-shrink-0 mt-0.5 inline-block" />
                <span>Outdoor kitchen in lounge — not selected | want to know the price?</span>
              </li>
            </ul>

            <p className="text-[10px] text-dark/50 italic border-t border-[#D6CFC2]/60 pt-2">
              * provisional sum — definitive after site survey
            </p>
          </div>

          {/* About Douglas Timber Info Card */}
          <div className="bg-[#FAF8F5] border border-[#D8D2C5] p-5 sm:p-5 rounded-2xl space-y-2 text-xs text-dark/80 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono font-bold tracking-wider text-accent block pt-0.5">
              ABOUT DOUGLAS TIMBER
            </span>
            <p className="leading-relaxed text-xs text-dark/70 font-medium">
              Strong European softwood with a warm appearance. Untreated it turns silver-gray; an annual maintenance preserves its reddish-brown glow.
            </p>
          </div>

        </div>
      </div>

      {/* 5. DESIGN VERSIONS CARD (1-to-1 Client Mockup PDF Page 8) */}
      <div className="bg-white border border-[#D6CFC2] p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#D6CFC2]/60 pb-3">
          <h3 className="text-base font-heading font-bold text-primary">
            Versions of your design
          </h3>
          <span className="text-xs text-dark/60">
            See exactly what changed per version
          </span>
        </div>

        <div className="space-y-3">
          {/* Version 2 (Current) */}
          <div className="bg-[#FFFDF9] border border-green-300 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-primary text-sm">
                  Version 2
                </h4>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Current
                </span>
              </div>
              <p className="text-xs text-dark/70 leading-relaxed">
                14 August 2026 · sliding door moved to south side, overhang widened 40 cm — following your feedback on afternoon sun.
              </p>
            </div>

            <button
              type="button"
              className="px-3.5 py-1.5 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-lg hover:bg-gray-50 transition-all cursor-pointer flex-shrink-0"
            >
              View
            </button>
          </div>

          {/* Version 1 */}
          <div className="bg-white border border-[#D6CFC2] p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1 max-w-2xl">
              <h4 className="font-heading font-bold text-primary text-sm">
                Version 1
              </h4>
              <p className="text-xs text-dark/60 leading-relaxed">
                6 August 2026 · initial design based on quote.
              </p>
            </div>

            <button
              type="button"
              className="px-3.5 py-1.5 bg-white text-dark/80 border border-[#D6CFC2] text-xs font-bold rounded-lg hover:bg-gray-50 transition-all cursor-pointer flex-shrink-0"
            >
              View
            </button>
          </div>
        </div>

        {/* Card Footer Note & Action Button */}
        <div className="pt-3 border-t border-[#D6CFC2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-dark/70">
            Is something not right in version 2, or would you like to see something else?
          </p>

          <button
            type="button"
            onClick={handleSendFeedback}
            className="px-4 py-2 bg-primary text-cream text-xs font-bold rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-xs flex-shrink-0"
          >
            Submit feedback
          </button>
        </div>
      </div>
    </div>
  );
}
