import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FileText, Download, Eye, Compass, ShieldCheck, CheckCircle, X, Printer } from 'lucide-react';
import { downloadDocumentPdf, downloadBlueprintPdf } from '../../utils/pdfGenerator';

import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerDocuments() {
  const { language } = useLanguage();
  const [toastMsg, setToastMsg] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [showAutoCADModal, setShowAutoCADModal] = useState(false);

  const sharedDocuments = [
    {
      id: 'DOC-101',
      title: language === 'EN' ? 'Custom Outdoor Kitchen Contract' : 'Overeenkomst Maatwerk Buitenkeuken',
      category: language === 'EN' ? 'Contract' : 'Contract',
      description: language === 'EN' ? 'Official signed agreement including specs, warranty terms, and payment milestones.' : 'Officieel ondertekende overeenkomst inclusief specificaties, garanties en betalingstermijnen.',
      name: 'Overeenkomst_Vanuit_Ambacht_Q4001.pdf',
      size: '2.4 MB',
      date: '2026-07-28'
    },
    {
      id: 'DOC-102',
      title: language === 'EN' ? '10-Year Solid Teak & Frame Warranty' : 'Garantiebewijs 10 Jaar Teakhout & Constructie',
      category: language === 'EN' ? 'Warranty' : 'Garantie',
      description: language === 'EN' ? 'Official 10-year structural warranty certificate for solid teak wood and steel framing.' : 'Officieel 10-jarig fabrieksgarantiecertificaat voor massief teakhout en stalen frame.',
      name: 'Garantiebewijs_Teakhout_10Jaar.pdf',
      size: '1.1 MB',
      date: '2026-08-01'
    },
    {
      id: 'DOC-103',
      title: language === 'EN' ? 'Maintenance Guide: Wood & Beton Cire' : 'Onderhoudsgids Hout & Beton Cire Werkblad',
      category: language === 'EN' ? 'Guide' : 'Handleiding',
      description: language === 'EN' ? 'Step-by-step care manual for maintaining polished concrete and teak oil treatment.' : 'Stap-voor-stap onderhoudsgids voor het behandelen van beton cire en teakhout olie.',
      name: 'Onderhoudsgids_Buitenkeuken_2026.pdf',
      size: '3.8 MB',
      date: '2026-08-02'
    },
    {
      id: 'DOC-104',
      title: language === 'EN' ? 'Delivery Inspection Protocol' : 'Opleveringsprotocol & Inspectieformulier',
      category: language === 'EN' ? 'Protocol' : 'Inspectie',
      description: language === 'EN' ? 'Quality assurance checklist signed by head craftsman Sven Hoek.' : 'Kwaliteitsborging checklist afgevinkt en goedgekeurd door meester-vakman Sven Hoek.',
      name: 'Opleveringsprotocol_Inspection_P2001.pdf',
      size: '850 KB',
      date: '2026-08-03'
    }
  ];

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Direct PDF download via jsPDF — no print dialog, no popup needed
  const handleDownloadPDF = (title, name, isBlueprint = false) => {
    let fileName;
    if (isBlueprint) {
      fileName = downloadBlueprintPdf({ id: name, name: title, customer: 'Klant', partner: 'Tim & Bram' });
    } else {
      fileName = downloadDocumentPdf({ name, id: name, category: 'Project Document', uploader: 'Vanuit Ambacht', date: new Date().toLocaleDateString('nl-NL') });
    }
    showToast(language === 'EN' ? `PDF downloaded: ${fileName}` : `PDF gedownload: ${fileName}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43] relative">
      {/* Toast Notification (Positioned nicely below header so no overlap) */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#3E4E36] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#2D3528] text-xs font-body"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
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
      <div className="p-4 sm:p-5 bg-slate-900 text-cyan-400 rounded-2xl border border-cyan-800 space-y-4 font-mono text-xs shadow-lg max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cyan-800 pb-3">
          <span className="flex items-center gap-2 font-bold text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            OFFICIAL SCHEMATIC BLUEPRINT (AUTOCAD SPEC V2)
          </span>
          <span className="bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded-md border border-cyan-800 font-bold text-[11px] self-start sm:self-auto">
            SCALE 1:20 • APPROVED
          </span>
        </div>

        {/* Blueprint Interactive Diagram Banner */}
        <div 
          onClick={() => setShowAutoCADModal(true)}
          className="py-6 px-4 text-center border border-dashed border-cyan-600/80 rounded-xl bg-slate-950/90 space-y-3 cursor-pointer hover:bg-slate-950 transition-all hover:border-cyan-400 group relative"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 border border-cyan-500/50 rounded-lg bg-cyan-950/60 text-xs font-bold whitespace-nowrap shadow-inner">
            <span className="bg-cyan-900/80 text-cyan-200 px-2.5 py-1 rounded border border-cyan-700">3.5m TEAK FRAME</span>
            <span className="text-cyan-400 font-extrabold">═══</span>
            <span className="bg-cyan-900/80 text-cyan-200 px-2.5 py-1 rounded border border-cyan-700">CONCRETE SLAB</span>
            <span className="text-cyan-400 font-extrabold">═══</span>
            <span className="bg-cyan-900/80 text-cyan-200 px-2.5 py-1 rounded border border-cyan-700">SINK & KAMADO CUTOUT</span>
          </div>
          <p className="text-[11px] text-cyan-400/90 leading-tight">
            {language === 'EN' 
              ? 'Click to open interactive AutoCAD 3D layout viewer • Verified by Tim & Bram' 
              : 'Klik om de interactieve AutoCAD 3D tekening te openen • Geverifieerd door Tim & Bram'}
          </p>
          <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/60 inline-block group-hover:scale-105 transition-transform">
            🔍 {language === 'EN' ? 'Click to Inspect Blueprint' : 'Klik voor Tekening Inspectie'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 text-xs">
          <span className="text-cyan-300 font-bold truncate">BLU-P2001-AUTOCAD-SPEC-V2.pdf (4.2 MB)</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAutoCADModal(true)}
              className="flex-1 sm:flex-none text-cyan-300 border-cyan-700 hover:bg-cyan-950 text-xs py-1.5"
            >
              <Eye className="w-3.5 h-3.5 mr-1" />
              {language === 'EN' ? 'View Spec' : 'Bekijk Tekening'}
            </Button>
            <button
              onClick={() => handleDownloadPDF('Official AutoCAD Blueprint Specification', 'BLU-P2001-AUTOCAD-SPEC-V2.pdf', true)}
              className="flex-1 sm:flex-none px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {language === 'EN' ? 'Download PDF' : 'Download Tekening (PDF)'}
            </button>
          </div>
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
                  <p className="text-[10px] text-dark/40 font-mono mt-1">
                    {language === 'EN' ? 'File:' : 'Bestand:'} {doc.name} • {doc.size} • {language === 'EN' ? 'Date:' : 'Datum:'} {doc.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0 w-full sm:w-auto justify-end">
                <Button size="sm" variant="outline" onClick={() => setSelectedBlueprint(doc)} className="text-xs py-1.5">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  {language === 'EN' ? 'View' : 'Bekijk'}
                </Button>
                <Button size="sm" onClick={() => handleDownloadPDF(doc.title, doc.name, false)} className="text-xs py-1.5 bg-primary text-white">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  {language === 'EN' ? 'Download PDF' : 'Download PDF'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* DOCUMENT PREVIEW MODAL */}
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
                <button onClick={() => setSelectedBlueprint(null)} className="p-1 text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#D6CFC2]/60 space-y-2">
                <p><span className="font-bold text-dark">{language === 'EN' ? 'Filename:' : 'Bestandsnaam:'}</span> {selectedBlueprint.name}</p>
                <p><span className="font-bold text-dark">{language === 'EN' ? 'Size:' : 'Grootte:'}</span> {selectedBlueprint.size}</p>
                <p><span className="font-bold text-dark">{language === 'EN' ? 'Date Shared:' : 'Datum Gedeeld:'}</span> {selectedBlueprint.date}</p>
                <p className="text-dark/70 pt-2 border-t border-[#D6CFC2]/40 leading-relaxed">{selectedBlueprint.description}</p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{language === 'EN' ? 'Verified digital signature by Vanuit Ambacht Admin Team.' : 'Geverifieerde digitale handtekening van Vanuit Ambacht.'}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedBlueprint(null)}>
                  {language === 'EN' ? 'Close' : 'Sluiten'}
                </Button>
                <Button onClick={() => { handleDownloadPDF(selectedBlueprint.title, selectedBlueprint.name, false); setSelectedBlueprint(null); }}>
                  <Download className="w-3.5 h-3.5 mr-1" />
                  {language === 'EN' ? 'Download PDF' : 'Download PDF'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTOCAD BLUEPRINT INSPECTOR MODAL */}
      <AnimatePresence>
        {showAutoCADModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/80 backdrop-blur-xs" onClick={() => setShowAutoCADModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-slate-950 border border-cyan-800 rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-cyan-400 font-mono text-xs">
              <div className="flex justify-between items-start border-b border-cyan-800 pb-3">
                <div>
                  <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">AUTOCAD SPECIFICATION VIEWER</span>
                  <h3 className="text-xl font-bold text-cyan-200 mt-0.5">BLU-P2001-AUTOCAD-SPEC-V2.pdf</h3>
                </div>
                <button onClick={() => setShowAutoCADModal(false)} className="p-1 text-cyan-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-slate-900 border border-cyan-700/80 rounded-xl space-y-4 text-center">
                <div className="text-cyan-300 font-bold text-sm">ARCHITECTURAL SCHEMATIC DRAWING (3.5m OUTDOOR KITCHEN)</div>
                <div className="py-8 px-4 border-2 border-dashed border-cyan-500/60 rounded-xl bg-slate-950 space-y-4">
                  <div className="flex justify-center items-center gap-2 text-sm font-bold text-cyan-200">
                    <span className="p-2 border border-cyan-600 rounded bg-cyan-950">[3.5m TEAK FRAME]</span>
                    <span>═══</span>
                    <span className="p-2 border border-cyan-600 rounded bg-cyan-950">[GRANITE WORKTOP]</span>
                    <span>═══</span>
                    <span className="p-2 border border-cyan-600 rounded bg-cyan-950">[KAMADO BBQ]</span>
                  </div>
                  <p className="text-xs text-cyan-300/80">Dimensions: 350cm (W) x 85cm (D) x 92cm (H) • Frame Material: Grade-A Teak • Slab: 8cm Beton Cire</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-cyan-400">
                  <span>Drawn by: Bram (Head Designer)</span>
                  <span>Approved: 2026-07-29</span>
                  <span>Scale: 1:20</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-cyan-500">Official Vanuit Ambacht CAD Specification File</span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAutoCADModal(false)} className="text-cyan-400 border-cyan-800 hover:bg-cyan-950">
                    {language === 'EN' ? 'Close' : 'Sluiten'}
                  </Button>
                  <button onClick={() => { handleDownloadPDF('Official AutoCAD Blueprint Specification', 'BLU-P2001-AUTOCAD-SPEC-V2.pdf', true); setShowAutoCADModal(false); }} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
                    <Download className="w-4 h-4" />
                    {language === 'EN' ? 'Download PDF' : 'Download Tekening (PDF)'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
