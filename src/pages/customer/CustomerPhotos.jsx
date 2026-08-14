import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { Image as ImageIcon, Eye, X, Camera, Sparkles, CheckCircle2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import projectImg from '../../assets/outdoor_project_card.png';
import heroImg from '/dasbordes images.png';

export default function CustomerPhotos() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photosList, setPhotosList] = useState([]);

  const defaultPhotoUpdates = [
    {
      id: 'DF-1',
      projectId: 'PRJ-101',
      projectName: 'Luxury Teak Outdoor Kitchen',
      title: language === 'EN' ? 'Teak Wood Frame Construction' : 'Teakhouten Frame Constructie',
      phase: language === 'EN' ? 'Workshop Phase Date: 12 Oct 2026' : 'Werkplaats Fasedatum: 12 Okt 2026',
      description: language === 'EN' ? 'The solid teak wood frame has been cut to size and assembled by craftsman Sven Hoek.' : 'Het massieve teak houten frame is op maat gezaagd en gemonteerd door vakman Sven Hoek.',
      img: projectImg,
      craftsman: 'Sven Hoek'
    },
    {
      id: 'DF-2',
      projectId: 'PRJ-101',
      projectName: 'Luxury Teak Outdoor Kitchen',
      title: language === 'EN' ? 'Polishing Concrete Top & Grill Cutout' : 'Polijsten Betonblad & Grill Uitsparing',
      phase: language === 'EN' ? 'Workshop Phase Date: 18 Oct 2026' : 'Werkplaats Fasedatum: 18 Okt 2026',
      description: language === 'EN' ? 'The dark grey concrete top has been polished and provided with a water-repellent protective layer.' : 'Het donkergrijze betonblad is gepolijst en voorzien van waterafstotende beschermlaag.',
      img: heroImg,
      craftsman: 'Sven Hoek'
    },
    {
      id: 'DF-3',
      projectId: 'PRJ-102',
      projectName: 'Oak Wooden Canopy 6x4m',
      title: language === 'EN' ? 'Final Inspection & Quality Control' : 'Eindkeuring & Kwaliteitscontrole',
      phase: language === 'EN' ? 'Workshop Phase Date: 24 Oct 2026' : 'Werkplaats Fasedatum: 24 Okt 2026',
      description: language === 'EN' ? 'Tim & Bram have checked the drawers, hinges and cable ducts.' : 'Tim & Bram hebben de lades, scharnieren en kabeldoorvoeren gecontroleerd.',
      img: projectImg,
      craftsman: 'Tim & Bram (Admins)'
    }
  ];

  // Load photos dynamically from localStorage (Uploaded by Admin or Craftsmen)
  useEffect(() => {
    const loadPhotos = () => {
      try {
        const saved = localStorage.getItem('app_project_photos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Only show photos that are shared with customer (isShared !== false)
            const sharedOnly = parsed.filter(p => p.isShared !== false);
            
            // Deduplicate by ID
            const photoMap = new Map();
            sharedOnly.forEach(p => photoMap.set(p.id, p));
            defaultPhotoUpdates.forEach(p => {
              if (!photoMap.has(p.id)) photoMap.set(p.id, p);
            });

            setPhotosList(Array.from(photoMap.values()));
            return;
          }
        }
      } catch (e) {}
      setPhotosList(defaultPhotoUpdates);
    };

    loadPhotos();
    window.addEventListener('storage', loadPhotos);
    window.addEventListener('app_data_changed', loadPhotos);
    return () => {
      window.removeEventListener('storage', loadPhotos);
      window.removeEventListener('app_data_changed', loadPhotos);
    };
  }, [language, user]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-body text-[#4A4A43]">
      <div>
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'EN' ? 'Workshop Photo Updates (Build Gallery)' : 'Werkplaats Foto-Updates'}
          </h2>
        </div>
        <p className="text-dark/60 text-sm mt-1">{language === 'EN' ? 'Follow the construction of your outdoor kitchen live with photo updates directly from the craft workshop.' : 'Volg de bouw van uw buitenkeuken live met foto updates direct uit de ambachtelijke werkplaats.'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {photosList.map((photo) => (
          <Card key={photo.id} className="overflow-hidden hover:shadow-card-hover transition-all cursor-pointer group" p="p-0" onClick={() => setSelectedPhoto(photo)}>
            <div className="relative h-48 bg-cream-dark/20 overflow-hidden">
              <img src={photo.img} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
              
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#D6CFC2] text-[10px] font-bold text-primary flex items-center gap-1 max-w-[75%] truncate">
                <Briefcase className="w-3 h-3 text-accent flex-shrink-0" />
                <span className="truncate">[{photo.projectId || 'PRJ-101'}] {photo.projectName || 'Buitenkeuken'}</span>
              </div>
              
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#D6CFC2] text-[10px] font-bold text-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent" /> {language === 'EN' ? 'Photo' : 'Foto'} #{photo.id}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[10px] text-cyan-300 font-mono font-bold">{photo.phase}</p>
                <h4 className="font-heading font-bold text-white text-sm leading-tight truncate">{photo.title}</h4>
              </div>
            </div>

            <div className="p-3.5 space-y-2 text-xs">
              <p className="text-dark/70 line-clamp-2">{photo.description}</p>
              <div className="pt-2 border-t border-[#D6CFC2]/40 flex justify-between items-center text-[10px] text-dark/50">
                <span>{language === 'EN' ? 'Craftsman:' : 'Vakman:'} <strong className="text-primary">{photo.craftsman}</strong></span>
                <span className="font-bold text-accent hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> {language === 'EN' ? 'Enlarge' : 'Vergroten'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FULLSCREEN PHOTO PREVIEW MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-dark/85 backdrop-blur-md z-[99999]" onClick={() => setSelectedPhoto(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-5 shadow-2xl z-[100000] space-y-3 text-xs my-auto">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-2">
                <div>
                  <span className="text-[10px] font-mono text-accent font-bold">{selectedPhoto.phase}</span>
                  <h3 className="text-lg font-heading font-bold text-primary">{selectedPhoto.title}</h3>
                </div>
                <button onClick={() => setSelectedPhoto(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <div className="rounded-xl overflow-hidden max-h-[50vh] bg-black/90 border border-[#D6CFC2] flex items-center justify-center p-2">
                <img src={selectedPhoto.img} alt={selectedPhoto.title} className="max-h-[48vh] w-auto max-w-full object-contain mx-auto rounded-lg" />
              </div>

              <p className="text-dark/80 bg-white p-3 rounded-xl border border-[#D6CFC2]/60 text-xs">
                {selectedPhoto.description}
              </p>

              <div className="flex justify-end pt-1">
                <button onClick={() => setSelectedPhoto(null)} className="px-4 py-2 bg-primary text-cream font-bold rounded-xl text-xs hover:bg-primary/90">
                  {language === 'EN' ? 'Close' : 'Sluiten'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
