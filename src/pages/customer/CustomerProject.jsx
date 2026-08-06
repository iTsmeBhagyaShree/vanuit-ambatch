import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { CheckCircle2, Circle, Clock, Calendar, MapPin, Wrench, ShieldCheck, Compass, Sparkles } from 'lucide-react';

export default function CustomerProject() {
  const { t, language } = useLanguage();

  const getDisplayValue = (key, val) => {
    if (language !== 'EN') return val;
    if (key === 'address' && val === 'Keizersgracht 420, 1016 GC Amsterdam') return '420 King Street, 1016 GC London';
    if (key === 'craftsman' && val === 'Sven Hoek (Hoek Bouw)') return 'Sven Hoek (Hoek Construction)';
    if (key === 'customer' && val === 'Jan de Vries') return 'John Miller';
    return val;
  };

  const currentProject = {
    id: 'P-2001',
    name: 'Luxury Outdoor Kitchen Amsterdam',
    division: 'Buitenkeukens op maat',
    customer: 'Jan de Vries',
    address: 'Keizersgracht 420, 1016 GC Amsterdam',
    expectedDelivery: '15 November 2026',
    craftsman: 'Sven Hoek (Hoek Bouw)',
    progress: 45
  };

  const timelineSteps = [
    { 
      title: language === 'EN' ? '1. Quote Accepted' : '1. Offerte Akkoord', 
      date: '01 Oct 2026', 
      status: 'completed', 
      desc: language === 'EN' ? 'Quote Q-4001 approved and deposit received.' : 'Offerte Q-4001 goedgekeurd en aanbetaling ontvangen.' 
    },
    { 
      title: language === 'EN' ? '2. Materials Ordered & Checked' : '2. Materialen Besteld & Gecontroleerd', 
      date: '05 Oct 2026', 
      status: 'completed', 
      desc: language === 'EN' ? 'Solid teak wood and granite countertop delivered to workshop.' : 'Massief teak hout en granieten werkblad geleverd in werkplaats.' 
    },
    { 
      title: language === 'EN' ? '3. Workshop Construction' : '3. Werkplaats Constructie', 
      date: '15 Oct 2026', 
      status: 'active', 
      desc: language === 'EN' ? 'Craftsman Sven Hoek is currently building the teak frame and concrete slab.' : 'Vakman Sven Hoek bouwt momenteel het teakhouten frame en betonblad.' 
    },
    { 
      title: language === 'EN' ? '4. Delivery & On-Site Assembly' : '4. Oplevering & Locatie Montage', 
      date: language === 'EN' ? '15 Nov 2026 (Expected)' : '15 Nov 2026 (Verwacht)', 
      status: 'pending', 
      desc: language === 'EN' ? 'Connecting taps and final inspection at your location in Amsterdam.' : 'Kranen aansluiten en eindinspectie op uw locatie in Amsterdam.' 
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43]">
      {/* Read-Only Header Banner */}
      <div className="bg-[#EDE8DF] border border-[#C4BEB3] p-4 sm:p-6 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-accent">{currentProject.id}</span>
              <Badge variant="primary">{language === 'EN' ? 'Custom Outdoor Kitchens' : currentProject.division}</Badge>
            </div>
            <h2 className="text-lg sm:text-2xl font-heading font-bold text-primary mt-1 leading-snug">{currentProject.name}</h2>
          </div>
          <div className="bg-white/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-[#D6CFC2] text-left sm:text-right w-full sm:w-auto">
            <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Expected Delivery' : 'Verwachte Oplevering'}</span>
            <span className="text-xs font-bold text-primary flex items-center gap-1 mt-0.5 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-accent flex-shrink-0" /> {currentProject.expectedDelivery}
            </span>
          </div>
        </div>

        {/* Project Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#D6CFC2]/60 text-xs">
          <div className="flex items-center gap-2 bg-white/70 p-2 sm:p-2.5 rounded-xl border border-[#D6CFC2]/40 min-w-0">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Delivery Location' : 'Opleverlocatie'}</span>
              <span className="font-semibold text-dark truncate block">{getDisplayValue('address', currentProject.address)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/70 p-2 sm:p-2.5 rounded-xl border border-[#D6CFC2]/40 min-w-0">
            <Wrench className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-dark/50 font-bold uppercase block">{language === 'EN' ? 'Assigned Craftsman' : 'Toegewezen Vakman'}</span>
              <span className="font-semibold text-primary truncate block">{getDisplayValue('craftsman', currentProject.craftsman)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Read-Only Project Timeline */}
      <Card title={language === 'EN' ? 'Project Progress Timeline' : 'Projectvoortgang Tijdlijn'} icon={Compass}>
        <div className="relative border-l-2 border-[#D6CFC2] ml-2.5 sm:ml-4 mt-4 mb-4 space-y-6 sm:space-y-8">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8">
              {/* Icon marker */}
              <div className="absolute -left-[17px] top-0.5 bg-[#EDE8DF] p-1">
                {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-600 bg-white rounded-full" />}
                {step.status === 'active' && <Clock className="w-6 h-6 text-primary bg-white rounded-full animate-pulse" />}
                {step.status === 'pending' && <Circle className="w-6 h-6 text-dark/30 bg-white rounded-full" />}
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2">
                  <h4 className={`text-xs sm:text-sm font-bold font-heading ${step.status === 'pending' ? 'text-dark/40' : 'text-primary'}`}>
                    {step.title}
                  </h4>
                  <span className="text-[10px] sm:text-xs font-mono text-dark/50 self-start sm:self-auto">{step.date}</span>
                </div>
                
                <p className="text-xs text-dark/60 leading-relaxed">{step.desc}</p>

                {step.status === 'active' && (
                  <div className="mt-3 bg-primary/10 border border-primary/20 p-3 sm:p-4 rounded-xl space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs">
                      <span className="font-bold text-primary flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" /> {language === 'EN' ? 'Current Phase: In Workshop Construction' : 'Huidige Fase: In Werkplaats Constructie'}
                      </span>
                      <span className="font-mono font-bold text-primary text-xs">{currentProject.progress}% {language === 'EN' ? 'Completed' : 'Compleet'}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${currentProject.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
