import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Phone, Mail, MessageCircle, Send, X, CheckCircle, Copy, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerContact() {
  const { t, language } = useLanguage();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: language === 'EN' ? 'Question regarding project P-2001' : 'Vraag over project P-2001',
    message: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@vanuitambacht.nl');
    setCopied(true);
    showToast(language === 'EN' ? '📋 Email address (info@vanuitambacht.nl) copied to clipboard!' : '📋 E-mailadres (info@vanuitambacht.nl) gekopieerd naar klembord!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setEmailModalOpen(false);
      setEmailForm({ subject: '', message: '' });
      showToast(language === 'EN' 
        ? '✅ Email successfully sent to Tim & Bram (info@vanuitambacht.nl)! We will respond within 24 hours.' 
        : '✅ E-mail succesvol verzonden naar Tim & Bram (info@vanuitambacht.nl)! Wij nemen binnen 24 uur contact op.'
      );
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-body text-[#4A4A43] relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-xl text-xs font-body max-w-md border border-cream-dark/30"
          >
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">{t('common.contact')}</h2>
        <p className="text-dark/60 text-sm mt-1">{t('customerPortal.contactDesc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card p="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EDE8DF] border border-[#C4BEB3] flex items-center justify-center text-primary text-xl font-bold font-heading shadow-inner">
              T&B
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-primary">Tim & Bram</h3>
              <p className="text-sm text-dark/60">{t('customerPortal.projectManagers')}</p>
              <p className="text-xs text-dark/40 mt-0.5 font-mono">info@vanuitambacht.nl</p>
            </div>
            
            <div className="w-full space-y-3 pt-2">
              <a
                href="https://wa.me/31612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all rounded-xl font-bold text-xs"
              >
                <MessageCircle className="w-4 h-4" /> {t('customerPortal.whatsappUs')}
              </a>

              <a
                href="tel:+31612345678"
                onClick={() => showToast(language === 'EN' ? '📞 Phone number: +31 6 12345678' : '📞 Telefoonnummer: +31 6 12345678')}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-primary hover:bg-primary/20 transition-all rounded-xl font-bold text-xs"
              >
                <Phone className="w-4 h-4" /> {t('customerPortal.callDirectly')} (+31 6 12345678)
              </a>

              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#F8F7F4] text-dark/80 hover:bg-[#EDE8DF] border border-[#D6CFC2] transition-all rounded-xl font-bold text-xs shadow-xs"
              >
                <Mail className="w-4 h-4 text-primary" /> {t('customerPortal.sendEmail')}
              </button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card p="p-6">
          <div className="space-y-4 text-xs">
            <h3 className="font-heading font-bold text-lg text-primary">{language === 'EN' ? 'Opening Hours & Location' : 'Openingstijden & Locatie'}</h3>
            <div className="space-y-2 text-dark/70">
              <div className="flex justify-between py-1.5 border-b border-[#D6CFC2]/40">
                <span className="font-semibold">{language === 'EN' ? 'Monday - Friday:' : 'Maandag - Vrijdag:'}</span>
                <span className="font-bold text-primary">08:00 - 18:00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D6CFC2]/40">
                <span className="font-semibold">{language === 'EN' ? 'Saturday:' : 'Zaterdag:'}</span>
                <span className="font-bold text-primary">09:00 - 16:00</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-semibold">{language === 'EN' ? 'Sunday:' : 'Zondag:'}</span>
                <span className="text-dark/40 italic">{language === 'EN' ? 'Closed' : 'Gesloten'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D6CFC2]/60">
              <p className="font-bold text-dark">{language === 'EN' ? 'Werkplaats & Showroom:' : 'Werkplaats & Showroom:'}</p>
              <p className="text-dark/60 mt-0.5">Herengracht 1, 1015 BK Amsterdam</p>
            </div>
          </div>
        </Card>
      </div>

      {/* SEND EMAIL / CONTACT MODAL */}
      <AnimatePresence>
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/60 backdrop-blur-xs"
              onClick={() => setEmailModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[#D6CFC2]">
                <div>
                  <h3 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent" />
                    {language === 'EN' ? 'Send Email to Tim & Bram' : 'E-mail Sturen naar Tim & Bram'}
                  </h3>
                  <p className="text-xs text-dark/60">info@vanuitambacht.nl</p>
                </div>
                <button onClick={() => setEmailModalOpen(false)} className="p-1 text-dark/40 hover:text-dark">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-dark/70 mb-1 uppercase">
                    {language === 'EN' ? 'Recipient' : 'Ontvanger'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Tim & Bram (info@vanuitambacht.nl)"
                    className="w-full px-3 py-2 bg-white/70 border border-[#D6CFC2] rounded-lg text-dark/60 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-dark/70 mb-1 uppercase">
                    {language === 'EN' ? 'Subject' : 'Onderwerp'}
                  </label>
                  <input
                    type="text"
                    required
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-dark font-bold focus:outline-none"
                    placeholder={language === 'EN' ? 'e.g. Question about my outdoor kitchen delivery' : 'bijv. Vraag over oplevering buitenkeuken'}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-dark/70 mb-1 uppercase">
                    {language === 'EN' ? 'Your Message' : 'Uw Bericht'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={emailForm.message}
                    onChange={(e) => setEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg text-dark focus:outline-none leading-relaxed"
                    placeholder={language === 'EN' ? 'Type your message here...' : 'Typ hier uw bericht aan Tim & Bram...'}
                  />
                </div>

                <div className="pt-2 border-t border-[#D6CFC2] flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-accent" />}
                    <span>{copied ? (language === 'EN' ? 'Copied!' : 'Gekopieerd!') : (language === 'EN' ? 'Copy Email Address' : 'Kopieer E-mailadres')}</span>
                  </button>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button type="button" variant="outline" onClick={() => setEmailModalOpen(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={sending} icon={Send}>
                      {sending 
                        ? (language === 'EN' ? 'Sending...' : 'Verzenden...') 
                        : (language === 'EN' ? 'Send Message' : 'Bericht Verzenden')}
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <a
                    href={`mailto:info@vanuitambacht.nl?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.message)}`}
                    className="text-[10px] text-dark/50 hover:text-dark flex items-center justify-center gap-1 underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {language === 'EN' ? 'Or open in your device mail app' : 'Of open in uw eigen e-mailprogramma'}
                  </a>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
