import React, { useState } from 'react';
import Card from '../Card';
import WeekCard from './WeekCard';
import { Calendar } from 'lucide-react';

/**
 * WeekBar Component (Step 4 - Garden Room Extension)
 * 
 * Displays project construction timeline as horizontal week blocks.
 * Supports categories: Done, Now, Prep, Materials, Build.
 * Constrained horizontal scrolling for mobile responsiveness (~375px).
 */
export default function WeekBar({ weekSchedule = [] }) {
  // Default fallback 8-week schedule if data unavailable
  const defaultSchedule = [
    { weekNumber: 34, phaseNameEN: 'Site Survey & Inspection', phaseNameNL: 'Schouw & Inmeting', dateRange: '18 – 24 Aug', status: 'done', descriptionEN: 'Site survey completed on location. Dimensions and foundation verified.', descriptionNL: 'Schouw op locatie uitgevoerd. Afmetingen en fundering gecontroleerd.' },
    { weekNumber: 35, phaseNameEN: 'Preparation', phaseNameNL: 'Voorbereiding', dateRange: '25 – 31 Aug', status: 'done', descriptionEN: 'Timber preparation started in workshop. Douglas timber and EPDM ordered.', descriptionNL: 'Houtbewerking gestart in de werkplaats. Douglas en EPDM besteld.' },
    { weekNumber: 36, phaseNameEN: 'Materials', phaseNameNL: 'Materialen', dateRange: '01 – 07 Sep', status: 'now', descriptionEN: 'Cutting and oiling timber trusses. Quality control check completed.', descriptionNL: 'Zaagwerk en oliën van de houten gebinten. Kwaliteitscontrole door Tim & Bram.' },
    { weekNumber: 37, phaseNameEN: 'Workshop Assembly', phaseNameNL: 'Werkplaats voormontage', dateRange: '08 – 14 Sep', status: 'prep', descriptionEN: 'Prefab assembly of wall panels and roof trusses in workshop.', descriptionNL: 'Prefab montage van de wanden en dakspanten in de werkplaats.' },
    { weekNumber: 38, phaseNameEN: 'The Build (On-Site Start)', phaseNameNL: 'De bouw (Start op locatie)', dateRange: '15 – 21 Sep', status: 'build', descriptionEN: 'Installation of frame and roof system on location.', descriptionNL: 'Plaatsing van het gebint en daksysteem op locatie bij de klant.' },
    { weekNumber: 39, phaseNameEN: 'The Build (Finishing)', phaseNameNL: 'De bouw (Afwerking)', dateRange: '22 – 28 Sep', status: 'build', descriptionEN: 'Sliding door installation, electrical work, and fascia finishing.', descriptionNL: 'Montage schuifpui, elektra en boeiboord afwerking.' },
    { weekNumber: 40, phaseNameEN: 'Delivery & Handover', phaseNameNL: 'Oplevering', dateRange: '29 Sep – 05 Oct', status: 'planned', descriptionEN: 'Final walkthrough, handover checklist sign-off, and key handover.', descriptionNL: 'Samen doorlopen van de opleverchecklist en sleuteloverdracht.' }
  ];

  const scheduleToRender = Array.isArray(weekSchedule) && weekSchedule.length > 0
    ? weekSchedule
    : defaultSchedule;

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(() => {
    const activeIdx = scheduleToRender.findIndex(w => w.status === 'now');
    return activeIdx >= 0 ? activeIdx : 0;
  });

  const selectedWeekRaw = scheduleToRender[selectedWeekIndex] || scheduleToRender[0];
  const selectedWeek = {
    ...selectedWeekRaw,
    phaseNameNL: selectedWeekRaw.phaseNameEN || selectedWeekRaw.phaseNameNL,
    descriptionNL: selectedWeekRaw.descriptionEN || selectedWeekRaw.descriptionNL
  };

  const getWeekColor = (status, isSelected) => {
    if (isSelected) {
      return 'bg-primary text-cream border-primary ring-2 ring-primary/30 font-bold scale-[1.03] shadow-md';
    }
    switch (status) {
      case 'done':
        return 'bg-green-50 text-green-800 border-green-300 hover:bg-green-100';
      case 'now':
        return 'bg-primary/20 text-primary border-primary hover:bg-primary/30';
      case 'prep':
        return 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100';
      case 'materials':
        return 'bg-[#EDE8DF] text-primary border-[#D6CFC2] hover:bg-[#E2DDD2]';
      case 'build':
        return 'bg-accent/15 text-accent border-accent/40 hover:bg-accent/25';
      default:
        return 'bg-white text-dark/60 border-[#D6CFC2] hover:border-primary/40';
    }
  };

  return (
    <Card title="Construction Schedule & Weeks" icon={Calendar}>

      <div className="space-y-4 font-body">
        {/* Horizontal Week Bar Container (Scrollable on mobile) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin max-w-full">
            {scheduleToRender.map((w, idx) => {
              const isSelected = idx === selectedWeekIndex;
              return (
                <button
                  key={w.weekNumber || idx}
                  type="button"
                  onClick={() => setSelectedWeekIndex(idx)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center px-3.5 py-2.5 rounded-xl border text-xs transition-all cursor-pointer min-w-[76px] ${getWeekColor(
                    w.status,
                    isSelected
                  )}`}
                >
                  <span className="text-[10px] uppercase font-mono opacity-80">Wk {w.weekNumber}</span>
                  <span className="font-bold font-heading text-xs mt-0.5 truncate max-w-[70px]">
                    {w.phaseNameNL ? w.phaseNameNL.split(' ')[0] : `Wk ${w.weekNumber}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Week Detail Card */}
        <WeekCard weekData={selectedWeek} />
      </div>
    </Card>
  );
}
