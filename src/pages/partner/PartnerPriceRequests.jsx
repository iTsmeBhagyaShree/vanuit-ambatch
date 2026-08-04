import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import { FileText, Send, Calendar, Banknote, Clock, CheckCircle2, ChevronDown, ChevronUp, MessageSquare, AlertCircle, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OPEN_REQUESTS = [];

const SUBMITTED_LOG = [];

export default function PartnerPriceRequests() {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState([...SUBMITTED_LOG]);
  const [open, setOpen] = useState([...OPEN_REQUESTS]);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState('open');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleInput = (reqId, field, value) => {
    setFormData(prev => ({ ...prev, [reqId]: { ...(prev[reqId] || {}), [field]: value } }));
  };

  const handleSubmit = (req) => {
    const form = formData[req.id] || {};
    if (!form.price || !form.validity || !form.leadTime) {
      showToast(language === 'NL' ? '⚠️ Vul alle verplichte velden in.' : '⚠️ Please fill all required fields.');
      return;
    }
    const submittedOffer = {
      ...req,
      submittedOn: new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' }),
      price: `€ ${parseFloat(form.price).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`,
      validity: form.validity,
      leadTime: form.leadTime,
      remarks: form.remarks || '—',
      adminStatus: 'In Review',
    };
    setSubmitted(prev => [submittedOffer, ...prev]);
    setOpen(prev => prev.filter(r => r.id !== req.id));
    setExpanded(null);
    showToast(language === 'NL' ? `✅ Offerte ${req.id} succesvol ingediend!` : `✅ Offer ${req.id} submitted!`);
  };

  return (
    <div className="space-y-6 font-body text-[#4A4A43] relative">

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 8 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs font-body"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'NL' ? 'Prijsaanvragen Inbox' : 'Price Requests Inbox'}
          </h2>
        </div>
        <p className="text-dark/50 text-sm mt-1">
          {language === 'NL'
            ? 'Bekijk open aanvragen en dien uw bouwprijs, geldigheidsduur, levertijd en opmerkingen in.'
            : 'Review open requests and submit your build price, validity, lead time, and remarks.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#D6CFC2]">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-2 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'open' ? 'border-primary text-primary' : 'border-transparent text-dark/50 hover:text-dark'}`}
        >
          <AlertCircle className="w-4 h-4" />
          {language === 'NL' ? 'Openstaand' : 'Open Requests'}
          {open.length > 0 && (
            <span className="bg-accent/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{open.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`pb-2 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'submitted' ? 'border-primary text-primary' : 'border-transparent text-dark/50 hover:text-dark'}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {language === 'NL' ? 'Ingediende Offertes' : 'Submitted Offers'}
          {submitted.length > 0 && (
            <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{submitted.length}</span>
          )}
        </button>
      </div>

      {/* OPEN REQUESTS TAB */}
      {activeTab === 'open' && (
        <div className="space-y-4">
          {open.length === 0 ? (
            <div className="text-center py-12 text-dark/40 text-sm font-body">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-400" />
              {language === 'NL' ? 'Alle aanvragen zijn ingediend.' : 'All requests have been submitted.'}
            </div>
          ) : (
            open.map(req => {
              const isOpen = expanded === req.id;
              const form = formData[req.id] || {};
              return (
                <Card key={req.id} className="overflow-hidden" p="p-0">
                  {/* Card Header */}
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#F8F7F4] transition-colors"
                    onClick={() => setExpanded(isOpen ? null : req.id)}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-accent">{req.id}</span>
                          <Badge variant="warning">Open</Badge>
                          <Badge variant="primary">{req.division}</Badge>
                        </div>
                        <h3 className="font-bold text-primary font-heading text-base mt-0.5 truncate">{req.project}</h3>
                        <p className="text-xs text-dark/50">{language === 'NL' ? 'Klant:' : 'Customer:'} {req.customer} · {language === 'NL' ? 'Deadline klant:' : 'Client deadline:'} <strong className="text-primary">{req.deadline}</strong></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="block text-[10px] text-dark/40 font-bold uppercase">{language === 'NL' ? 'Indienen voor' : 'Submit by'}</span>
                        <span className="text-xs font-bold text-primary flex items-center gap-1"><Calendar className="w-3 h-3 text-accent" />{req.dueDate}</span>
                      </div>
                      {isOpen
                        ? <ChevronUp className="w-5 h-5 text-dark/40" />
                        : <ChevronDown className="w-5 h-5 text-dark/40" />
                      }
                    </div>
                  </div>

                  {/* Expandable Form */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-4 border-t border-[#D6CFC2]/60 pt-4">
                          {/* Specs */}
                          <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/40">
                            <p className="text-[10px] font-bold uppercase text-dark/40 mb-1">{language === 'NL' ? 'Projectspecificaties' : 'Project Specs'}</p>
                            <p className="text-sm text-dark font-body">{req.specs}</p>
                          </div>

                          {/* Form Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Price */}
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-dark/50 mb-1">
                                {language === 'NL' ? 'Uw bouwprijs (€) *' : 'Your Build Price (€) *'}
                              </label>
                              <div className="relative">
                                <Banknote className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                                <input
                                  type="number"
                                  value={form.price || ''}
                                  onChange={e => handleInput(req.id, 'price', e.target.value)}
                                  placeholder="bijv. 4500"
                                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                              </div>
                            </div>

                            {/* Validity */}
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-dark/50 mb-1">
                                {language === 'NL' ? 'Geldigheid *' : 'Validity *'}
                              </label>
                              <select
                                value={form.validity || ''}
                                onChange={e => handleInput(req.id, 'validity', e.target.value)}
                                className="w-full px-3 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                              >
                                <option value="">{language === 'NL' ? 'Selecteer...' : 'Select...'}</option>
                                <option value="14 dagen">14 dagen</option>
                                <option value="30 dagen">30 dagen</option>
                                <option value="45 dagen">45 dagen</option>
                                <option value="60 dagen">60 dagen</option>
                              </select>
                            </div>

                            {/* Lead Time */}
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-dark/50 mb-1">
                                {language === 'NL' ? 'Levertijd (weken) *' : 'Lead Time (weeks) *'}
                              </label>
                              <div className="relative">
                                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                                <input
                                  type="number"
                                  value={form.leadTime || ''}
                                  onChange={e => handleInput(req.id, 'leadTime', e.target.value)}
                                  placeholder="bijv. 4"
                                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Remarks */}
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-dark/50 mb-1 flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {language === 'NL' ? 'Opmerkingen (optioneel)' : 'Remarks (optional)'}
                            </label>
                            <textarea
                              value={form.remarks || ''}
                              onChange={e => handleInput(req.id, 'remarks', e.target.value)}
                              rows={3}
                              placeholder={language === 'NL' ? 'Bijv. prijs incl. levering, montage op locatie, garantieperiode...' : 'e.g. price incl. delivery, on-site assembly, warranty period...'}
                              className="w-full px-3 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            />
                          </div>

                          {/* Submit Button */}
                          <button
                            onClick={() => handleSubmit(req)}
                            className="w-full py-3 bg-primary text-cream rounded-xl flex items-center justify-center gap-2 font-bold font-body hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md"
                          >
                            <Send className="w-4 h-4" />
                            {language === 'NL' ? `Offerte Indienen voor ${req.project}` : `Submit Offer for ${req.project}`}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* SUBMITTED OFFERS LOG TAB */}
      {activeTab === 'submitted' && (
        <div className="space-y-4">
          {submitted.length === 0 ? (
            <div className="text-center py-12 text-dark/40 text-sm">
              <Inbox className="w-10 h-10 mx-auto mb-3 text-dark/20" />
              {language === 'NL' ? 'Nog geen offertes ingediend.' : 'No offers submitted yet.'}
            </div>
          ) : (
            submitted.map(offer => (
              <Card key={offer.id} className="border border-green-200/60 bg-[#F8FFF8]/60">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-mono font-bold text-green-600">{offer.id}</span>
                        <Badge variant="success">{language === 'NL' ? 'Ingediend' : 'Submitted'}</Badge>
                        <Badge variant={offer.adminStatus === 'In Review' ? 'warning' : 'success'}>
                          {language === 'NL'
                            ? (offer.adminStatus === 'In Review' ? 'In beoordeling' : offer.adminStatus)
                            : offer.adminStatus}
                        </Badge>
                      </div>
                      <h3 className="font-heading font-bold text-primary text-base">{offer.project}</h3>
                      <p className="text-xs text-dark/50">{language === 'NL' ? 'Klant:' : 'Customer:'} {offer.customer}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-dark/40 font-bold uppercase">{language === 'NL' ? 'Ingediend op' : 'Submitted On'}</span>
                      <span className="text-sm font-bold text-primary">{offer.submittedOn}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-[#D6CFC2]/40">
                      <p className="text-[10px] text-dark/40 font-bold uppercase mb-0.5">{language === 'NL' ? 'Bouwprijs' : 'Build Price'}</p>
                      <p className="font-bold text-primary text-sm">{offer.price}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#D6CFC2]/40">
                      <p className="text-[10px] text-dark/40 font-bold uppercase mb-0.5">{language === 'NL' ? 'Geldigheid' : 'Validity'}</p>
                      <p className="font-bold text-dark">{offer.validity}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#D6CFC2]/40">
                      <p className="text-[10px] text-dark/40 font-bold uppercase mb-0.5">{language === 'NL' ? 'Levertijd' : 'Lead Time'}</p>
                      <p className="font-bold text-dark">{offer.leadTime}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-[#D6CFC2]/40">
                      <p className="text-[10px] text-dark/40 font-bold uppercase mb-0.5">{language === 'NL' ? 'Status Admin' : 'Admin Status'}</p>
                      <p className="font-bold text-accent">{language === 'NL' ? (offer.adminStatus === 'In Review' ? 'In beoordeling' : offer.adminStatus) : offer.adminStatus}</p>
                    </div>
                  </div>

                  {offer.remarks && offer.remarks !== '—' && (
                    <div className="p-3 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2]/40 text-xs">
                      <p className="text-[10px] font-bold uppercase text-dark/40 mb-1">{language === 'NL' ? 'Opmerkingen' : 'Remarks'}</p>
                      <p className="text-dark/70">{offer.remarks}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
