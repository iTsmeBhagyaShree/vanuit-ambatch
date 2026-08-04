import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FileText, Download, Eye, Compass, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerDocuments() {
  const { t, language } = useLanguage();
  const [toastMsg, setToastMsg] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);

  const sharedDocuments = [];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDownload = (docName) => {
    showToast(`Download gestart: ${docName}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43] relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs font-body">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">
          {language === 'EN' ? 'Shared Blueprints & Documents' : 'Gedeelde Bouwtekeningen & Documenten'}
        </h2>
        <p className="text-dark/60 text-sm mt-1">
          {language === 'EN' 
            ? 'View and download approved AutoCAD specifications, contracts, and maintenance guides for your project.' 
            : 'Bekijk en download goedgekeurde AutoCAD specificaties, contracten en onderhoudsgidsen van uw project.'}
        </p>
      </div>

      {/* AutoCAD Interactive Blueprint Box */}
      <div className="p-4 bg-slate-900 text-cyan-400 rounded-2xl border border-cyan-800 space-y-3 font-mono text-xs shadow-md">
        <div className="flex justify-between items-center text-[10px] text-cyan-300 border-b border-cyan-800 pb-2">
          <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-cyan-400" /> OFFICIAL SCHEMATIC BLUEPRINT (AUTOCAD SPEC)</span>
          <span>SCALE 1:20</span>
        </div>

        <div className="py-6 text-center border border-dashed border-cyan-700 rounded-xl bg-slate-950/70 space-y-2">
          <p className="text-cyan-200 font-bold text-sm">┌────────────────────────────────────────────────────────┐</p>
          <p className="text-cyan-300">[ 3.5m TEAK FRAME ] ═══ [ CONCRETE SLAB ] ═══ [ SINK CUTOUT ]</p>
          <p className="text-cyan-200 font-bold text-sm">└────────────────────────────────────────────────────────┘</p>
          <p className="text-[10px] text-cyan-500">
            {language === 'EN' 
              ? 'Verified by Tim & Bram • Includes cutout for Kamado Joe Ceramic Grill' 
              : 'Geverifieerd door Tim & Bram • Inclusief uitsparing voor Kamado Joe Ceramic Grill'}
          </p>
        </div>

        <div className="flex justify-between items-center pt-1 text-[11px]">
          <span className="text-cyan-300 font-bold">BLU-P2001-AUTOCAD-SPEC-V2.pdf</span>
          <button
            onClick={() => handleDownload('BLU-P2001-AUTOCAD-SPEC-V2.pdf')}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> {language === 'EN' ? 'Download Blueprint (PDF)' : 'Download Teckening (PDF)'}
          </button>
        </div>
      </div>

      {/* Document List */}
      <Card title={language === 'EN' ? 'All Project Documents & Contracts' : 'Alle Project Documenten & Contracten'} icon={FileText}>
        <div className="space-y-3 mt-2">
          {sharedDocuments.map((doc) => (
            <div key={doc.id} className="p-4 bg-[#F8F7F4] border border-[#D6CFC2]/60 rounded-xl hover:border-primary/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-dark font-body">{doc.title}</h4>
                    <Badge variant="primary" className="text-[9px]">{doc.category}</Badge>
                  </div>
                  <p className="text-xs text-dark/60 mt-0.5">{doc.description}</p>
                  <p className="text-[10px] text-dark/40 font-mono mt-1">Bestand: {doc.name} • {doc.size} • Datum: {doc.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <Button size="sm" variant="outline" icon={Eye} onClick={() => setSelectedBlueprint(doc)}>
                  Bekijk
                </Button>
                <Button size="sm" icon={Download} onClick={() => handleDownload(doc.name)}>
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {selectedBlueprint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-xs" onClick={() => setSelectedBlueprint(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-3">
                <div>
                  <Badge variant="primary">{selectedBlueprint.category}</Badge>
                  <h3 className="text-lg font-heading font-bold text-primary mt-1">{selectedBlueprint.title}</h3>
                </div>
                <button onClick={() => setSelectedBlueprint(null)} className="p-1 text-dark/40 hover:text-dark">✕</button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#D6CFC2]/60 space-y-2">
                <p><span className="font-bold text-dark">Bestandsnaam:</span> {selectedBlueprint.name}</p>
                <p><span className="font-bold text-dark">Grootte:</span> {selectedBlueprint.size}</p>
                <p><span className="font-bold text-dark">Datum Gedeeld:</span> {selectedBlueprint.date}</p>
                <p className="text-dark/70 pt-2 border-t border-[#D6CFC2]/40">{selectedBlueprint.description}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedBlueprint(null)}>Sluiten</Button>
                <Button icon={Download} onClick={() => { handleDownload(selectedBlueprint.name); setSelectedBlueprint(null); }}>Download PDF</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
